// @ts-nocheck

import Shape from '../mixins/shape';
import Styles from '../mixins/styles';
import Utils from '../utils';
import svg from 'virtual-dom/virtual-hyperscript/svg';

class Triangle {
  constructor(x, y, x2, y2, x3, y3) {
    this.shape();
    this.styles();
    this.state.x = x;
    this.state.y = y;

    // Make variables relative to 0,0 as
    // x,y will be used in transform
    this.state.x2 = x2 - x;
    this.state.y2 = y2 - y;
    this.state.x3 = x3 - x;
    this.state.y3 = y3 - y;
  }
  copy(parent) {
    var copy = new Triangle();
    copy.state.x2 = this.state.x2;
    copy.state.y2 = this.state.y2;
    copy.state.x3 = this.state.x3;
    copy.state.y3 = this.state.y3;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }
  scale(scalar) {
    this.scaleStyles(scalar);
    this.state.x2 *= scalar;
    this.state.y2 *= scalar;
    this.state.x3 *= scalar;
    this.state.y3 *= scalar;
    this.changed();
    return this;
  }
  render(opts) {
    var attr = {
      points:
        '0 0 ' +
        this.state.x2 +
        ' ' +
        this.state.y2 +
        ' ' +
        this.state.x3 +
        ' ' +
        this.state.y3
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('polygon', attr);
  }
}

assign(Triangle.prototype, Shape, Styles, { type: 'triangle' });

export default Triangle;
