// @ts-nocheck
import Shape from './mixins/shape';
import svg from 'virtual-dom/virtual-hyperscript/svg';

// This Node class allows developers to inject random SVG nodes into
// the scene graph if Rune.js does not support what they are trying to do.

var { assign } = Object;
var Node = function (name, attr, children) {
  this.shape();
  this.state.name = name;
  this.state.attr = attr;
  this.state.children = children;
};

Node.prototype = {
  render: function (opts) {
    return svg(this.state.name, this.state.attr, this.state.children);
  }
};

assign(Node.prototype, Shape, { type: 'node' });

export default Node;
