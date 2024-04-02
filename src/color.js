export * from 'huetiful-js';

// Color.prototype = {
//   level: function (color2) {
//     var contrastRatio = this.contrast(color2);
//     return contrastRatio >= 7.1 ? 'AAA' : contrastRatio >= 4.5 ? 'AA' : '';
//   },

//   dark: function () {
//     // YIQ equation from http://24ways.org/2010/calculating-color-contrast
//     var rgb = this.values.rgb,
//       yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
//     return yiq < 128;
//   },

//   light: function () {
//     return !this.dark();
//   },

//   copy: function () {
//     return new Color().rgb(this.rgb());
//   }
// };
