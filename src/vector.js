import Utils from './utils';
var ROUND_PRECISION = 9;

var { degrees, radians, round } = Utils

class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.type='vector'
  }



  set (x, y) {
    this.x = x;
    this.y = y;
  }

  add (vec) {
    return new Vector(this.x + vec.x, this.y + vec.y);
  }

  sub (vec) {
    return new Vector(this.x - vec.x, this.y - vec.y);
  }

  multiply (scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  divide (scalar) {
    var vec = new Vector(0, 0);
    if (scalar) {
      vec.x = this.x / scalar;
      vec.y = this.y / scalar;
    }
    return vec;
  }

  distance (vec) {
    return Math.sqrt(this.distanceSquared(vec));
  }

  distanceSquared (vec) {
    var dx = this.x - vec.x;
    var dy = this.y - vec.y;
    return dx * dx + dy * dy;
  },

  lerp (vec, scalar) {
    var x = (vec.x - this.x) * scalar + this.x;
    var y = (vec.y - this.y) * scalar + this.y;
    return new Vector(x, y);
  }

  dot (vec) {
    return this.x * vec.x + this.y * vec.y;
  }

  length () {
    return Math.sqrt(this.lengthSquared());
  }

  lengthSquared () {
    return this.x * this.x + this.y * this.y;
  }

  normalize () {
    return this.divide(this.length());
  }

  rotation () {
    return degrees(Math.atan2(this.y, this.x));
  }

  rotate (degrees) {
    var rad = radians(this.rotation() + degrees);
    var len = this.length();
    var x = round(Math.cos(rad) * len, ROUND_PRECISION);
    var y = round(Math.sin(rad) * len, ROUND_PRECISION);
    return new Vector(x, y);
  }

  limit (max) {
    const mSq = this.lengthSquared();
    if (mSq > max * max) {
      return this.divide(Math.sqrt(mSq)).multiply(max);
    }
    return this.copy();
  }

  copy () {
    return new Vector(this.x, this.y);
  }

  toString () {
    return '(x: ' + this.x + ', y: ' + this.y + ')';
  }
}


export default Vector;
