// @ts-nocheck

import Shape from '../mixins/shape';
import Styles from '../mixins/styles';
import Utils from '../utils';
import svg from 'virtual-dom/virtual-hyperscript/svg';

var { assign, keys } = Object;

var textStylesMap = {
  textAlign: 'text-align',
  fontFamily: 'font-family',
  fontStyle: 'font-style',
  fontWeight: 'font-weight',
  fontSize: 'font-size',
  letterSpacing: 'letter-spacing',
  textDecoration: 'text-decoration'
};
var textStylesKeys = keys(textStylesMap);

class Text {
  constructor(text, x, y) {
    this.shape();
    this.styles();
    this.state.text = text;
    this.state.x = x;
    this.state.y = y;
    this.state.fontSize = 16;
  }
  toPolygon() {
    throw new Error('You need the Rune.Font plugin to convert text to polygon');
  }
  copy(parent) {
    var copy = new Text();
    copy.state.text = this.state.text;
    for (var i = 0; i < textStylesKeys.length; i++) {
      copy.state[textStylesKeys[i]] = this.state[textStylesKeys[i]];
    }
    Utils.copyMixinVars(this, copy);
    Utils.groupLogic(copy, this.parent, parent);
    return copy;
  }
  scale(scalar) {
    this.scaleStyles(scalar);
    this.state.fontSize *= scalar;
    this.changed();
    return this;
  }
  render(opts) {
    var attr = {
      x: Utils.s(this.state.x),
      y: Utils.s(this.state.y)
    };
    this.shapeAttributes(attr);
    this.stylesAttributes(attr);

    for (var i = 0; i < textStylesKeys.length; i++) {
      if (this.state[textStylesKeys[i]]) {
        attr[textStylesMap[textStylesKeys[i]]] = Utils.s(
          this.state[textStylesKeys[i]]
        );
      }
    }

    // handle textalign conversion
    if (attr['text-align']) {
      var translate = { left: 'start', center: 'middle', right: 'end' };
      attr['text-anchor'] = translate[attr['text-align']];
    }

    return svg('text', attr, this.state.text);
  }
}

// Generate setters
for (var i = 0; i < textStylesKeys.length; i++) {
  Text.prototype[textStylesKeys[i]] = Utils.getSetter(textStylesKeys[i]);
}

assign(Text.prototype, Shape, Styles, { type: 'text' });

export default Text;
