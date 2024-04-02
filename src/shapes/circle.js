// @ts-nocheck
import Shape from '../mixins/shape';
import Styles from '../mixins/styles';
import Ellipse from './ellipse';
import Utils from '../utils';
import svg from 'virtual-dom/virtual-hyperscript/svg';

var { assign } = Object;
class Circle {
  constructor(x, y, radius) {
    this.shape();
    this.styles();
    this.state.x = x;
    this.state.y = y;
    this.state.radius = radius;
  }
  toPolygon(opts, parent) {
    var ellipse = new Ellipse(
      this.state.x,
      this.state.y,
      this.state.radius * 2,
      this.state.radius * 2
    );
    var poly = ellipse.toPolygon(opts, false);
    Utils.copyMixinVars(this, poly);
    Utils.groupLogic(poly, this.parent, parent);
    return poly;
  }
  radius(radius, relative) {
    this.state.radius = relative ? this.state.radius + radius : radius;
    this.changed();
    return this;
  }
  scale(scalar) {
    this.scaleStyles(scalar);
    this.state.radius *= scalar;
    this.changed();
    return this;
  }
  copy(parent) {
    var copy = new Circle();
    copy.state.radius = this.state.radius;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }
  render(opts) {
    var attr = {
      cx: Utils.s(this.state.x),
      cy: Utils.s(this.state.y),
      r: Utils.s(this.state.radius)
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);
    return svg('circle', attr);
  }
}

assign(Circle.prototype, Shape, Styles, { type: 'circle' });

export default Circle;
