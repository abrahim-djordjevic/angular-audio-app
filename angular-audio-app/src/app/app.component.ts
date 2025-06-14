import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component"
import { InfoComponent } from './components/info/info.component';
import { AudioPlayerComponent } from './components/audio_player/audio-player.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, InfoComponent, AudioPlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
}