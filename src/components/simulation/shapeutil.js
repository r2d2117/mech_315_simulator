import * as tf from '@tensorflow/tfjs';

const PI = Math.PI;

/* exported arc */

export function arc(center=[0,0], radius=1, theta1=0, theta2=2*PI, resolution=180){
    console.debug("Values passed to arc ",center,radius,theta1,theta2,resolution);
    var x = tf.scalar(center[0]);
    var y = tf.scalar(center[1]);
    var rad = tf.scalar(radius);

    var thetas = tf.linspace(theta1, theta2, (Math.abs(theta2 - theta1) * (resolution / (2*PI))));

    var aa = (rad).mul(thetas.cos());
    var bb = (rad).mul(thetas.sin());

    var aaa = (x).add(aa);
    var bbb = (y).add(bb);

    var values = tf.stack([aaa,bbb]);


    return values.arraySync();
}

export function zigzag(st=[2,4], en=[2,3], nds=0, width=0){


    var nodes = Math.max(parseInt(nds), 1);
    var ss = tf.tensor1d(st);
    var ee = tf.tensor1d(en);



    var start = ss.reshape([2,-1]);
    var end = ee.reshape([2,-1]);
    var isEqual = start.equal(end);
    var sameCondition = isEqual.flatten().arraySync();

    if (!sameCondition.includes(0)){
        console.debug("Start Coords. equal End Coords.");
        var s = start.arraySync();
        return [s[0],s[1]];
    }

    var length = tf.norm(end.sub(start));


    var diffEndStart = end.sub(start);
    var tangent = diffEndStart.div(length);
    var inverse = tf.tensor([[0,-1],[1,0]]);
    var normal = inverse.dot(tangent);

    var tan = tangent.arraySync();
    var nor = normal.arraySync();
    var len = length.arraySync();

    var widSq = Math.pow(width,2);
    var lenSq = Math.pow(len,2);
    var ndSq = Math.pow(nodes,2);
    var lenSqDiv = lenSq/ndSq;
    var widMinus = widSq - lenSqDiv;

    var normalDist = Math.sqrt(Math.max(0, widMinus));

    console.debug("normalDist: ",normalDist);

    var zz = [];

    for(var i = 1; i<=nodes; i++){

        var one = tf.scalar(len*i-1).mul(tangent);
        var div = tf.scalar(2*nodes);
        var res1 = one.div(div);
        var two = tf.scalar(normalDist*(-1)*i);
        var res2 = two.mul(normal);
        var ret = start.add(res1).add(res2);

        zz.push(ret);
    }

    var zigzagVals = tf.concat(zz);
    var zigzagCoords = tf.concat([start,zigzagVals,end],1);


    return zigzagCoords.arraySync();
}
