import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';
import { PhotoComponent } from './photo/photo.component';
import { VideoComponent } from './video/video.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, MaterialModule ],
  declarations: [ AppComponent, PhotoComponent, VideoComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
