// @ts-nocheck
import { color } from '../color';
import { s, getSetter } from '../utils';

var stylesMap = {
  strokeWidth: 'stroke-width',
  strokeCap: 'stroke-linecap',
  strokeJoin: 'stroke-linejoin',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeDash: 'stroke-dasharray',
  strokeDashOffset: 'stroke-dashoffset'
};
var styleKeys = Object.keys(stylesMap);

var Styles = {
  styles: function (copy) {
    this.state = this.state || {};
    this.state.fill = color(128).output();
    this.state.stroke = color(0).output();

    if (copy) {
      if (copy.state.fill === false || copy.state.fill === 'none') {
        this.state.fill = copy.state.fill;
      } else if (copy.state.fill) {
        this.state.fill = copy.state.fill.copy();
      }

      if (copy.state.stroke === false || copy.state.stroke === 'none') {
        this.state.stroke = false;
      } else if (copy.state.stroke) {
        this.state.stroke = copy.state.stroke.copy();
      }

      // Copy basic attributes
      for (var i = 0; i < styleKeys.length; i++) {
        if (copy.state[styleKeys[i]]) {
          this.state[styleKeys[i]] = copy.state[styleKeys[i]];
        }
      }
    }
  },

  fill: function (c) {
    if (c === false || c === 'none') this.state.fill = c;
    else this.state.fill = color(c).output();
    this.changed();
    return this;
  },

  stroke: function (c) {
    if (c === false || c === 'none') this.state.stroke = c;
    else this.state.stroke = color(c).output();
    this.changed();
    return this;
  },

  scaleStyles: function (scalar) {
    if (this.state.strokeWidth) {
      this.state.strokeWidth *= scalar;
    } else {
      this.state.strokeWidth = scalar;
    }
  },

  stylesAttributes: function (attr) {
    if (this.state.fill) {
      if (this.state.fill === 'none') {
        attr.fill = 'none';
      } else {
        attr.fill = color(this.state.fill).color2hex();

        var alpha = color(this.state.fill).alpha();
        if (alpha < 1) attr['fill-opacity'] = s(alpha);
      }
    }

    if (this.state.stroke) {
      if (this.state.stroke === 'none') {
        attr.stroke = 'none';
      } else {
        attr.stroke = color(this.state.stroke).color2hex();

        var alpha = color(this.state.stroke).alpha();
        if (alpha < 1) attr['stroke-opacity'] = s(alpha);
      }
    }

    for (var i = 0; i < styleKeys.length; i++) {
      if (this.state[styleKeys[i]]) {
        attr[stylesMap[styleKeys[i]]] = s(this.state[styleKeys[i]]);
      }
    }

    return attr;
  }
};

// Generate setters
for (var i = 0; i < styleKeys.length; i++) {
  Styles[styleKeys[i]] = getSetter(styleKeys[i]);
}

export default Styles;
