import * as tf from '@tensorflow/tfjs';

const PI = Math.PI;

/* exported arc */

export function arc(center=[0,0], radius=1, theta1=0, theta2=2*PI, resolution=180){

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

export function zigzag(st=[0,0], en=[0,0], nds, width){

    var nodes = Math.max(parseInt(nds), 1);

    var start = tf.tensor(st).reshape([2,]);
    var end = tf.tensor(en).reshape([2,]);


    if (start.equal(end)){
        var s = start.arraySync();
        return [s[0],s[1]];
    }

    var length = tf.norm(end.sub(start));

    length.print();

    return null;




}
