import * as tf from '@tensorflow/tfjs';
import * as dq from 'collections/deque';
import * as nj from 'numj';

export default class Road{

    constructor(length, resolution=300, mode="flat", amplitude=0.3, frequency=0.04, minX = null){
        this.resolution = resolution;
        this.length = length;
        this.mode = mode;
        this.amplitude = amplitude,
        this.frequency = frequency;

        var numPoints = parseInt(length*resolution);
        this.numPoints = numPoints;
        this.distance = 0;

        if (minX==null){
            this.minX = -length/2;
            console.log(this.minX);
        }
        else{
            this.minX = minX;
        }
        this.maxX = this.minX + length;


        this.xCoords = tf.linspace(this.minX, this.maxX, numPoints).arraySync();


        var zer = tf.zeros([1,numPoints]).arraySync()[0];
        this.yCoords = dq(zer);


    }

    getCoords(){
        return [this.xCoords,this.yCoords.toArray()];

    }

    generate(lengthToGen){

        var newPoints = parseInt(lengthToGen*this.resolution);

        if (lengthToGen > 0 && newPoints == 0){
            newPoints = 1;
        }

        var amp = this.amplitude;
        var freq = this.frequency;
        var dist = this.distance;
        var res = this.resolution;

        var types = ["sine", "square", "triangle", "bump"];


        for (var i = 0; i<newPoints; i++){
            this.yCoords.shift();

            if (types.includes(this.mode)){

                var sinArg = fr






            }
            else if (self.mode == "flat"){



            }
            else{
                throw 'Invalid mode';
            }



        }
    }

}
