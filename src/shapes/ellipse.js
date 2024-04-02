// @ts-nocheck

import Shape from '../mixins/shape';
import Box from '../mixins/box';
import Styles from '../mixins/styles';
import Polygon from './polygon';
import Utils from '../utils';
import svg from 'virtual-dom/virtual-hyperscript/svg';

var { assign } = Object;

class Ellipse {
  constructor(x, y, width, height) {
    this.shape();
    this.box();
    this.styles();
    this.state.x = x;
    this.state.y = y;
    this.state.width = width;
    this.state.height = height;
  }
  toPolygon(opts, parent) {
    var numVectors = 16;
    var rx = this.state.width / 2;
    var ry = this.state.height / 2;

    // if we're calculating the number of vectors based on spacing
    // find circumference and divide by spacing.
    if (opts && opts.spacing) {
      var circumference = Math.PI * (this.state.width + this.state.height);
      numVectors = circumference / opts.spacing;
    }

    var vectorAngle = 360 / numVectors;

    var poly = new Polygon(this.state.x, this.state.y);
    for (var i = 0; i < numVectors; i++) {
      var x = Math.cos(Utils.radians(i * vectorAngle)) * rx;
      var y = Math.sin(Utils.radians(i * vectorAngle)) * ry;
      poly.lineTo(x, y);
    }

    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);

    return poly;
  }
  scale(scalar) {
    this.scaleBox(scalar);
    this.scaleStyles(scalar);
    this.changed();
    return this;
  }
  copy(parent) {
    var copy = new Ellipse();
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }
  render(opts) {
    var attr = {
      cx: Utils.s(this.state.x),
      cy: Utils.s(this.state.y),
      rx: Utils.s(this.state.width / 2),
      ry: Utils.s(this.state.height / 2)
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('ellipse', attr);
  }
}

assign(Ellipse.prototype, Shape, Box, Styles, { type: 'ellipse' });

export default Ellipse;
