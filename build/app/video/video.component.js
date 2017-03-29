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
var VideoComponent = (function () {
    function VideoComponent() {
        this.stop = new core_1.EventEmitter();
        this.videoSelect = document.getElementsByName("videoSelect")[0];
        this.cams = [];
        this.vid = {};
        this.bottone = "Ferma il Video";
        this.icona = "pause";
    }
    VideoComponent.prototype.selectSource = function (source) {
        console.log(source);
        //var videoSelect = (<any>document.getElementsByName("videoSelect")[0]);
        //console.log(videoSelect);
        var videoSource = source;
        this.vid = "" + (source);
        console.log("vid: " + this.vid);
        //var constraints  = { video: { deviceId: { exact: videoSource } } };
        var constraints = { video: { deviceId: videoSource } };
        this.stopStream();
        setTimeout(this.startStream(constraints), 150);
    };
    // note that "#video" is the name of the template variable in the video element
    VideoComponent.prototype.ngAfterViewInit = function () {
        var constraints = { video: true };
        //FIXME
        //var videoSource = this.videoSelect.value;
        //var constraints = { video: { deviceId: { exact: videoSource } } }
        this.startStream(constraints);
    };
    VideoComponent.prototype.onClick = function () {
        var _video = this.video.nativeElement;
        var videoSelect = document.getElementsByName("videoSelect")[0];
        var videoSource = videoSelect.value;
        console.log(videoSource);
        var constraints = { video: { deviceId: { exact: videoSource } } };
        if (!_video.paused) {
            this.stopStream();
            this.bottone = "Avvia il Video";
            this.icona = "play_arrow";
            this.stop.emit("stop");
        }
        else {
            this.startStream(constraints);
            this.bottone = "Ferma il Video";
            this.icona = "pause";
            this.stop.emit("start");
        }
    };
    VideoComponent.prototype.startStream = function (constraints) {
        var _this = this;
        var _video = this.video.nativeElement;
        /*let nav = <any>navigator;
        nav.getUserMedia = nav.getUserMedia || nav.mozGetUserMedia || nav.webkit.GetUserMedia;*/
        //if(navigator.mozGetUserMedia)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints)
                .then(function (stream) {
                _video.src = window.URL.createObjectURL(stream);
                console.log(_video.src);
                _this.localstream = stream;
                _video.load();
            });
        }
    };
    VideoComponent.prototype.stopStream = function () {
        var _video = this.video.nativeElement;
        //console.log(this.localstream);
        if (!_video.paused) {
            console.log("not paused");
            _video.pause();
            _video.src = "";
            this.localstream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        console.log("Video off");
    };
    VideoComponent.prototype.enumerate = function () {
        var component = this;
        navigator.mediaDevices.enumerateDevices()
            .then(gotDevices)
            .catch(errorCallback);
        var videoSelect = document.getElementsByName("videoSelect")[0];
        function gotDevices(deviceInfos) {
            for (var i = 0; i !== deviceInfos.length; ++i) {
                var deviceInfo = deviceInfos[i];
                //var option = <HTMLOptionElement>document.createElement('md-option');
                //var option = {value : deviceInfo.deviceId };
                //option.value = deviceInfo.deviceId;
                if (deviceInfo.kind === 'videoinput') {
                    var newvalue = deviceInfo.deviceId;
                    var newviewValue = deviceInfo.label || 'Camera ' + (component.cams.length + 1);
                    var option = { value: newvalue, viewValue: newviewValue };
                    component.cams.push(option);
                }
            }
        }
        function errorCallback(error) {
            console.log(error);
        }
    };
    VideoComponent.prototype.ngOnInit = function () {
        this.enumerate();
    };
    return VideoComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], VideoComponent.prototype, "stop", void 0);
__decorate([
    core_1.ViewChild('video'),
    __metadata("design:type", Object)
], VideoComponent.prototype, "video", void 0);
VideoComponent = __decorate([
    core_1.Component({
        selector: 'app-video',
        templateUrl: './video.component.html',
        styleUrls: ['./video.component.css']
    }),
    __metadata("design:paramtypes", [])
], VideoComponent);
exports.VideoComponent = VideoComponent;
//# sourceMappingURL=video.component.js.map