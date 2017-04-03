webpackJsonp([1,4],{

/***/ 412:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__video_video_component__ = __webpack_require__(413);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PhotoComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PhotoComponent = (function () {
    function PhotoComponent() {
        this.age = "Clicca sull'immagine per cominciare";
        this.description = "no description";
        this.enableCapture = false;
        this.log = "";
        this.faces = {};
        this.faceToPerson = {};
        this.cams = [];
    }
    PhotoComponent.prototype.evaluateAge = function () {
        var _this = this;
        var SIRE = "Michele Bersini";
        //const SIRE = "Tommaso Tosi";
        var component = this;
        var c1 = "Cercando...(clicca sull'immagine per mettere in pausa)";
        var c2 = "In pausa(clicca sull'immagine per ricominciare)";
        this.age = this.enableCapture ? c1 : c2;
        if (this.enableCapture) {
            var faceIds = [];
            var video_1 = document.getElementsByTagName('video')[0];
            this.log = "video";
            var canvas = document.getElementsByName('canvas')[0];
            this.log += "->canvas";
            canvas.width = video_1.videoWidth;
            canvas.height = video_1.videoHeight;
            this.log += "->sizes";
            var context = canvas.getContext('2d');
            //canvas.getContext('2d').drawImage(video, 0, 0);
            if (this.detectmob()) {
                //var deg = Number(window.orientation);
                context.save();
                context.scale(1, -1);
                context.drawImage(video_1, 0, 0, canvas.width, -1 * canvas.height);
                context.restore();
            }
            else {
                context.drawImage(video_1, 0, 0);
            }
            this.log += "->context";
            var size = this.dataURItoBlob(canvas.toDataURL('image/jpeg', 1)).size;
            this.log += "->size";
            var rapp = Math.min(153600 / size, 1);
            //const rapp=1;
            this.log += "->rapp";
            this.log += size + " " + rapp;
            //console.log(size*rapp);
            var image = canvas.toDataURL('image/jpeg', rapp);
            var testCanvas_1 = document.getElementById('testCanvas');
            var img = new Image;
            img.src = image;
            img.onload = function () {
                testCanvas_1.getContext('2d').drawImage(img, 0, 0);
                //component.log= ""+window.orientation;
            };
            component.log += "->draw";
            if (size > 0) {
                this.analyzeImage(image).then(function (imageAge) {
                    component.log += "->ANALYZED";
                    _this.clearCanvas();
                    var vCanvas = document.getElementsByName('videoCanvas')[0];
                    if (Object.keys(imageAge[0]).length > 0) {
                        _this.log = video_1.height + "x" + video_1.width + " c:" + vCanvas.height + "x" + vCanvas.width + " " +
                            imageAge[0].faceRectangle.width;
                    }
                    else {
                        _this.log = "no rectangles.....";
                    }
                    var ctx = vCanvas.getContext('2d');
                    //ctx
                    ctx.strokeStyle = "#FF0000";
                    var fs = video_1.width / 20;
                    ctx.font = fs + "px Georgia";
                    ctx.fillStyle = "#FF0000";
                    var resize = Math.min(video_1.videoWidth / video_1.width, video_1.videoHeight / video_1.height);
                    var arr = Object.keys(imageAge).map(function (key) { return imageAge[key]; });
                    arr.forEach(function (element) {
                        var faceId = element.faceId;
                        console.log(faceId);
                        faceIds[faceIds.length] = faceId;
                    });
                    //console.log(faceIds);
                    component.identifyPersonId(faceIds).then(function () {
                        arr.forEach(function (element) {
                            console.log(element);
                            //faceIds.concat(faceId);
                            var faceId = element.faceId;
                            var name = element.name;
                            var age = element.faceAttributes.age;
                            var smile = element.faceAttributes.smile;
                            var facialHair = element.faceAttributes.facialHair;
                            var glasses = element.faceAttributes.glasses.toLowerCase();
                            var scores = element.scores;
                            var emotionMapping = {
                                "anger": "arrabbiato",
                                "contempt": "contento",
                                "disgust": "disgustato",
                                "fear": "spaventato",
                                "happiness": "felice",
                                "neutral": "neutro",
                                "sadness": "triste",
                                "surprise": "sorpreso",
                                "libero": "libero professionista"
                            };
                            if (name === SIRE) {
                                age = "Senza Età";
                                scores.libero = 1000;
                                name = "Mio Sire";
                            }
                            var rect = element.faceRectangle;
                            var left = (rect.left + rect.width) / resize;
                            var top = (rect.top /*+ rect.height*/) / resize;
                            ctx.strokeRect(rect.left / resize, rect.top / resize, rect.width / resize, rect.height / resize);
                            var text;
                            if (isNaN(age)) {
                                text = age;
                            }
                            else {
                                text = age + " anni, ";
                            }
                            //var text = age + " anni, ";// +
                            ctx.fillText(text, left, top);
                            top += 1.3 * fs;
                            var max = Math.max.apply(null, Object.keys(scores).map(function (x) { return scores[x]; }));
                            text = (Object.keys(scores).filter(function (x) { return scores[x] === max; })[0]);
                            ctx.fillText(emotionMapping[text], left, top);
                            top += 1.3 * fs;
                            text = (facialHair.beard >= 0.2 ? "barba " : "") +
                                (facialHair.moustache >= 0.2 ? "baffi " : "");
                            ctx.fillText(text, left, top);
                            top += 1.3 * fs;
                            switch (glasses) {
                                case "noglasses":
                                    text = "Non porti gli occhiali";
                                    break;
                                case "readingglasses":
                                    text = "Occhiali da lettura";
                                    break;
                                case "sunglasses":
                                    text = "Occhiali da sole";
                                    //text="Spacciatore";
                                    break;
                                default:
                                    text = "";
                            }
                            ctx.fillText(text, left, top);
                            console.log(name);
                            if (element.name) {
                                console.log("name");
                                top += 1.3 * fs;
                                text = name;
                                ctx.fillText(text, left, top);
                            }
                        });
                    });
                    setTimeout(function () { return _this.evaluateAge(); }, 3000);
                }, function (error) {
                    setTimeout(function () { return _this.evaluateAge(); }, 3000);
                });
            }
            else {
                this.log = "SIZE ZERO";
                setTimeout(function () { return _this.evaluateAge(); }, 1000);
            }
        }
    };
    PhotoComponent.prototype.onClick = function () {
        this.enableCapture = !(this.enableCapture);
        this.evaluateAge();
    };
    PhotoComponent.prototype.onResize = function () {
        console.log("resize");
        var video = document.getElementsByTagName('video')[0];
        var canvas = document.getElementsByName('videoCanvas')[0];
        video.width = parent.innerWidth / 2;
        var ratio = video.videoHeight / video.videoWidth;
        video.height = video.width * ratio;
        canvas.height = video.height;
        canvas.width = video.width * 2;
        var tCanvas = document.getElementById('testCanvas');
        tCanvas.width = video.videoWidth;
        tCanvas.height = video.videoHeight;
        this.cams = this.videoComponent.cams;
        //this.log = video.height + "x" + video.width + " c:" + canvas.height + "x" + canvas.width;
    };
    PhotoComponent.prototype.analyzeImage = function (stream) {
        var _this = this;
        var delay = 1000;
        var blob = this.dataURItoBlob(stream);
        //var finalresponse = {};
        //var comp = this;
        this.computerVision(blob).then(function (captions) {
            _this.description = captions[0].text;
        });
        //this.identifyPerson(blob);
        return new Promise(function (resolve, reject) {
            _this.getAgeFromImage(blob).then(function (faces) {
                _this.faces = faces;
                delay = 0;
                //resolve(faces);
            }, function (error) {
                console.log(error);
            });
            setTimeout(function () {
                _this.getEmotionFromImage(blob).then(function (emotions) {
                    if (Object.keys(_this.faces).length === 0) {
                        //this.faces = emotions;
                        reject(new Error('fail'));
                    }
                    else {
                        _this.faces = _this.addEmotionToFace(_this.faces, emotions);
                        resolve(_this.faces);
                    }
                    _this.log += "" + delay + " " + Object.keys(_this.faces).length + " ";
                    console.log(_this.log);
                }, function (error) {
                    console.log(error);
                });
            }, delay);
        });
    };
    PhotoComponent.prototype.getAgeFromImage = function (blob) {
        return new Promise(function (resolve, reject) {
            var faceApiUrl = [
                'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?',
                'returnFaceId=true',
                'returnFaceLandmarks=false',
                'returnFaceAttributes=age,smile,facialHair,glasses'
            ].join('&');
            var emotionApiUrl = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?';
            var xhrface = new XMLHttpRequest();
            xhrface.open('POST', faceApiUrl, true);
            xhrface.setRequestHeader('content-type', 'application/octet-stream');
            xhrface.setRequestHeader('Ocp-Apim-Subscription-Key', "6e2715cbea564f4f95f9a097e935e8c7");
            xhrface.onreadystatechange = function () {
                if (xhrface.readyState === 4) {
                    if (xhrface.status === 200) {
                        //var resp = JSON.parse(xhrface.response);
                        //console.log(this);
                        var resp = JSON.parse(xhrface.response);
                        resolve(resp);
                    }
                    else {
                        reject(new Error('fail'));
                    }
                }
            };
            xhrface.send(blob);
        });
    };
    PhotoComponent.prototype.getEmotionFromImage = function (blob) {
        return new Promise(function (resolve, reject) {
            var emotionApiUrl = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?';
            var xhremotion = new XMLHttpRequest();
            xhremotion.open('POST', emotionApiUrl, true);
            xhremotion.setRequestHeader('content-type', 'application/octet-stream');
            xhremotion.setRequestHeader('Ocp-Apim-Subscription-Key', "81f079954302459e904d8c98d06263b1");
            xhremotion.onreadystatechange = function () {
                if (xhremotion.readyState === 4) {
                    if (xhremotion.status === 200) {
                        //console.log(this);
                        var resp = JSON.parse(xhremotion.response);
                        resolve(resp);
                    }
                    else {
                        reject(new Error('fail'));
                    }
                }
            };
            xhremotion.send(blob);
        });
    };
    PhotoComponent.prototype.computerVision = function (blob) {
        return new Promise(function (resolve, reject) {
            var visionApiUrl = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description';
            var xhrvision = new XMLHttpRequest();
            xhrvision.open('POST', visionApiUrl, true);
            xhrvision.setRequestHeader('content-type', 'application/octet-stream');
            xhrvision.setRequestHeader('Ocp-Apim-Subscription-Key', "b10fb5b057fe4f9cbeac59dcf0f5727f");
            xhrvision.onreadystatechange = function () {
                if (xhrvision.readyState === 4) {
                    if (xhrvision.status === 200) {
                        //console.log(this);
                        var resp = JSON.parse(xhrvision.response);
                        //console.log(resp.description.captions[0].text);
                        resolve(resp.description.captions);
                    }
                    else {
                        console.log(xhrvision.status);
                    }
                }
            };
            xhrvision.send(blob);
        });
    };
    PhotoComponent.prototype.dataURItoBlob = function (dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    };
    PhotoComponent.prototype.ngOnInit = function () { };
    PhotoComponent.prototype.ngAfterViewInit = function () {
        /* var interval = setInterval(() => {
           this.onResize();
           const video = <any>document.getElementsByTagName('video')[0];
           console.log("gira");
           if (video.height > 0) {
             clearInterval(interval);
             console.log("stop");
           }
         }, 100);*/
    };
    PhotoComponent.prototype.addEmotionToFace = function (faces, emotions) {
        /*console.log(faces);
        console.log(emotions);*/
        var final = faces;
        var arrF = Object.keys(faces).map(function (key) { return faces[key]; });
        arrF.forEach(function (face) {
            var top = face.faceRectangle.top;
            var left = face.faceRectangle.left;
            var min = 10000;
            var arrE = Object.keys(emotions).map(function (key) { return emotions[key]; });
            arrE.forEach(function (emotion) {
                var topE = emotion.faceRectangle.top;
                var leftE = emotion.faceRectangle.left;
                var dist = Math.sqrt(Math.pow(top - topE, 2) + Math.pow(left - leftE, 2));
                if (dist < min) {
                    face.scores = emotion.scores;
                }
            });
        });
        return final;
    };
    PhotoComponent.prototype.addFaceToEmotion = function (emotions, faces) {
        var final = this.addEmotionToFace(faces, emotions);
        return final;
    };
    PhotoComponent.prototype.videoButtonClick = function (event) {
        this.clearCanvas();
        this.onResize();
        // console.log("EVENT "+event);
        if (event === "stop") {
            this.enableCapture = false;
        }
        /*else{
          this.enableCapture=true;
          this.evaluateAge();
        }*/
    };
    PhotoComponent.prototype.clearCanvas = function () {
        var vCanvas = document.getElementsByName('videoCanvas')[0];
        var ctx = vCanvas.getContext('2d');
        ctx.clearRect(0, 0, vCanvas.width, vCanvas.height);
    };
    PhotoComponent.prototype.identifyPersonId = function (faceIds) {
        var component = this;
        return new Promise(function (resolve, reject) {
            var faceApiUrl = [
                'https://westus.api.cognitive.microsoft.com/face/v1.0/identify?'
            ].join('&');
            var groupId = 'zerouno';
            var postData = {
                "personGroupId": groupId,
                "faceIds": faceIds,
                "maxNumOfCandidatesReturned": 1,
                "confidenceThreshold": 0.1
            };
            var xhrface = new XMLHttpRequest();
            xhrface.open('POST', faceApiUrl, true);
            xhrface.setRequestHeader('content-type', 'application/json');
            xhrface.setRequestHeader('Ocp-Apim-Subscription-Key', "6e2715cbea564f4f95f9a097e935e8c7");
            xhrface.onreadystatechange = function () {
                if (xhrface.readyState === 4) {
                    if (xhrface.status === 200) {
                        var resp = JSON.parse(xhrface.response);
                        var count = 0;
                        //console.log(resp);
                        resp.forEach(function (element) {
                            count++;
                            component.getPersonByPersonId(element.candidates[0].personId).then(function (r) {
                                //console.log(r['userData']);
                                component.faceToPerson[element.faceId] = r['name'];
                                var arr = Object.keys(component.faces).map(function (key) { return component.faces[key]; });
                                arr.forEach(function (face) {
                                    if (face.faceId === element.faceId) {
                                        face.name = r['name'];
                                    }
                                    if (count === resp.length) {
                                        resolve(resp);
                                    }
                                });
                                //console.log(component.faces);
                            });
                        });
                    }
                    else {
                        resolve(xhrface.status);
                    }
                }
                if (xhrface.status === 400) {
                    resolve({});
                }
            };
            xhrface.send(JSON.stringify(postData));
        });
    };
    PhotoComponent.prototype.getPersonByPersonId = function (personId) {
        var component = this;
        return new Promise(function (resolve, reject) {
            var faceApiUrl = [
                'https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups',
                'zerouno',
                'persons',
                personId
            ].join('/');
            var groupId = 'zerouno';
            var xhrface = new XMLHttpRequest();
            xhrface.open('GET', faceApiUrl, true);
            //xhrface.setRequestHeader('content-type', 'application/json');
            xhrface.setRequestHeader('Ocp-Apim-Subscription-Key', "6e2715cbea564f4f95f9a097e935e8c7");
            xhrface.onreadystatechange = function () {
                if (xhrface.readyState === 4) {
                    if (xhrface.status === 200) {
                        var resp = JSON.parse(xhrface.response);
                        //console.log(resp);
                        resolve(resp);
                    }
                    else {
                        resolve(xhrface.status);
                    }
                }
            };
            xhrface.send();
        });
    };
    PhotoComponent.prototype.detectmob = function () {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }
        else {
            return false;
        }
    };
    PhotoComponent.prototype.selectSource = function (source) {
        this.log = source;
        console.log("AAAAAAAAA" + source);
        this.videoComponent.selectSource(source);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1__video_video_component__["a" /* VideoComponent */]), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__video_video_component__["a" /* VideoComponent */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__video_video_component__["a" /* VideoComponent */]) === 'function' && _a) || Object)
    ], PhotoComponent.prototype, "videoComponent", void 0);
    PhotoComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Component */])({
            selector: 'app-photo',
            template: __webpack_require__(765),
            styles: [__webpack_require__(762)]
        }), 
        __metadata('design:paramtypes', [])
    ], PhotoComponent);
    return PhotoComponent;
    var _a;
}());
//# sourceMappingURL=C:/Users/stage/github/materialFace/src/photo.component.js.map

/***/ }),

/***/ 413:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VideoComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var VideoComponent = (function () {
    function VideoComponent() {
        this.stop = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* EventEmitter */]();
        this.ready = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* EventEmitter */]();
        this.cams = [];
        this.vid = {};
        this.bottone = "Ferma il Video";
        this.icona = "pause";
        this.selectValue = "";
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
        var component = this;
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
                _video.onplaying = function () {
                    component.ready.emit("ready");
                };
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
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* EventEmitter */]) === 'function' && _a) || Object)
    ], VideoComponent.prototype, "stop", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Output */])(), 
        __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* EventEmitter */]) === 'function' && _b) || Object)
    ], VideoComponent.prototype, "ready", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* ViewChild */])('video'), 
        __metadata('design:type', Object)
    ], VideoComponent.prototype, "video", void 0);
    VideoComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Component */])({
            selector: 'app-video',
            template: __webpack_require__(766),
            styles: [__webpack_require__(763)]
        }), 
        __metadata('design:paramtypes', [])
    ], VideoComponent);
    return VideoComponent;
    var _a, _b;
}());
//# sourceMappingURL=C:/Users/stage/github/materialFace/src/video.component.js.map

/***/ }),

/***/ 459:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 459;


/***/ }),

/***/ 460:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(586);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_app_module__ = __webpack_require__(607);


__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=C:/Users/stage/github/materialFace/src/main.js.map

/***/ }),

/***/ 606:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__photo_photo_component__ = __webpack_require__(412);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


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
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1__photo_photo_component__["a" /* PhotoComponent */]), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__photo_photo_component__["a" /* PhotoComponent */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__photo_photo_component__["a" /* PhotoComponent */]) === 'function' && _a) || Object)
    ], AppComponent.prototype, "photoComponent", void 0);
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(764),
            styles: [__webpack_require__(761)]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
//# sourceMappingURL=C:/Users/stage/github/materialFace/src/app.component.js.map

/***/ }),

/***/ 607:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_material__ = __webpack_require__(570);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(606);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__photo_photo_component__ = __webpack_require__(412);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__video_video_component__ = __webpack_require__(413);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */], __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormsModule */], __WEBPACK_IMPORTED_MODULE_2__angular_material__["a" /* MaterialModule */]],
            declarations: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */], __WEBPACK_IMPORTED_MODULE_5__photo_photo_component__["a" /* PhotoComponent */], __WEBPACK_IMPORTED_MODULE_6__video_video_component__["a" /* VideoComponent */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=C:/Users/stage/github/materialFace/src/app.module.js.map

/***/ }),

/***/ 761:
/***/ (function(module, exports) {

module.exports = ".toolbar-button{\r\n   position: absolute; \r\n   right: 5%;\r\n}"

/***/ }),

/***/ 762:
/***/ (function(module, exports) {

module.exports = ".videoCanvas {\r\n  position: absolute;\r\n  z-index: 10;\r\n}\r\n"

/***/ }),

/***/ 763:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 764:
/***/ (function(module, exports) {

module.exports = "<md-toolbar>\r\n    <md-menu #appMenu=\"mdMenu\" >\r\n       <!-- <button md-menu-item> Cose1 </button>\r\n        <button md-menu-item> Cose2 </button>-->\r\n        <button md-menu-item *ngFor=\"let btn of menubtns\" [value]=\"btn.value\" (click)=selectSource(btn.value)> {{btn.viewValue}} </button>\r\n    </md-menu>\r\n\r\n    <button md-icon-button [mdMenuTriggerFor]=\"appMenu\" (click)=\"updateMenu()\">\r\n        <md-icon>menu</md-icon>\r\n    </button>\r\n    <span> Hello {{name}}</span>\r\n\r\n    <span class=\"demo-fill-remaining\">   </span>\r\n\r\n    <button md-raised-button class='toolbar-button'>\r\n        Home\r\n        <md-icon>home</md-icon>\r\n    </button>\r\n</md-toolbar>\r\n<app-photo></app-photo>\r\n<button md-raised-button (click)=\"onClick()\">\r\n  {{text}}\r\n  <md-icon>{{icona}}</md-icon>\r\n</button>"

/***/ }),

/***/ 765:
/***/ (function(module, exports) {

module.exports = "<h1 id=\"age\">{{age}}</h1>\n<md-card>\n<div (window:resize)=\"onResize()\"  (document:load)=\"onResize()\">\n    <canvas id=\"videoCanvas\" name=\"videoCanvas\" class=\"videoCanvas\" (click)=\"onClick()\"></canvas>\n    <app-video id=\"appVideo\" (stop)=\"videoButtonClick($event)\" (ready)=\"onResize()\"></app-video>\n</div>\n<canvas name=\"canvas\" id=\"canvas\" style=\"display:none;\"></canvas>\n<!--<button id=\"take\" (click)=\"onClick()\">Take a photo</button><br />-->\n<md-card-content>\n<p name=\"description\">{{description}}</p>\n</md-card-content>\n</md-card>\n<p>{{log}}</p>\n<canvas id=\"testCanvas\"></canvas>"

/***/ }),

/***/ 766:
/***/ (function(module, exports) {

module.exports = "<video #video width=\"640\" height=\"480\" autoplay></video>\r\n<br>\r\n<md-select name=\"videoSelect\" placeholder=\"webCam\" [(ngModel)]=\"selectValue\" (ngModelChange)=\"selectSource($event)\" class=\"input-form\">\r\n     <md-option *ngFor=\"let cam of cams\" [value]=\"cam.value\" [disabled]=\"cam.disabled\">\r\n        {{ cam.viewValue }}\r\n      </md-option>\r\n</md-select>\r\n<!--<button name=\"bottone\" (click) = \"onClick()\">{{bottone}}</button>-->\r\n<button md-raised-button (click)=\"onClick()\">\r\n  {{bottone}}\r\n  <md-icon>{{icona}}</md-icon>\r\n</button>\r\n<!--<p>{{vid}}</p>-->"

/***/ }),

/***/ 815:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(460);


/***/ })

},[815]);
//# sourceMappingURL=main.bundle.map