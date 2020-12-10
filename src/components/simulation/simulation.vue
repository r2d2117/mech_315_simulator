<template>
<div class="inner">
    <canvas id="canvas"></canvas>
</div>
</template>

<script>

import * as su from "./shapeutil.js";
import Road from "./road.js";
import Car from "./car.js";

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

            this.r = new Road(600,1,"triangle",40,0.03);

            window.requestAnimationFrame(this.draw);
        },
        draw(){
            var canvas = document.getElementById('canvas');
            canvas.width = 600;
            canvas.height = 600;
            var ctx = canvas.getContext('2d');

            ctx.globalCompositeOperation = 'destination-over';
            ctx.clearRect(0, 0, 600, 600); // clear canvas

            ctx.fillStyle = 'rgba(255, 26, 5, 1)';
            ctx.strokeStyle = 'rgba(0, 153, 255, 1)';
            ctx.strokeWidth = '4px';
            ctx.save();
            ctx.translate(100, 400);

            // Earth
            //var time = new Date();
            //ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
            //ctx.translate(60, 0);
            //ctx.fillRect(0, 0, -40, 4); // Shadow



            // 2ndEarth
            //ctx.restore();
            //ctx.save();
            //ctx.translate(500,400);
            //ctx.rotate(((2 * Math.PI) / 6) *time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
            //ctx.translate(60, 0);
            //ctx.fillRect(0, 0, -40, 4); // Shadow


            ctx.restore();
            var ground = this.r.generate(1);
            ctx.beginPath();
            ctx.arc(100, 335+(ground[1][100]), 60, 0, Math.PI * 2, false); // Earth orbit
            ctx.moveTo(560,335+ground[1][500]);

            ctx.arc(500,335+ground[1][500], 60, 0, Math.PI * 2, false);
            ctx.stroke();





            ctx.beginPath();
            ctx.moveTo(ground[0][0]+300, ground[1][0]+400);



            for(var i = 1; i < ground[0].length; i++){
                var x = ground[0][i]+300;
                var y = ground[1][i]+400;

                ctx.lineTo(x, y);
            }
            ctx.stroke();

            window.requestAnimationFrame(this.draw);
        }

    }
}

//console.log(su.arc());
//console.log(su.zigzag());
var v = new Car();


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
