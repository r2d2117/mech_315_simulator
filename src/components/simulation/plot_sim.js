import * as tf from '@tensorflow/tfjs';

import * as su from "./shapeutil.js";

export default class PlotSim{
    constructor(car, suspension = false, roadMarkerInterval = 0, roadMarkerVerticalOffset= 0.25){


        var chassis = car.appearance["chassis"];
        var wheel = car.appearance["wheel"];
        var wheelRadius = car.appearance["wheelRadius"];
        var hub = car.appearance["hub"];
        var hubRadius = car.appearance["hubRadius"];
        var lowestPoint = car.appearance["lowestPoint"];
        var groundClearance = car.appearance["groundClearance"];

        var l_f = car.properties["l_f"];
        var l_r = car.properties["l_r"];

        var wheelDatum = lowestPoint - groundClearance + wheelRadius;

        var lines = {};

        lines["chassis"] = [
            chassis[0],
            chassis[1]
        ];

        lines["cog"] = [0,0];

        lines["frontSuspension"] = [[],[]];

        lines["rearSuspension"] = [[],[]];

        lines ["frontTire"] = [
            wheel[0].map(e => e + l_f),
            wheel[1].map(e => e + wheelDatum)
        ];

        lines["frontHub"] = [
            hub[0].map(e => e + l_f),
            hub[1].map(e => e + wheelDatum)
        ];

        lines["frontMarker"] = [
            [l_f, l_f + hubRadius],
            [wheelDatum, wheelDatum]
        ];

        lines["rearTire"] = [
            wheel[0].map(e => e - l_r),
            wheel[1].map(e => e + wheelDatum)
        ];

        lines["rearHub"] = [
            hub[0].map(e => e -l_r),
            hub[1].map(e => e + wheelDatum)
        ];

        lines["rearMarker"] = [
            [-l_r, -l_r-1+hubRadius],
            [wheelDatum-1, wheelDatum-1]
        ];

        var roadProfile = car.roadProfile;

        var roadDatum = lowestPoint - groundClearance;




        lines["road"] = [
            roadProfile[0],
            roadProfile[1].map(x => x + roadDatum)
        ];


        this.suspension = suspension;
        this.lines = lines;
        this.car = car;
        this.wheelDatum = wheelDatum;
        this.iteration = 0;
        this.roadDatum = roadDatum;
    }

    static getTransformation(angle, xOffset, yOffset){

        return [
            [Math.cos(angle), -Math.sin(angle), xOffset],
            [Math.sin(angle), Math.cos(angle), yOffset],
            [0,0,1]
        ];
    }

    updateAnimation = (elapsedTime) =>{

        var car = this.car;
        var wheelDatum = this.wheelDatum;
        var l_f = car.properties["l_f"];
        var l_r = car.properties["l_r"];
        var hubRadius = car.appearance["hubRadius"];
        var yC = car.state["position"][0][0];
        var phi = car.state["position"][1][0];
        var yF = car.state["position"][2][0];
        var yR = car.state["position"][3][0];



        var transformationMatrix = PlotSim.getTransformation(phi, 0, yC);
        var chassis = car.appearance["chassis"];


        var transformationMatrixTensor = tf.tensor(transformationMatrix);
        var chassisTensor = tf.tensor(chassis);

        var transformedChassis = tf.matMul(transformationMatrixTensor,chassisTensor).arraySync();
        this.lines["chassis"] = transformedChassis;

        //console.log(car.appearance["wheel"]);


        this.lines["cog"][1] = yC;
        this.lines["frontTire"][1] = car.appearance["wheel"][1].map(e => e + wheelDatum + yF );
        this.lines["frontHub"][1] = car.appearance["hub"][1].map(e => e + wheelDatum + yF);
        this.lines["rearTire"][1] = car.appearance["wheel"][1].map(e => e + wheelDatum + yR);
        this.lines["rearHub"][1] = car.appearance["hub"][1].map(e => e + wheelDatum + yR);
        //console.log(car.appearance["hub"][1].map(e => e + wheelDatum + yR));

        //console.log(wheelDatum, yR);
        var wheelAngle = (car.state["distance_traveled"]) / car.appearance["wheelRadius"];
        //console.log(this.lines["road"]);


        this.lines["road"][1] = car.roadProfile[1].map(e => e - this.roadDatum);



        this.lines["frontMarker"] = [
            [l_f, l_f+hubRadius * Math.cos(-wheelAngle)],
            [wheelDatum + yF-0.1, wheelDatum + yF-0.1+ hubRadius*Math.sin(-wheelAngle)]
        ];

        this.lines["rearMarker"] = [
            [-l_r, -l_r+hubRadius * Math.cos(-wheelAngle)],
            [wheelDatum + yR-0.1, wheelDatum - 0.1 + yR+ hubRadius*Math.sin(-wheelAngle)]
        ];



    }
}
