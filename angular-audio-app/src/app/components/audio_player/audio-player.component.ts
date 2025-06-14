import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.css'
})


export class AudioPlayerComponent implements OnInit {
  private ctx: AudioContext | undefined;
  private file: File | undefined;
  private source: AudioBufferSourceNode | undefined;
  private analyser: AnalyserNode | undefined;
  public isPlaying: boolean = false;
  
  constructor(){}

  ngOnInit(): void {
    AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContext();
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (file) {
      this.file = file
    } else {
      alert('Please select a valid file type (JPEG, PNG, or PDF)')
      input.value = ''
      this.file = undefined;
    }
  }

  async playAudio() 
  {
    if(this.ctx === undefined) return;
    if(this.file === undefined)
    {
        alert("ERROR: Select a file");
        return;
    }

    if(this.isPlaying)
    {
        this.source?.stop();
        this.isPlaying = false;
        this.hideWave();
    }
    else 
    {
        this.isPlaying = true;
        let buffer = await this.file.arrayBuffer();
        this.analyser = this.ctx.createAnalyser();
        this.source = this.ctx.createBufferSource();
        this.source.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
        this.source.buffer = await this.ctx.decodeAudioData(buffer);
        this.source.start();
        this.drawWave();
    }
  }

  hideWave = () => 
  {
        const canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
        const context = canvas.getContext("2d");
        canvas.style.background = "black";
  }

  drawWave = () =>
  {
        if(this.analyser === undefined) return;

        this.analyser.fftSize = 2048;
        let bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        bufferLength = this.analyser.frequencyBinCount;

        const canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
        const context = canvas.getContext("2d");
        canvas.width =  window.innerWidth;
        canvas.height =  window.innerHeight / 2;
        canvas.style.background = "black";
               
        if(context === null) return;
        context.strokeStyle = "lawngreen";

        context.beginPath();
        
        const margin = window.innerWidth / bufferLength;
        let x = 100;
        for (let i = 0; i < bufferLength;++i){
            // normalize the frequency data to fit our canvas
            let y = canvas.height - (dataArray[i] / 255 * (canvas.height / 2));
            
            if (i == 0){
                context.moveTo(x, window.innerWidth / 4)
            }else{
                context.lineTo(x,y);
            }
            x+=margin;
        }

        context.stroke()
        requestAnimationFrame(this.drawWave);
    }
}