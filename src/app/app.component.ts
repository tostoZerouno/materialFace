import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular';
  text = "Clicca per cominciare!";
  btnState=false;
  icona="play_arrow";

  onClick(){
    this.btnState=!this.btnState;
    this.text = this.btnState ? "Clicca per mettere in pausa!"  : "Clicca per ricominciare!";
    this.icona=this.btnState ? "pause" : "play_arrow";
    console.log(this.text);
  }
}
