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
var PhotoComponent = (function () {
    function PhotoComponent() {
        this.age = "Clicca sull'immagine per cominciare";
        this.description = "no description";
        this.enableCapture = false;
        this.log = "";
        this.faces = {};
        this.faceToPerson = {};
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
            var rapp = 153600 / size;
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
        var _this = this;
        var interval = setInterval(function () {
            _this.onResize();
            var video = document.getElementsByTagName('video')[0];
            console.log("gira");
            if (video.height > 0) {
                clearInterval(interval);
                console.log("stop");
            }
        }, 100);
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
        console.log(event);
        if (event === "stop") {
            this.enableCapture = false;
        } /*else{
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
    return PhotoComponent;
}());
PhotoComponent = __decorate([
    core_1.Component({
        selector: 'app-photo',
        templateUrl: './photo.component.html',
        styleUrls: ['./photo.component.css']
    }),
    __metadata("design:paramtypes", [])
], PhotoComponent);
exports.PhotoComponent = PhotoComponent;
//# sourceMappingURL=photo.component.js.map