import { Component, ViewChild } from '@angular/core';
import { PhotoComponent } from './photo/photo.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular';
  text = "Clicca per cominciare!";
  btnState = false;
  icona = "play_arrow";
  menubtns: any[] = [];

  @ViewChild(PhotoComponent)
  private photoComponent: PhotoComponent;

  onClick() {
    this.btnState = !this.btnState;
    this.text = this.btnState ? "Clicca per mettere in pausa!" : "Clicca per ricominciare!";
    this.icona = this.btnState ? "pause" : "play_arrow";
    console.log(this.text);


  }

  updateMenu() {
    this.menubtns = this.photoComponent.cams;
    console.log(this.menubtns);
  }

  selectSource(source: any) {
    this.photoComponent.selectSource(source);
  }
}
