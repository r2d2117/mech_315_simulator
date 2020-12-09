import * as tf from '@tensorflow/tfjs';
import * as dq from 'collections/deque';

export default class Road{

    constructor(length, resolution=300, mode="flat", amplitude=0.3, frequency=0.04, minX = null){
        this.resolution = resolution;
        this.length = length;
        this.mode = mode;
        this.amplitude = amplitude,
        this.frequency = frequency;

        var numPoints = parseInt(length*resolution);
        this.numPoints = numPoints;


        if (minX==null){
            this.minX = -length/2;
        }
        else{
            this.minX = minX;
        }
        this.maxX = this.minX + length;

        this.xCoords = tf.linspace(this.minX,this.maxX, numPoints);

        self.yCoords = dq([1,2,3,4,5]);

        console.log(self.yCoords);

    }




}
