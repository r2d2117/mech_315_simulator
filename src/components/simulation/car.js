import * as su from "./shapeutil.js";
import Road from "./road.js";
import * as tf from '@tensorflow/tfjs';
import * as dq from 'collections/deque';

export default class Car{

    constructor(roadFun=null, properties=null){

        if(properties==null){
            properties = {};
        }

        var wheelbase = 2.74;
        var wellCenterHeight = 0.124847;
        var wellRadius = 0.38;
        var frontWellCenter = -0.358914;
        var center = [frontWellCenter, wellCenterHeight];
        var chassis = su.arc(center, wellRadius, (-19.18*Math.PI/180), (200.96*Math.PI/180), 50);

        var rearWellCenter = frontWellCenter - wheelbase;
        var rearCenter = [rearWellCenter, wellCenterHeight];
        var rearChassis = su.arc(rearCenter, wellRadius, (-19.18*Math.PI/180), (194.3*Math.PI/180), 50);

        var wholeChassis = tf.concat([chassis,rearChassis],1).arraySync();

        var chassisDelta = [
            [-0.514, -0.069, 0.269, 0.392, 1.03, 0.891, 0.583, 1.32, 0.138, -0.092],
            [0, 0.392, 0.415, 0.046, 0.292, 0, -0.33, -0.253, -0.238, -0.35]
        ]

        for(var i = 0; i<chassisDelta[0].length; i++){
            var deltaX = chassisDelta[0][i];
            var deltaY = chassisDelta[1][i];
            var chassisXP = wholeChassis[0][wholeChassis[0].length-2]+deltaX;
            var chassisYP = wholeChassis[1][wholeChassis[1].length-2]+deltaY;

            wholeChassis[0].push(chassisXP);
            wholeChassis[1].push(chassisYP);

        }
        wholeChassis[0].push(wholeChassis[0][0]);
        wholeChassis[1].push(wholeChassis[1][0]);

        var zeroes = new Array(wholeChassis[0].length).fill(0);


        wholeChassis.push(zeroes);

        var lf = 0.4 * wheelbase;
        var lr = 0.6 * wheelbase;

        var vCOG = [
            [rearWellCenter + lr],
            [0.4064],
            [1],
        ]
        //console.log("vCOG", vCOG, vCOG[0][0], vCOG[1][0]);
        var before = wholeChassis.clone();
        console.debug("wholeChassis", before);

        for(var j = 0; j<wholeChassis[0].length; j++){

            wholeChassis[0][j] -= vCOG[0][0];
            wholeChassis[1][j] -= vCOG[1][0];
        }

        console.debug("shifted chassis", wholeChassis);


    }









 }
