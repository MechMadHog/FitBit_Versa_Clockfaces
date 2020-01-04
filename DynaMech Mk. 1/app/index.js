import clock from "clock";
import document from "document";
import {preferences} from "user-settings";
import {today} from "user-activity";
import {battery} from "power";
import {HeartRateSensor} from "heart-rate";
import * as util from "../functions/utils"


// Clock Interface

      // The Clock Will Update Every Second.
      clock.granularity = "seconds";
      // Declaring the Stat Values for the 2nd Screen.
      const stpValue = document.getElementById("stpValue");
      const calValue = document.getElementById("calValue");
      const flValue = document.getElementById("flValue");
      const btValue = document.getElementById("btValue");
            function updateStatistics(){
            stpValue.text = today.adjusted.steps || 0;
            calValue.text = today.adjusted.calories || 0;
            flValue.text = today.adjusted.elevationGain || 0;
            btValue.text = Math.floor(battery.chargeLevel) + "%";
            }
      // Date
      const dayname = document.getElementById("dayname");
      const date = document.getElementById("date");
            function setDay(val){
                  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
                  dayname.text = ""+days[val];
            }
      // Declaring the Stat Value for Heart Rate on the 2nd Screen.
      let lastValueTimestamp = Date.now();
      const bpmValue = document.getElementById("bpmValue");
      bpmValue.text="---";
            let hrm = new HeartRateSensor();
            hrm.onreading = function(){
                  // Peak the current sensor values.
                  bpmValue.text = hrm.heartRate;
                  lastValueTimestamp = Date.now();
            }
                  hrm.start();
      // Declaring the Hands for the Analog Clockface.
      const hourHand = document.getElementById("hours");
      const minHand = document.getElementById("minutes");
      const secHand = document.getElementById("seconds");
      // Declaring the Characters for the Digital Clockface.
      const hours1 = document.getElementById("hours1");
      const hours2 = document.getElementById("hours2");
      const separator = document.getElementById("separator");
      const minutes1 = document.getElementById("minutes1");
      const minutes2 = document.getElementById("minutes2");
      // Declaring Statistic Features for the 2nd Screen.
      const btn = document.getElementById("btn");
      const screen2 = document.getElementById("screen2");
            btn.onclick = function(){
                  // console.log("clicked");
                  toggle(screen2);
            }
      function toggle(element){
            element.animate("enable");
      }


// The Analog Functions:

      function hoursToAngle(hours){
      /* The Area of The Clock that is Visible for the Hours is ONLY dislayed within
      the upper 120° of the total circumference of the Clock's face. The Hours are
      divided up into "12" sections beginning at 308° and ending at 60° when the hours
      reach "12" it resets back to "1" at the starting point of 308°. */  
            switch(hours){
                  case 1:
                        return 308;
                        break;
                  case 2:
                        return 318;
                        break;
                  case 3:
                        /* The Hour Hand wasn't exactly pointing at "3" so the
                        angle was changed by 11° rather than 10° like the rest.*/  
                        return 329;
                        break;
                  case 4:
                        return 340;
                        break;
                  case 5:
                        return 350;
                        break;
                  case 6:
                        /* The Hour Hand is displayed at 360° which
                        is at the exact center of the clockface.*/ 
                        return 360;
                        break;
                  case 7:
                        return 10;
                        break;
                  case 8:
                        return 20;
                        break;
                  case 9:
                        return 30;
                        break;
                  case 10:
                        return 40;
                        break;
                  case 11:
                        return 50;
                        break;
                  case 12:
                        return 60;
                        break;
                  default:
                        return 60;
            }
      }


      function timeToAngle(time){
            /* The Area of The Clock that is Visible for the Minutes
            & Seconds is ONLY dislayed within the lower 120° of the
            total circumference of the Clock's face. */
            const angle = 120;
            /* This section of the Clock's face; is then divided up
            into 60 Minutes || Seconds, since there are both 60
            seconds in a minute and 60 minutes in an hour.*/
            const fraction = 120/60;
            /* This is a short-hand if statement that sets the starting
            point / "00" for both Minutes and Seconds to an angle of 239°.
            This way once either hand reaches "60" it will reset to the
            initial angle of 239°.*/
            return time === 0 ? 239 : 239 - (fraction*time);
      }
      function updateClock(){
            const today = new Date();
            const hours = today.getHours() %12;
            const minutes = today.getMinutes();
            const seconds = today.getSeconds();
            // Sets Rotation angle for hands on Analog Clock.
            hourHand.groupTransform.rotate.angle = hoursToAngle(hours);
            minHand.groupTransform.rotate.angle = timeToAngle(minutes);
            secHand.groupTransform.rotate.angle = timeToAngle(seconds);
      }


// The Digital Functions:

        // This makes the separator i.e. ":", flash / Blink as each second passes by.
        function setSeparator(val){
              /* This is a short-hand if statement that declares if a "second value" is even;
              It can be divided by 2 || is odd; it can't be divided by 2, resulting in the
              character being displayed or not. This will be displayed like it is flashing. */ 
              separator.style.display = (val % 2 ===0 ? "inline": "none");
        }
        function drawDigit(val,place){
              // place defines the positioning of each individual character.
              // This uses a dynamic href value.
              place.image= `Font/${val}.png`;
        }
        function setHours(val){
              // This applies to the First Character of the Hour Charcters.
              if(val > 9){
                    drawDigit(Math.floor(val/10),hours1);
              }else{
                    drawDigit("",hours1);
              }
              // This applies to the Second Character of the Hour Charcters.
              // The value of the Second Character will be the remainder character for the First Character.
              drawDigit(Math.floor(val%10),hours2);
        }
        // The Minutes both work similarly to the Second Character of the Hour Charcters.
        function setMinutes(val){
              // This applies to the First Character of the Minute Charcters.
              drawDigit(Math.floor(val/10),minutes1);
              // This applies to the Second Character of the Minute Charcters.
              drawDigit(Math.floor(val%10),minutes2);
       }


//Statistics Animations

        //Steps Animation
        const stepsIcon = document.getElementById("stepsIcon");
        animateSteps(500);
        function animateSteps(tempo){
              let frame = 1;
              let frameCount = 2;
              setInterval(function(){
                    // Loading Current Frame using a Dynamic Frame Value.
                    stepsIcon.href = `Animations/Steps/step${frame}.png`;
                    // The Incremental Order of Frames.
                    frame++;
                    if(frame > frameCount){
                          // This Loops the animation; by resetting on completion.
                          frame = 1;
                    }
              },tempo)
        }
        //Heart Rate Animation
        const bpmIcon = document.getElementById("bpmIcon");
        animateBPM(120);
        function animateBPM(tempo){
              let frame = 1;
              let frameCount = 9;
              setInterval(function(){
                    // Loading Current Frame using a Dynamic Frame Value.
                    bpmIcon.href = `Animations/BPM/bpm${frame}.png`;
                    // The Incremental Order of Frames.
                    frame++;
                    if(frame > frameCount){
                          // This Loops the animation; by resetting on completion.
                          frame = 1;
                    }
              },tempo)
        }
        //Calorie Counter Animation
        const burnIcon = document.getElementById("burnIcon");
        animateKcal(1000);
        function animateKcal(tempo){
              let frame = 1;
              let frameCount = 2;
              setInterval(function(){
                    // Loading Current Frame using a Dynamic Frame Value.
                    burnIcon.href = `Animations/Calories/burn${frame}.png`;
                    // The Incremental Order of Frames.
                    frame++;
                    if(frame > frameCount){
                          // This Loops the animation; by resetting on completion.
                          frame = 1;
                    }
              },tempo)
        }
        //Floor Counter Animation
        const floorsIcon = document.getElementById("floorsIcon");
        animateFloors(400);
        function animateFloors(tempo){
              let frame = 1;
              let frameCount = 6;
              setInterval(function(){
                    // Loading Current Frame using a Dynamic Frame Value.
                    floorsIcon.href = `Animations/Floors/floors${frame}.png`;
                    // The Incremental Order of Frames.
                    frame++;
                    if(frame > frameCount){
                          // This Loops the animation; by resetting on completion.
                          frame = 1;
                    }
              },tempo)
        }
        //Power Level Animation
        const btIcon = document.getElementById("btIcon");
        animateBattery(600);
        function animateBattery(tempo){
              let frame = 1;
              let frameCount = 6;
              setInterval(function(){
                    // Loading Current Frame using a Dynamic Frame Value.
                    btIcon.href = `Animations/Battery/bt${frame}.png`;
                    // The Incremental Order of Frames.
                    frame++;
                    if(frame > frameCount){
                          // This Loops the animation; by resetting on completion.
                          frame = 1;
                    }
              },tempo)
        }


// On Tick Actions

      clock.ontick = evt =>{
            const d = evt.date;
            const hours = d.getHours();
            // This is responsible for displaying a "0" preceding single digit characters.
            const minute = ("0" + d.getMinutes()).slice(-2);
            setDay(d.getDay());
            date.text = d.getDate();
            // This will allow the Time to be displayed in a "12 hour format" aswell as a "24 hour format".
            if(preferences.clockDisplay === "12h"){
                  // 12 Hour Format
                  hours = hours % 12 || 12;
            }else{
                  // 24 Hour Format
                  hours = util.zeroPad(hours);
            }
            setHours(hours);
            setMinutes(minute);
            setSeparator(d.getSeconds());
            updateClock();
            updateStatistics();
      }





















