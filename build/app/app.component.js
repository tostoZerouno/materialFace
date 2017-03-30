"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var photo_component_1 = require("./photo/photo.component");
var AppComponent = (function () {
    function AppComponent() {
        this.name = 'Angular';
        this.text = "Clicca per cominciare!";
        this.btnState = false;
        this.icona = "play_arrow";
        this.menubtns = [];
    }
    AppComponent.prototype.onClick = function () {
        this.btnState = !this.btnState;
        this.text = this.btnState ? "Clicca per mettere in pausa!" : "Clicca per ricominciare!";
        this.icona = this.btnState ? "pause" : "play_arrow";
        console.log(this.text);
    };
    AppComponent.prototype.updateMenu = function () {
        this.menubtns = this.photoComponent.cams;
        console.log(this.menubtns);
    };
    AppComponent.prototype.selectSource = function (source) {
        this.photoComponent.selectSource(source);
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild(photo_component_1.PhotoComponent),
    __metadata("design:type", photo_component_1.PhotoComponent)
], AppComponent.prototype, "photoComponent", void 0);
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
], AppComponent);
exports.AppComponent = AppComponent;

//# sourceMappingURL=app.component.js.map
