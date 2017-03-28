import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {
  age = "Clicca sull'immagine per cominciare";
  description = "no description";
  enableCapture = false;
  log = "";
  faces = {};
  faceToPerson = {};

  constructor() { }

  evaluateAge() {
    const SIRE = "Michele Bersini";
    //const SIRE = "Tommaso Tosi";
    const component = this;
    this.age = this.enableCapture ? "Cercando...(clicca sull'immagine per mettere in pausa)" : "In pausa(clicca sull'immagine per ricominciare)";
    if (this.enableCapture) {
      var faceIds : String[] = [];
      const video = <any>document.getElementsByTagName('video')[0];
      this.log = "video";
      const canvas = <any>document.getElementsByName('canvas')[0];
      this.log += "->canvas";
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      this.log += "->sizes";
      var context = canvas.getContext('2d');
      //canvas.getContext('2d').drawImage(video, 0, 0);
      if (this.detectmob()) {
        //var deg = Number(window.orientation);
        context.save();
        context.scale(1, -1);
        context.drawImage(video, 0, 0, canvas.width, -1 * canvas.height);
        context.restore();

      } else {
        context.drawImage(video, 0, 0);
      }
      this.log += "->context";
      const size = this.dataURItoBlob(canvas.toDataURL('image/jpeg', 1)).size;
      this.log += "->size";
      const rapp = 153600 / size;
      this.log += "->rapp";
      this.log += size + " " + rapp;
      //console.log(size*rapp);
      var image = canvas.toDataURL('image/jpeg', rapp);
      const testCanvas = <any>document.getElementById('testCanvas');
      var img = new Image;
      img.src = image;
      img.onload = function () {
        testCanvas.getContext('2d').drawImage(img, 0, 0);
        //component.log= ""+window.orientation;
      }

      component.log += "->draw";

      if (size > 0) {
        this.analyzeImage(image).then(imageAge => {
          component.log += "->ANALYZED";
          this.clearCanvas();
          const vCanvas = <any>document.getElementsByName('videoCanvas')[0];
          if (Object.keys(imageAge[0]).length > 0) {
            this.log = video.height + "x" + video.width + " c:" + vCanvas.height + "x" + vCanvas.width + " " +
              imageAge[0].faceRectangle.width;
          } else {
            this.log = "no rectangles.....";
          }

          const ctx = vCanvas.getContext('2d');
          //ctx
          ctx.strokeStyle = "#FF0000";
          const fs = video.width / 20;
          ctx.font = fs + "px Georgia";
          ctx.fillStyle = "#FF0000";
          var resize = Math.min(video.videoWidth / video.width, video.videoHeight / video.height);
          var arr = Object.keys(imageAge).map(function (key) { return imageAge[key]; });
          arr.forEach(function (element) {
            var faceId = element.faceId;
            console.log(faceId);
            faceIds[faceIds.length] = faceId;
          });

          //console.log(faceIds);
          component.identifyPersonId(faceIds).then(() => {
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
              const emotionMapping = {
                "anger": "arrabbiato",
                "contempt": "contento",
                "disgust": "disgustato",
                "fear": "spaventato",
                "happiness": "felice",
                "neutral": "neutro",
                "sadness": "triste",
                "surprise": "sorpreso",
                "libero": "libero professionista"
              }
              if (name === SIRE) {
                age = "Senza Età";
                scores.libero = 1000;
                name = "Mio Sire"
              }

              const rect = element.faceRectangle;
              const left = (rect.left + rect.width) / resize;
              var top = (rect.top /*+ rect.height*/) / resize;
              ctx.strokeRect(rect.left / resize, rect.top / resize, rect.width / resize, rect.height / resize);

              var text;
              if (isNaN(age)) {
                text = age;
              } else {
                text = age + " anni, "
              }
              //var text = age + " anni, ";// +

              ctx.fillText(text, left, top);
              top += 1.3 * fs;


              var max = Math.max.apply(null, Object.keys(scores).map(function (x) { return scores[x] }));
              text = (Object.keys(scores).filter(function (x) { return scores[x] == max; })[0]);
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

          setTimeout(() => this.evaluateAge(), 3000);
        }, (error) => {
          setTimeout(() => this.evaluateAge(), 3000);

        });

      } else {
        this.log = "SIZE ZERO";
        setTimeout(() => this.evaluateAge(), 1000);
      }

    }
  }

  onClick() {
    this.enableCapture = !(this.enableCapture);
    this.evaluateAge();
  }

  onResize() {
    const video = <any>document.getElementsByTagName('video')[0];
    const canvas = <any>document.getElementsByName('videoCanvas')[0];
    video.width = parent.innerWidth / 2;
    var ratio = video.videoHeight / video.videoWidth;
    video.height = video.width * ratio;
    canvas.height = video.height;
    canvas.width = video.width * 2;


    const tCanvas = <any>document.getElementById('testCanvas');
    tCanvas.width = video.videoWidth;
    tCanvas.height = video.videoHeight;

    //this.log = video.height + "x" + video.width + " c:" + canvas.height + "x" + canvas.width;
  }

  analyzeImage(stream: any) {
    var delay = 1000;
    const blob = this.dataURItoBlob(stream);
    //var finalresponse = {};
    //var comp = this;
    this.computerVision(blob).then(captions => {
      this.description = captions[0].text;
    });
    //this.identifyPerson(blob);
    return new Promise(
      (resolve, reject) => {
        this.getAgeFromImage(blob).then(faces => {
          this.faces = faces;
          delay = 0;
          //resolve(faces);
        }, (error) => {
          console.log(error);
        });

        setTimeout(() => {
          this.getEmotionFromImage(blob).then(emotions => {

            if (Object.keys(this.faces).length === 0) {
              //this.faces = emotions;
              reject(new Error('fail'));
            } else {
              this.faces = this.addEmotionToFace(this.faces, emotions);
              resolve(this.faces);
            }
            this.log += "" + delay + " " + Object.keys(this.faces).length + " ";
            console.log(this.log);

          }, (error) => {
            console.log(error);
          });
        }, delay);


      });
  }

  getAgeFromImage(blob: any) {
    return new Promise(
      (resolve, reject) => {
        const faceApiUrl = [
          'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?',
          'returnFaceId=true',
          'returnFaceLandmarks=false',
          'returnFaceAttributes=age,smile,facialHair,glasses'
        ].join('&');

        const emotionApiUrl = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?';

        var xhrface = new XMLHttpRequest();
        xhrface.open('POST', faceApiUrl, true);
        xhrface.setRequestHeader('content-type', 'application/octet-stream');
        xhrface.setRequestHeader('Ocp-Apim-Subscription-Key', "6e2715cbea564f4f95f9a097e935e8c7");

        xhrface.onreadystatechange = function () {
          if (xhrface.readyState == 4) {
            if (xhrface.status == 200) {
              //var resp = JSON.parse(xhrface.response);
              //console.log(this);
              var resp = JSON.parse(xhrface.response);
              resolve(resp);
            } else {
              reject(new Error('fail'));
            }
          }
        }
        xhrface.send(blob);
      });
  }

  getEmotionFromImage(blob: any) {
    return new Promise((resolve, reject) => {
      const emotionApiUrl = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?';

      var xhremotion = new XMLHttpRequest();
      xhremotion.open('POST', emotionApiUrl, true);
      xhremotion.setRequestHeader('content-type', 'application/octet-stream');
      xhremotion.setRequestHeader('Ocp-Apim-Subscription-Key', "81f079954302459e904d8c98d06263b1");
      xhremotion.onreadystatechange = function () {
        if (xhremotion.readyState == 4) {
          if (xhremotion.status == 200) {
            //console.log(this);
            var resp = JSON.parse(xhremotion.response);
            resolve(resp);
          } else {
            reject(new Error('fail'));
          }
        }
      }
      xhremotion.send(blob);
    })
  }


  computerVision(blob: any) {

    return new Promise((resolve, reject) => {
      const visionApiUrl = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description';

      var xhrvision = new XMLHttpRequest();
      xhrvision.open('POST', visionApiUrl, true);
      xhrvision.setRequestHeader('content-type', 'application/octet-stream');
      xhrvision.setRequestHeader('Ocp-Apim-Subscription-Key', "b10fb5b057fe4f9cbeac59dcf0f5727f");

      xhrvision.onreadystatechange = function () {
        if (xhrvision.readyState == 4) {
          if (xhrvision.status == 200) {
            //console.log(this);
            var resp = JSON.parse(xhrvision.response);
            //console.log(resp.description.captions[0].text);
            resolve(resp.description.captions);
          } else {
            console.log(xhrvision.status);
          }
        }
      }
      xhrvision.send(blob);
    })
  }
  dataURItoBlob(dataURI: String) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  ngOnInit() { }

  ngAfterViewInit() {
    var interval = setInterval(() => {
      this.onResize()
      const video = <any>document.getElementsByTagName('video')[0];
      console.log("gira");
      if (video.height > 0) {
        clearInterval(interval);
        console.log("stop");
      }
    }, 100);
  }

  addEmotionToFace(faces: any, emotions: any) {
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
  }

  addFaceToEmotion(emotions: any, faces: any) {
    var final = this.addEmotionToFace(faces, emotions);
    return final;
  }

  videoButtonClick(event: any) {
    this.clearCanvas();
    console.log(event);
    if (event == "stop") {
      this.enableCapture = false;
    }/*else{
      this.enableCapture=true;
      this.evaluateAge();
    }*/
  }

  clearCanvas() {
    const vCanvas = <any>document.getElementsByName('videoCanvas')[0];
    const ctx = vCanvas.getContext('2d');
    ctx.clearRect(0, 0, vCanvas.width, vCanvas.height);
  }

  identifyPersonId(faceIds: any) {
    const component = this;

    return new Promise((resolve, reject) => {
      const faceApiUrl = [
        'https://westus.api.cognitive.microsoft.com/face/v1.0/identify?'
      ].join('&');
      var groupId = 'zerouno';

      const postData = {
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
        if (xhrface.readyState == 4) {
          if (xhrface.status == 200) {
            var resp = JSON.parse(xhrface.response);
            var count = 0;
            //console.log(resp);
            resp.forEach(function (element: any) {
              count++;
              component.getPersonByPersonId(element.candidates[0].personId).then((r) => {
                //console.log(r['userData']);
                component.faceToPerson[element.faceId] = r['name'];
                var arr = Object.keys(component.faces).map(function (key) { return component.faces[key]; });
                arr.forEach(function (face) {
                  if (face.faceId === element.faceId) {
                    face.name = r['name'];
                  }
                  if (count == resp.length) {
                    resolve(resp);
                  }
                });
                //console.log(component.faces);
              });

            });
            //console.log(component.faceToPerson);
            //resolve(resp);
          } else {
            resolve(xhrface.status);
          }
        }

        if (xhrface.status == 400) {
          resolve({});
        }
      }
      xhrface.send(JSON.stringify(postData));
    });
  }

  getPersonByPersonId(personId: any) {
    const component = this;
    return new Promise((resolve, reject) => {
      const faceApiUrl = [
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
        if (xhrface.readyState == 4) {
          if (xhrface.status == 200) {
            var resp = JSON.parse(xhrface.response);
            //console.log(resp);
            resolve(resp);
          } else {
            resolve(xhrface.status);
          }
        }
      }
      xhrface.send();
    });

  }

  detectmob() {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    }
    else {
      return false;
    }
  }

}