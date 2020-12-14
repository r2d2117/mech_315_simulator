<template>
<div class="inner">
    <canvas id="canvas"></canvas>
</div>
</template>

<script>

import * as su from "./shapeutil.js";
import Road from "./road.js";
import Car from "./car.js";
import Sim from "./sim.js"

export default {
    data() {
        return {
            name: 'Simulation',
        };
    },
    props: {
	v1: Number,
	v2: Number,
	v3: Number,
    },
    mounted() {
        this.init()
    },
    methods: {
        init(){
            this.car = new Car();

            this.car.setAccel(1.5);
            this.timeStep = 0.0005;
            this.interval = 100;
            this.sim = new Sim(this.car);
            this.r = this.car.roadFun;
            this.iter = 0;
            this.fpsInterval = 1000/30;
            this.startTime = Date.now();
            this.then = this.startTime;

            window.requestAnimationFrame(this.draw);
        },
        draw(){

            if (this.iter < 10000){
                window.requestAnimationFrame(this.draw);
            }

            var now = Date.now ()
            var elapsed = now - this.then;
            var totalElapsed = now - this.startTime;
            this.then = now - (elapsed % this.fpsInterval);

            if (elapsed > this.fpsInterval){
                var canvas = document.getElementById('canvas');
                canvas.width = 600;
                canvas.height = 500;
                var ctx = canvas.getContext('2d');

                ctx.globalCompositeOperation = 'destination-over';
                ctx.clearRect(0, 0, 600, 500); // clear canvas

                ctx.fillStyle = 'rgba(255, 26, 5, 1)';
                ctx.strokeStyle = 'rgba(20, 20, 20, 1)';
                ctx.strokeWidth = '10px';
                ctx.save();

                var ground = this.sim.lines["road"];


                
                ctx.beginPath();
                ctx.moveTo(ground[0][0]*100+300, ground[1][0]*100+420);

                for(var i = 1; i < ground[0].length; i++){
                    var x = ground[0][i]*100+300;
                    var y = -ground[1][i]*100+420;

                    ctx.lineTo(x, y);
                }
                ctx.stroke();
                var chassis = this.sim.lines["chassis"];
                
                //console.log("chassis ", chassis)
                ctx.restore();
                ctx.strokeStyle = 'rgba(57, 73, 92, 1)';
                ctx.strokeWidth = '10px';

                

                ctx.moveTo(chassis[0][0]*100+300, -chassis[1][0]*100+300);
                for (var j = 1; j< chassis[0].length; j++){
                    var m = chassis[0][j]*100+300;
                    var n = -chassis[1][j]*100+300;

                    //console.log(m,n);

                    ctx.lineTo(m,n);
                }

                ctx.stroke();

                var fw = this.sim.lines["frontTire"];
                //console.log(fw);

                ctx.strokeStyle = 'rgba(20, 20, 20, 1)';
                ctx.strokeWidth = '18px';

                ctx.beginPath();

                ctx.moveTo(fw[0][0]*100 + 300, -fw[1][0]*100+300);
                for (var k = 1; k < fw[0].length; k++){
                    var fwx = fw[0][k]*100 + 300;
                    var fwy = -fw[1][k]*100 + 300;

                    ctx.lineTo(fwx,fwy);

                }
                ctx.stroke();

                var rw = this.sim.lines["rearTire"];

                ctx.beginPath();

                ctx.moveTo(rw[0][0]*100 + 300, -rw[1][0]*100+300);
                for (var l = 1; l < rw[0].length; l++){
                    var rwx = rw[0][l]*100 + 300;
                    var rwy = -rw[1][l]*100 + 300;

                    ctx.lineTo(rwx,rwy);

                }
                ctx.stroke();

                var fh = this.sim.lines["frontHub"];

                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 26, 6, 1)';
                ctx.moveTo(fh[0][0]*100 + 300, -fh[1][0]*100+300);
                for (var w = 1; w < fh[0].length; w++){
                    var fhx = fh[0][w]*100 + 300;
                    var fhy = -fh[1][w]*100 + 300;

                    ctx.lineTo(fhx,fhy);

                }
                ctx.stroke();

                var rh = this.sim.lines["rearHub"];



                ctx.beginPath();

                ctx.moveTo(rh[0][0]*100 + 300, -rh[1][0]*100+300);


                for (var xx = 1; xx < rh[0].length; xx++){
                    var rhx = rh[0][xx]*100 + 300;
                    var rhy = -rh[1][xx]*100 + 300;

                ctx.lineTo(rhx,rhy);

            }
            ctx.stroke();


            var fm = this.sim.lines["frontMarker"];

            ctx.beginPath();

            ctx.moveTo(fm[0][0]*100 + 300, -fm[1][0]*100+300);


            for (var ff = 1; ff < fm[0].length; ff++){
                var fmx = fm[0][ff]*100 + 300;
                var fmy = -fm[1][ff]*100 + 300;

                ctx.lineTo(fmx,fmy);

            }
            ctx.stroke();

            var rm = this.sim.lines["rearMarker"];




            ctx.beginPath();

            ctx.moveTo(rm[0][0]*100 + 300, -rm[1][0]*100+300);


            for (var rr = 1; rr < rm[0].length; rr++){
                var rmx = rm[0][rr]*100 + 300;
                var rmy = -rm[1][rr]*100 + 300;

                ctx.lineTo(rmx,rmy);

            }
            ctx.stroke();


            }


            this.iter++;
            this.sim.updateAnimation(0.002);
            this.car.updateState(0.005);





        }

    }
}






</script>

<style scoped>
  .inner{
  display: block;
  margin: 0 auto;
  width: 100%;
  text-align: center;
  }

  #canvas{
  height: 600px;
  }

</style>
