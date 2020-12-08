<template>
<div class="inner">
    <canvas id="canvas"></canvas>
</div>
</template>

<script>

import * as su from "./shapeutil.js";

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
            console.log("init called");
            this.sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
            this.moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
            this.earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
            window.requestAnimationFrame(this.draw);
        },
        draw(){
            var canvas = document.getElementById('canvas');
            canvas.width = 300;
            canvas.height = 300;
            var ctx = canvas.getContext('2d');

            ctx.globalCompositeOperation = 'destination-over';
            ctx.clearRect(0, 0, 300, 300); // clear canvas

            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
            ctx.save();
            ctx.translate(150, 150);

            // Earth
            var time = new Date();
            ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
            ctx.translate(105, 0);
            ctx.fillRect(0, -12, 40, 24); // Shadow
            ctx.drawImage(this.earth, -12, -12);

            // Moon
            ctx.save();
            ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
            ctx.translate(0, 28.5);
            ctx.drawImage(this.moon, -3.5, -3.5);
            ctx.restore();

            ctx.restore();

            ctx.beginPath();
            ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
            ctx.stroke();

            ctx.drawImage(this.sun, 0, 0, 300, 300);
            window.requestAnimationFrame(this.draw);
        }

    }
}

console.log(su.arc());
console.log(su.zigzag());


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
  height: 300px;
  }

</style>
