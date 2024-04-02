//@ts-nocheck
import Shape from '../mixins/shape';
import Box from '../mixins/box';
import Utils from '../utils';
import svg from 'virtual-dom/virtual-hyperscript/svg';

var { assign } = Object;

class Image {
  constructor(url, x, y, width, height) {
    this.shape();
    this.box();
    this.state.url = url;
    this.state.x = x;
    this.state.y = y;
    this.state.width = width;
    this.state.height = height;
  }
  scale(scalar) {
    this.scaleBox(scalar);
    this.changed();
    return this;
  }
  copy(parent) {
    var copy = new Image();
    copy.state.url = this.state.url;
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }
  render(opts) {
    var attr = {
      'xlink:href': Utils.s(this.state.url),
      x: Utils.s(this.state.x),
      y: Utils.s(this.state.y)
    };
    if (this.state.width) attr.width = Utils.s(this.state.width);
    if (this.state.height) attr.height = Utils.s(this.state.height);
    this.shapeAttributes(attr);
    return svg('image', attr);
  }
}

assign(Image.prototype, Shape, Box, { type: 'image' });

export default Image;
