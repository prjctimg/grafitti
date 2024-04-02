import assign from 'object-assign';
import Vector from './vector';
import Anchor from './anchor';
import { Color } from './color';
import Group from './group';
import Grid from './grid';
import Node from './node';
import Utils, { s, isBrowser, groupLogic } from './utils';
import Events from './events';
import Circle from './shapes/circle';
import Ellipse from './shapes/ellipse';
import Line from './shapes/line';
import Triangle from './shapes/triangle';
import Path from './shapes/path';
import Polygon from './shapes/polygon';
import Rectangle from './shapes/rectangle';
import Text from './shapes/text';
import Image from './shapes/image';
import Box from './mixins/box';
import Shape from './mixins/shape';
import Styles from './mixins/styles';

import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';
import svg from 'virtual-dom/virtual-hyperscript/svg';

// Constructor
// --------------------------------------------------

class Grafitti {
  constructor(options) {
    var params = assign(
      {
        debug: false,
        frameRate: 60
      },
      options
    );

    var attrs = {
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink'
    };

    if (params.width) {
      attrs.width = s(params.width);
      this.width = params.width;
    }

    if (params.height) {
      attrs.height = s(params.height);
      this.height = params.height;
    }

    if (attrs.width && attrs.height) {
      attrs.viewBox = '0 0 ' + attrs.width + ' ' + attrs.height;
    }

    var props = {
      attributes: attrs
    };

    this.tree = svg('svg', props);
    this.el = createElement(this.tree);
    this.stage = new Group();
    this.debug = params.debug;
    this.frameCount = 1;
    this.frameRate = params.frameRate;

    if (params.container && isBrowser()) {
      if (typeof params.container === 'string') {
        params.container = document.querySelector(params.container);
      }

      if (params.container) {
        this.appendTo(params.container);
        var bounds = this.el.getBoundingClientRect();
        if (!this.width) {
          this.width = bounds.width;
          this.ignoreWidth = true;
        }
        if (!this.height) {
          this.height = bounds.height;
          this.ignoreHeight = true;
        }
      } else {
        console.error('Container element not found');
      }
    }

    // last resort to catch no dimensions
    if (!this.width) this.width = 640;
    if (!this.height) this.height = 480;

    this.initEvents();
  }
  // Helpers
  // --------------------------------------------------
  //
  handleSize() {}
  relativePos(pageX, pageY) {
    var bounds = this.el.getBoundingClientRect();
    var relX = pageX - window.scrollX - bounds.left;
    var relY = pageY - window.scrollY - bounds.top;
    return { x: relX, y: relY };
  }
  // Events
  // --------------------------------------------------
  initEvents() {
    // Specific browser events
    if (typeof window !== 'undefined') {
      this.initMouseEvents();
    }
  }
  initMouseEvents() {
    var mouseEvents = ['mousemove', 'mousedown', 'mouseup', 'click'];
    var that = this;
    for (var i = 0; i < mouseEvents.length; i++) {
      this.el.addEventListener(mouseEvents[i], function (e) {
        var rel = that.relativePos(e.pageX, e.pageY);
        that.trigger(mouseEvents[i], { x: rel.x, y: rel.y });
      });
    }
  }
  // Shape functions
  // --------------------------------------------------
  node(name, attr, children, parent) {
    var n = new Node(name, attr, children);
    groupLogic(n, this.stage, parent);
    return n;
  }
  group(x, y, parent) {
    var g = new Group(x, y);
    groupLogic(g, this.stage, parent);
    return g;
  }
  triangle(x, y, x2, y2, x3, y3, parent) {
    var t = new Triangle(x, y, x2, y2, x3, y3);
    groupLogic(t, this.stage, parent);
    return t;
  }
  rect(x, y, width, height, parent) {
    var r = new Rectangle(x, y, width, height);
    groupLogic(r, this.stage, parent);
    return r;
  }
  ellipse(x, y, width, height, parent) {
    var e = new Ellipse(x, y, width, height);
    groupLogic(e, this.stage, parent);
    return e;
  }
  circle(x, y, radius, parent) {
    var c = new Circle(x, y, radius, parent);
    groupLogic(c, this.stage, parent);
    return c;
  }
  line(x1, y1, x2, y2, parent) {
    var l = new Line(x1, y1, x2, y2);
    groupLogic(l, this.stage, parent);
    return l;
  }
  polygon(x, y, parent) {
    var p = new Polygon(x, y);
    groupLogic(p, this.stage, parent);
    return p;
  }
  path(x, y, parent) {
    var p = new Path(x, y);
    groupLogic(p, this.stage, parent);
    return p;
  }
  text(textString, x, y, parent) {
    var t = new Text(textString, x, y);
    groupLogic(t, this.stage, parent);
    return t;
  }
  image(url, x, y, width, height, parent) {
    var i = new Image(url, x, y, width, height);
    groupLogic(i, this.stage, parent);
    return i;
  }
  grid(options, parent) {
    var g = new Grid(options);
    groupLogic(g, this.stage, parent);
    return g;
  }
  // Playhead
  // --------------------------------------------------
  // This function is a proxy function that is run on every frame
  // It has a check that delays the frame with a setTimeout if
  // the framerate is lower than 60 fps.
  play() {
    if (this.pauseNext) {
      this.pauseNext = false;
      return;
    }

    if (this.frameRate >= 60) {
      this.playNow();
    } else {
      var that = this;
      setTimeout(function () {
        that.playNow();
      }, 1000 / this.frameRate);
    }
  }
  playNow() {
    var that = this;
    this.trigger('update', { frameCount: this.frameCount });
    this.animationFrame = requestAnimationFrame(function () {
      that.play();
    });
    this.draw();
  }
  pause() {
    this.pauseNext = true;
  }
  // Render functions
  // --------------------------------------------------
  appendTo(container) {
    container.appendChild(this.el);
    return this;
  }
  draw() {
    var attrs = {
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink'
    };

    if (!this.ignoreWidth) attrs.width = s(this.width);
    if (!this.ignoreHeight) attrs.height = s(this.height);

    var props = {
      attributes: attrs
    };

    var newTree = svg('svg', props, [
      this.stage.renderChildren({ debug: this.debug })
    ]);
    var diffTree = diff(this.tree, newTree);
    this.el = patch(this.el, diffTree);
    this.tree = newTree;

    this.frameCount += 1;
  }
}

assign(Grafitti, Utils);
assign(Grafitti.prototype, Utils);
assign(Grafitti.prototype, Events);

Grafitti.Vector = Vector;
Grafitti.Anchor = Anchor;
Grafitti.Color = Color;
Grafitti.Group = Group;
Grafitti.Node = Node;
Grafitti.Grid = Grid;
Grafitti.Circle = Circle;
Grafitti.Ellipse = Ellipse;
Grafitti.Line = Line;
Grafitti.Triangle = Triangle;
Grafitti.Path = Path;
Grafitti.Polygon = Polygon;
Grafitti.Rectangle = Rectangle;
Grafitti.Text = Text;
Grafitti.Image = Image;

// Right now I need these for mixin tests.
// Rewrite so we don't need them.
Grafitti.Shape = Shape;
Grafitti.Styles = Styles;
Grafitti.Box = Box;

export default Grafitti;
