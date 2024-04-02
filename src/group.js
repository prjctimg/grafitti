// @ts-nocheck
import Shape from './mixins/shape';
import Styles from './mixins/styles';
import Parent from './mixins/parent';
import { copyMixinVars, groupLogic } from './utils';
import svg from 'virtual-dom/virtual-hyperscript/svg';

var { assign } = Object;

class Group {
  constructor(x, y) {
    this.shape();
    this.setupParent();
    if (typeof x !== 'undefined') this.state.x = x;
    if (typeof y !== 'undefined') this.state.y = y;
  }
  add(child) {
    this.addChild(child);
  }
  remove(child) {
    this.removeChild(child);
  }
  copy(parent) {
    var copy = new Group();
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].copy(copy);
    }
    copyMixinVars(this, copy);
    groupLogic(copy, this.parent, parent);
    return copy;
  }
  scale(scalar) {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].state.x *= scalar;
      this.children[i].state.y *= scalar;
      this.children[i].scale(scalar);
    }
    return this;
  }
  render(opts) {
    if (!this.children || this.children.length == 0) return;
    var attr = this.shapeAttributes({});
    this.stylesAttributes(attr);
    return svg('g', attr, this.renderChildren(opts));
  }
}

assign(Group.prototype, Shape, Styles, Parent, { type: 'group' });

export default Group;
