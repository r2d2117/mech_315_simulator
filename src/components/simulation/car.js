import * as su from "./shapeutil.js";
import Road from "./road.js";
import * as tf from '@tensorflow/tfjs';
import * as dq from 'collections/deque';



export default class Car{

    constructor(roadFun=null, properties=null){

        if(properties==null){
            properties = {};
        }

        var wheelbase = 2.89052
        var wellCenterHeight = 0.14;
        var wellRadius = 0.5;
        var frontWellCenter = -0.7;
        var center = [frontWellCenter, wellCenterHeight];
        var chassis = su.arc(center, wellRadius, (-14.18*Math.PI/180), (190*Math.PI/180), 50);

        var rearWellCenter = frontWellCenter - wheelbase;
        var rearCenter = [rearWellCenter, wellCenterHeight];
        var rearChassis = su.arc(rearCenter, wellRadius, (-6*Math.PI/180), (190*Math.PI/180), 50);

        var wholeChassis = tf.concat([chassis,rearChassis],1).arraySync();

        var chassisDelta = [
            [-0.32, -0.12, 0.1, 0.04, 0.3, 2.2, 0.57, 1.32, 0.138, -0.092],
            [0, 0.2, 0, 0.75, 0.8, 0, -0.72, -0.2, -0.6, -0.2]
        ];

        for(var i = 0; i<chassisDelta[0].length; i++){
            var deltaX = chassisDelta[0][i];
            var deltaY = chassisDelta[1][i];
            var chassisXP = wholeChassis[0][wholeChassis[0].length-1]+deltaX;
            var chassisYP = wholeChassis[1][wholeChassis[1].length-1]+deltaY;

            wholeChassis[0].push(chassisXP);
            wholeChassis[1].push(chassisYP);

        }
        wholeChassis[0].push(wholeChassis[0][0]);
        wholeChassis[1].push(wholeChassis[1][0]);

        var zeroes = new Array(wholeChassis[0].length).fill(1);


        wholeChassis.push(zeroes);

        var l_f = 0.4 * wheelbase;
        var l_r = 0.6 * wheelbase;

        var vCOG = [
            [rearWellCenter + l_r],
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

        var fwCenter = [
            [frontWellCenter],
            [wellCenterHeight],
            [1]
        ];

        var rwCenter = [
            [rearWellCenter],
            [wellCenterHeight],
            [1]
        ];

        fwCenter[0][0] = vCOG[0][0];
        fwCenter[1][0] = vCOG[1][0];

        rwCenter[0][0] = vCOG[0][0];
        rwCenter[1][0] = vCOG[1][0];

        var fwTop = [
            [fwCenter[0]],
            [fwCenter[1]+wellRadius],
            [fwCenter[2]]
        ];

        var rwTop = [
            [rwCenter[0]],
            [rwCenter[1]+wellRadius],
            [rwCenter[2]]
        ];

        var tireWidth = 0.20;
        var tireAspect = 0.60;
        var hubD = 17 * 0.03;

        var tireHeight = tireAspect * tireWidth;
        var hubRadius = 0.5 * hubD;

        var wheelRadius = hubRadius + tireHeight;

        var wheel = su.arc([0,-0.1],wheelRadius, 0, 2*Math.PI, 20);
        var hub = su.arc([0,-0.1], hubRadius, 0, 2*Math.PI, 20);



        var m_c = 1600;
        var m_f = 2 * 23;
        var m_r = m_f;
        var I_zz = 2500;
        var m = m_c + m_f + m_r;

        var k_fs = 60000;
        var k_rs = 0.9*k_fs;
        var k_ft = 150000;
        var k_rt = 150000;

        var c_fs = 2000;
        var c_rs = 2000;
        var c_ft = 20;
        var c_rt = 20;


        var mass_vector = [
            [m_c],
            [I_zz],
            [m_f],
            [m_r]
        ];

        var stiffness_matrix = [
            [-(k_fs+k_rs), (l_r*k_rs)-(l_f*k_fs), k_fs,k_rs],
            [-((l_f * k_fs)-(l_r*k_rs)), -((Math.pow(l_f,2)*k_fs)+(Math.pow(l_r,2)*k_rs)),
             l_f*k_fs, -l_r*k_rs],
            [k_fs, l_f*k_fs, -(k_fs+k_ft), 0],
            [k_rs, -l_r*k_rs, 0, -(k_rs+k_rt)]
        ];

        var mVTensor = tf.tensor(mass_vector);

        var sMTensor = tf.tensor(stiffness_matrix);

        stiffness_matrix = sMTensor.div(mVTensor).arraySync();



        var damping_matrix = [
            [-(c_fs + c_rs), l_r * c_rs - l_f * c_fs, c_fs, c_rs],
            [-(l_f * c_fs - l_r * c_rs), -((Math.pow(l_f,2) * c_fs) + (Math.pow(l_r, 2) * c_rs)),
             l_f * c_fs, -l_r * c_rs],
            [c_fs, l_f * c_fs, -(c_fs + c_ft), 0],
            [c_rs, -l_r * c_rs, 0, -(c_rs + c_rt)]
        ];

        var dMTensor = tf.tensor(damping_matrix);

        damping_matrix = dMTensor.div(mVTensor).arraySync();

        var road_stiffness_matrix = [
            [0, 0],
            [0, 0],
            [k_ft, 0],
            [0, k_rt]
        ];

        var rSTensor = tf.tensor(road_stiffness_matrix);

        road_stiffness_matrix = rSTensor.div(mVTensor).arraySync();

        var road_damping_matrix = [
            [0, 0],
            [0, 0],
            [c_ft, 0],
            [0, c_rt]
        ];

        var rDTensor = tf.tensor(road_damping_matrix);

        road_damping_matrix = rDTensor.div(mVTensor).arraySync();


        var lowestPoint = Math.min(...wholeChassis[1]);
        var groundClearance = 7 * 0.0254;
        var initHeight = -lowestPoint + groundClearance;

        var maxSpeed = 60;
        var maxAccel = 4.4;
        var maxDecel = -9.0;

        this.appearance = {
            "chassis": wholeChassis,
            "frontWellCenter": frontWellCenter,
            "rearWellCenter": rearWellCenter,
            "frontWellTop": fwTop,
            "rearWellTop": rwTop,
            "hubRadius": hubRadius,
            "wheelRadius": wheelRadius,
            "wheel": wheel,
            "hub": hub,
            "lowestPoint": lowestPoint,
            "groundClearance": groundClearance
        };

        this.properties = {
            "l_f": l_f,
            "l_r": l_r,
            "init_height": initHeight,
            "wheelbase": wheelbase,
            "m_c": m_c,
            "m_f": m_f,
            "m_r": m_r,
            "I_zz": I_zz,
            "m": m,
            "k_fs": k_fs,
            "k_rs": k_rs,
            "k_ft": k_ft,
            "k_rt": k_rt,
            "c_fs": c_fs,
            "c_rs": c_rs,
            "c_ft": c_ft,
            "c_rt": c_rt,
            "mass_vector": mass_vector,
            "stiffness_matrix": stiffness_matrix,
            "damping_matrix": damping_matrix,
            "road_stiffness_matrix": road_stiffness_matrix,
            "road_damping_matrix": road_damping_matrix,
            "maxSpeed": maxSpeed,
            "maxAccel": maxAccel,
            "maxDecel": maxDecel
        };

        this.state = {
            "position": tf.zeros([4,1]).arraySync(),
            "velocity": tf.zeros([4,1]).arraySync(),
            "accel": tf.zeros([4,1]).arraySync(),
            "road_position": tf.zeros([2,1]).arraySync(),
            "road_velocity": tf.zeros([2,1]).arraySync(),
            "horizontal_accel": 0,
            "horizontal_velocity": 0,
            "distance_traveled": 0
        };

        if (roadFun == null){

            var roadLimits = [-2*l_r, 2*5 * l_f];
            var roadLength = roadLimits[1] - roadLimits[0];

            var road = new Road(roadLength,4, "sine", 0.5, 0.1, roadLength[0]);
            this.roadFun = road;
        }
        else{
            this.roadFun = roadFun;
        }

        this.roadProfile = this.roadFun.getCoords();


    }

    setAccel = (accel, ignoreMax=false) => {

        var max_accel = this.properties["maxAccel"];
        var max_decel = this.properties["maxDecel"];
        if (ignoreMax || ((max_accel >= accel) && (max_decel <= accel))){
            this.state["horizontal_accel"] = accel;
        }
    }

    setVel = (vel, ignoreMax=false) => {

        var maxVel = this.properties["maxSpeed"];

        if (ignoreMax || (maxVel>=vel && vel >= 0)){
            this.state["horizontal_velocity"] = vel;
        }
    }

    updateState = (timeStep) =>{
        var position = this.state["position"];
        var velocity = this.state["velocity"];
        var roadPos = this.state["road_position"];
        var roadVel = this.state["road_velocity"];
        var hVel = this.state["horizontal_velocity"];
        var hAccel = this.state["horizontal_accel"];


        var stiffness_matrix = this.properties["stiffness_matrix"];
        var damping_matrix = this.properties["damping_matrix"];
        var road_stiffness_matrix = this.properties["road_stiffness_matrix"];
        var road_damping_matrix = this.properties["road_damping_matrix"];

        var maxSpeed = this.properties["maxSpeed"];
        //console.log("hVel", hVel);
        if((hVel >= maxSpeed) && hAccel > 0){
            hVel = maxSpeed;
            hAccel = 0;
        }
        else if(hVel < 0 || (hVel <= 0 && hAccel < 0)){
            hVel = 0;
            hAccel = 0;
        }



        hVel += hAccel * timeStep;



        this.state["horizontal_velocity"] = hVel;
        this.state["horizontal_accel"] = hAccel;

        var posTensor = tf.tensor(position);
        var sMTensor = tf.tensor(stiffness_matrix);
        var sXpTensor = tf.matMul(sMTensor,posTensor);
        var dmpMTensor = tf.tensor(damping_matrix);
        var velTensor = tf.tensor(velocity);
        var dXvTensor = tf.matMul(dmpMTensor, velTensor);
        var rsTensor = tf.tensor(road_stiffness_matrix);
        var rpTensor = tf.tensor(roadPos);
        var rvTensor = tf.tensor(roadVel);
        var rdTensor = tf.tensor(road_damping_matrix);


        var rdXrvTensor = tf.matMul(rdTensor, rvTensor);
        var rsXrpTensor = tf.matMul(rsTensor, rpTensor);
        var normalForceVector = this.normalForceVector();




        //console.log(sXp);

        //var accel = tf.add(sXpTensor, dXvTensor, rsXrpTensor, rdXrvTensor, normalForceVector).arraySync();




        var accel = rsXrpTensor.add(rdXrvTensor).add(dXvTensor).add(normalForceVector)
            .add(sXpTensor).arraySync();



        if (Math.abs(position[1][0] > (Math.PI*4/180))){
            velocity[1][0] = 0;

            if (position[1][0] > 0){
                position[1][0] = (Math.PI*4/180);
            }
            else{
                position[1][0] = (-Math.PI*4/180);
            }

        }


        for (var i = 0; i< position.length; i++){
            position[i][0] += velocity[i][0] * timeStep;
            velocity[i][0] += accel[i][0] * timeStep;
        }

        var currStepDistance = hVel * timeStep;



        this.state["distance_traveled"] += currStepDistance;



        var roadCoords = this.roadFun.generate(currStepDistance);

        this.roadProfile = roadCoords;

        var l_f = this.properties["l_f"];
        var l_r = this.properties["l_r"];

        var linear = require('everpolate').linear;


        var roadInterpolationFront = linear(l_f,roadCoords[0], roadCoords[1]);
        var roadInterpolationRear = linear(-l_r, roadCoords[0], roadCoords[1]);




        roadVel[0][0] = roadInterpolationFront[0] - roadPos[0][0];
        roadVel[1][0] = roadInterpolationRear[0] - roadPos[1][0];


        roadPos[0] = roadInterpolationFront;
        roadPos[1] = roadInterpolationRear;

        this.state["position"] = position;
        this.state["velocity"] = velocity;
        this.state["road_position"] = roadPos;
        this.state["road_velocity"] = roadVel;

    }

    normalForceVector = () => {

        var initHeight = this.properties["init_height"];
        var wheelbase = this.properties["wheelbase"];
        var position = this.state["position"];
        var hAccel = this.state["horizontal_accel"];
        var m = this.properties["m"];
        var mass_vector = this.properties["mass_vector"];
        var height = initHeight + position[0][0] + position[2][0];


        var normalForceVector = [
            [0],
            [0],
            [height*m*hAccel/wheelbase],
            [-height*m*hAccel/wheelbase]
        ];

        var normalForceTensor = tf.tensor(normalForceVector);
        var massTensor = tf.tensor(mass_vector);
        normalForceVector = normalForceTensor.div(massTensor);

        return normalForceVector;
    }


 }
