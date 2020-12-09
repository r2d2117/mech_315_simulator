<template>
<div class="inner">
    <canvas id="canvas"></canvas>
</div>
</template>

<script>

import * as su from "./shapeutil.js";
import Road from "./road.js";

export default {
    data() {
        return {
            name: 'Simulation',
            sun: undefined,
            moon: undefined,
            earth: undefined,
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
            this.sun = new Image();
            this.moon = new Image();
            this.earth = new Image();

            this.sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
            this.moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
            this.earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
            window.requestAnimationFrame(this.draw);
        },
        draw(){
            var canvas = document.getElementById('canvas');
            canvas.width = 600;
            canvas.height = 600;
            var ctx = canvas.getContext('2d');

            ctx.globalCompositeOperation = 'destination-over';
            ctx.clearRect(0, 0, 600, 600); // clear canvas

            ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
            ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
            ctx.save();
            ctx.translate(100, 400);

            // Earth
            var time = new Date();
            ctx.rotate(((2 * Math.PI) / 60) * time.getMilliseconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
            ctx.translate(60, 0);
            ctx.fillRect(0, -12, 40, 24); // Shadow
            ctx.drawImage(this.earth, -12, -12);


            // 2ndEarth
            ctx.restore();
            ctx.save();
            ctx.translate(500,400);
            ctx.rotate(((2 * Math.PI) / 60) * time.getMilliseconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
            ctx.translate(60, 0);
            ctx.fillRect(0, -12, 40, 24); // Shadow
            ctx.drawImage(this.earth, -12, -12);

            ctx.restore();

            ctx.beginPath();
            ctx.arc(100, 400, 60, 0, Math.PI * 2, false); // Earth orbit
            ctx.moveTo(560,400);

            ctx.arc(500,400, 60, 0, Math.PI * 2, false);
            ctx.stroke();


            //window.requestAnimationFrame(this.draw);
        }

    }
}

console.log(su.arc());
console.log(su.zigzag());

var r = new Road(10,300,"flat",0.3,0.4,0.2);


</script>

<style scoped>
  .inner{
  display: block;
  margin: auto;
  width: 100%;
  text-align: center;
  padding: 4rem 0;
  }

  #canvas{
  height: 600px;
  }

</style>
