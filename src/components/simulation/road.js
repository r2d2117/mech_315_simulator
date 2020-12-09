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
        this.distance = 0;

        if (minX==null){
            this.minX = -length/2;
            //console.log(this.minX);
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
        var nextPoint;

        var types = ["sine", "square", "triangle", "bump"];
        //console.log(this.mode);
        //console.log(this.mode=="flat");
        var subTypes = ["triangle", "bump"];

        for (var i = 0; i<newPoints; i++){
            this.yCoords.shift();

            if (types.includes(this.mode)){

                var sineArg = freq * (dist +(i/res));
                var sineVal = Math.sin(sineArg);

                if (this.mode == "sine"){
                    nextPoint = amp * sineVal;
                }
                else if (this.mode == "square"){
                    if (sineVal >= 0){
                        nextPoint = 0;
                    }
                    else{
                        nextPoint = amp;
                    }
                }
                else if (subTypes.includes(this.mode)){
                    var waveArg = sineArg % (2 * Math.pi);
                    if (this.mode == "bump"){
                        waveArg = waveArg * 2;
                    }
                    if (waveArg <= Math.pi){
                        nextPoint = amp * (waveArg/Math.pi);
                    }
                    else if (waveArg <= 2*Math.pi){
                        nextPoint = amp * (2 * Math.pi - waveArg)/Math.pi;
                    }
                    else{
                        nextPoint = 0;
                    }
                }
            }
            else if (this.mode == "flat"){
                nextPoint = 0;
            }
            else{
                throw 'Invalid mode';
            }
            this.yCoords.push(nextPoint);
        }
        this.distance += lengthToGen;
        return [this.xCoords, this.yCoords.toArray()];
    }

}
