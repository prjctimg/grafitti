// @ts-nocheck

var Shape = require('../mixins/shape');
var Styles = require('../mixins/styles');
var Box = require('../mixins/box');
var Polygon = require('./polygon').default;
var Utils = require('../utils').default;
var svg = require('virtual-dom/virtual-hyperscript/svg');

var { assign } = Object;

class Rectangle {
  constructor(x, y, width, height) {
    this.shape();
    this.box();
    this.styles();
    this.state.x = x;
    this.state.y = y;
    this.state.width = width;
    this.state.height = height;
  }
  round(rx, ry) {
    if (!ry) ry = rx;
    this.state.rx = rx;
    this.state.ry = ry;
    this.changed();
    return this;
  }
  toPolygon(opts, parent) {
    var poly = new Polygon(this.state.x, this.state.y)
      .lineTo(0, 0)
      .lineTo(this.state.width, 0)
      .lineTo(this.state.width, this.state.height)
      .lineTo(0, this.state.height);

    if (opts) poly = poly.toPolygon(opts, false);

    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);

    return poly;
  }
  copy(parent) {
    var copy = new Rectangle();
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }
  scale(scalar) {
    this.scaleBox(scalar);
    this.scaleStyles(scalar);
    this.changed();
    return this;
  }
  render(opts) {
    var attr = {
      x: Utils.s(this.state.x),
      y: Utils.s(this.state.y),
      width: Utils.s(this.state.width),
      height: Utils.s(this.state.height)
    };
    if (this.state.rx) attr.rx = Utils.s(this.state.rx);
    if (this.state.ry) attr.ry = Utils.s(this.state.ry);
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('rect', attr);
  }
}

assign(Rectangle.prototype, Shape, Box, Styles, { type: 'rectangle' });

export default Rectangle;
