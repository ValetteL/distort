/*
 ______  _____ _______ _______  _____   ______ _______
 |     \   |   |______    |    |     | |_____/    |
 |_____/ __|__ ______|    |    |_____| |    \_    |

 https://github.com/isuttell/distort
 Contributor(s): Isaac Suttell <isaac@isaacsuttell.com>
 */

(function(root, factory) {
  'use strict';
  /* istanbul ignore next */
  if (typeof define === 'function' && typeof define.amd === 'object') {
    define([], function() {
      return factory(root);
    });
  } else {
    root.Distort = factory(root);
  }
})(this, function() {
  'use strict';

  /**
   * matrix3d() Quick Notes
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function
   *
   * *
   *
   * matrix3d(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4)
   *
   * a1 b1 c1 d1 a2 b2 c2 d2 a3 b3 c3 d3 d4
   * Are <number> describing the linear transformation.
   *
   * a4 b4 c4
   * Are <length> describing the translation to apply.
   */

  /**
   * Default Matrix with no distortions
   *
   * @constant
   * @type    {String}
   */
  var BASE_MATRIX = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  /**
   * Generates a matrix3d string to to  be used with CSS3 based on four coordinates
   *
   * @constructor
   * @param   {Object}   [options]   config object
   */
  function Distort(options) {
    options = options || {};

    // Set width height of the matrix
    this.width = options.width;
    this.height = options.height;

    // If $el is a jQuery element pull the height/width directly from it
    if (options.$el && options.$el instanceof window.$) {
      this.$el = options.$el;
      this.width = this.$el.width();
      this.height = this.$el.height();
    }

    // Setup Transform Origin
    options.offset = options.offset || {};
    this.setOffset(options.offset);

    // Set starting matrix
    this.matrix = BASE_MATRIX;

    // Define Default Starting Points
    this.topLeft = {
      x: 0,
      y: 0
    };
    this.topRight = {
      x: this.width,
      y: 0
    };
    this.bottomLeft = {
      x: 0,
      y: this.height
    };
    this.bottomRight = {
      x: this.width,
      y: this.height
    };

    // Save the pixel ratio for later
    this.dpr = window.devicePixelRatio || false;

    // Update the starting matrix
    this.update();
  }

  /**
   * Calculate the transform origin. Accepts px, % or defaults to cetner
   *
   * @param     {Object}    offset    {x: String, y: String}
   *
   * @return    {Object}
   */
  Distort.prototype.setOffset = function(offset) {
    offset.x = offset.x ? offset.x.toString() : '';
    offset.y = offset.y ? offset.y.toString() : '';

    // Configure x offset
    if (offset.x.indexOf('%') > -1) {
      // Percentage
      offset.x = -parseFloat(offset.x) * this.width / 100;
    } else if (offset.x.indexOf('px') > -1) {
      // Pixels
      offset.x = -parseFloat(offset.x);
    } else {
      // Default
      offset.x = this.width * -0.5;
    }

    // Configure y offset
    if (offset.y.indexOf('%') > -1) {
      // Percentage
      offset.y = -parseFloat(offset.y) * this.height / 100;
    } else if (offset.y.indexOf('px') > -1) {
      // Pioffset.yels
      offset.y = -parseFloat(offset.y);
    } else {
      // Default
      offset.y = this.height * -0.5;
    }

    // Save it
    this.offset = offset;

    return offset;
  };

  /**
   * Calculate the matrix depending upon what the current coordinates are
   *
   * @return    {String}
   */
  Distort.prototype.calculate = function() {
    // Reset valid check
    this.isValid = false;

    var aM = [
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0]
    ];
    var bM = [0, 0, 0, 0, 0, 0, 0, 0];

    var kmax;
    var sum;
    var row;
    var col = [];
    var i;
    var j;
    var k;
    var p;
    var tmp;

    //  MAGIC
    var dst = [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight];
    var arr = [0, 1, 2, 3, 4, 5, 6, 7];
    for (i = 0; i < 4; i++) {
      aM[i][0] = aM[i + 4][3] = i & 1 ? this.width + this.offset.x : this.offset.x;
      aM[i][1] = aM[i + 4][4] = (i > 1 ? this.height + this.offset.y : this.offset.y);
      aM[i][6] = (i & 1 ? -this.offset.x - this.width : -this.offset.x) * (dst[i].x + this.offset.x);
      aM[i][7] = (i > 1 ? -this.offset.y - this.height : -this.offset.y) * (dst[i].x + this.offset.x);
      aM[i + 4][6] = (i & 1 ? -this.offset.x - this.width : -this.offset.x) * (dst[i].y + this.offset.y);
      aM[i + 4][7] = (i > 1 ? -this.offset.y - this.height : -this.offset.y) * (dst[i].y + this.offset.y);
      bM[i] = (dst[i].x + this.offset.x);
      bM[i + 4] = (dst[i].y + this.offset.y);
      aM[i][2] = aM[i + 4][5] = 1;
      aM[i][3] = aM[i][4] = aM[i][5] = aM[i + 4][0] = aM[i + 4][1] = aM[i + 4][2] = 0;
    }

    for (j = 0; j < 8; j++) {
      for (i = 0; i < 8; i++) {
        col[i] = aM[i][j];
      }
      for (i = 0; i < 8; i++) {
        row = aM[i];
        kmax = i < j ? i : j;
        sum = 0.0;
        for (k = 0; k < kmax; k++) {
          sum += row[k] * col[k];
        }
        row[j] = col[i] -= sum;
      }
      p = j;
      for (i = j + 1; i < 8; i++) {
        if (Math.abs(col[i]) > Math.abs(col[p])) {
          p = i;
        }
      }
      if (p !== j) {
        for (k = 0; k < 8; k++) {
          tmp = aM[p][k];
          aM[p][k] = aM[j][k];
          aM[j][k] = tmp;
        }
        tmp = arr[p];
        arr[p] = arr[j];
        arr[j] = tmp;
      }
      if (aM[j][j] !== 0) {
        for (i = j + 1; i < 8; i++) {
          aM[i][j] /= aM[j][j];
        }
      }
    }
    for (i = 0; i < 8; i++) {
      arr[i] = bM[arr[i]];
    }
    for (k = 0; k < 8; k++) {
      for (i = k + 1; i < 8; i++) {
        arr[i] -= arr[k] * aM[i][k];
      }
    }
    for (k = 7; k > -1; k--) {
      arr[k] /= aM[k][k];
      for (i = 0; i < k; i++) {
        arr[i] -= arr[k] * aM[i][k];
      }
    }

    // Save the values of the matrix for later
    this.matrix[0] = arr[0].toFixed(9);
    this.matrix[1] = arr[3].toFixed(9);
    this.matrix[2] = 0;
    this.matrix[3] = arr[6].toFixed(9);
    this.matrix[4] = arr[1].toFixed(9);
    this.matrix[5] = arr[4].toFixed(9);
    this.matrix[6] = 0;
    this.matrix[7] = arr[7].toFixed(9);
    this.matrix[8] = 0;
    this.matrix[9] = 0;
    this.matrix[10] = 1;
    this.matrix[11] = 0;
    this.matrix[12] = arr[2].toFixed(9);
    this.matrix[13] = arr[5].toFixed(9);
    this.matrix[14] = 0;
    this.matrix[15] = 1;

    // Strip Trailing Zeros
    this.matrix = stripTrailingZeros.call(this, this.matrix);

    return this.matrix;
  };

  /**
   * Removes the trailing zeros from each matrix value
   *
   * @param  {Array}   matrix   matrix to clean up
   *
   * @return {String}
   */
  function stripTrailingZeros(matrix) {
    var index = -1;
    while (++index < 16) {
      matrix[index] = parseFloat(matrix[index]);
    }
    return matrix;
  }

  /**
   * Create CSS style string
   *
   * @param    {Array}   matrix   matrix values
   *
   * @return   {String}
   */
  function constructMatrix3d(matrix) {
    var style;
    style = 'matrix3d(';
    style += matrix.join(', ');
    style += ')';

    return style;
  }

  /**
   * Check to see if any value cominbations are bad
   *
   * @return    {Boolean}
   */
  Distort.prototype.hasDistancesError = function() {
    var lenX;
    var lenY;

    lenX = this.topLeft.x - this.topRight.x;
    lenY = this.topLeft.y - this.topRight.y;
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) {
      return true;
    }

    lenX = this.bottomLeft.x - this.bottomRight.x;
    lenY = this.bottomLeft.y - this.bottomRight.y;
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) {
      return true;
    }

    lenX = this.topLeft.x - this.bottomLeft.x;
    lenY = this.topLeft.y - this.bottomLeft.y;
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) {
      return true;
    }

    lenX = this.topRight.x - this.bottomRight.x;
    lenY = this.topRight.y - this.bottomRight.y;
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) {
      return true;
    }

    lenX = this.topLeft.x - this.bottomRight.x;
    lenY = this.topLeft.y - this.bottomRight.y;
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) {
      return true;
    }

    lenX = this.topRight.x - this.bottomLeft.x;
    lenY = this.topRight.y - this.bottomLeft.y;
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) {
      return true;
    }

    return false;
  };

  /**
   * Get determinant of given 3 points
   *
   * @param     {Object}    p0    {x: Number, y: Number}
   * @param     {Object}    p1    {x: Number, y: Number}
   * @param     {Object}    p2    {x: Number, y: Number}
   *
   * @return    {Number}
   */
  function getDeterminant(p0, p1, p2) {
    return p0.x * p1.y + p1.x * p2.y + p2.x * p0.y - p0.y * p1.x - p1.y * p2.x - p2.y * p0.x;
  }

  /**
   * Checks to see if it is a concave polygone
   *
   * @return    {Boolean}
   */
  Distort.prototype.hasPolygonError = function() {
    var det1;
    var det2;

    det1 = getDeterminant(this.topLeft, this.topRight, this.bottomRight);
    det2 = getDeterminant(this.bottomRight, this.bottomLeft, this.topLeft);
    if (det1 <= 0 || det2 <= 0) {
      return true;
    }

    det1 = getDeterminant(this.topRight, this.bottomRight, this.bottomLeft);
    det2 = getDeterminant(this.bottomLeft, this.topLeft, this.topRight);
    if (det1 <= 0 || det2 <= 0) {
      return true;
    }

    return false;
  };

  /**
   * Run various error checks
   *
   * @return    {Boolean}
   */
  Distort.prototype.hasErrors = function() {
    if (this.hasDistancesError()) {
      return 1;
    }
    if (this.hasPolygonError()) {
      return 2;
    }
    return 0; // Falsy
  };

  /**
   * Calculates the current matrix and returns it
   *
   * @return    {String}
   */
  Distort.prototype.update = function() {
    // Calculate the matrix
    this.calculate();

      // Check to see if there are any errors and reset the matrix if so
    if (this.hasErrors()) {
      this.isValid = false;
      this.style = constructMatrix3d.call(this, BASE_MATRIX);
      return this.style;
    }

    this.isValid = true;

    // Construct the string
    this.style = constructMatrix3d.call(this, this.matrix);

    // A fix for firefox on retina display
    if (this.dprFix) {
      this.style += ' scale(' + this.dpr + ', ' + this.dpr + ') ';
      this.style += 'perspective(1000px) ';
      this.style += 'translateZ(' + ((1 - this.dpr) * 1000) + 'px)';
    }

    return this.style;
  };

  /**
   * This is an alias to update
   *
   * @alias update
   */
  Distort.prototype.toString = Distort.prototype.update;

  /**
   * Compares to Distorts together
   *
   * @param     {Distory}    matrix    Distory to compare
   *
   * @return    {Boolean}
   */
  Distort.prototype.equals = function(matrix) {
    return this.toString() === matrix.toString();
  };

    /**
   * Checks to see if a var is a function or object
   *
   * @param  {Mixed}  obj  var to check
   *
   * @return {Boolean}
   */
  var isObject = function(obj) {
    var result = {}.toString.call(obj);
    return result === '[object Object]';
  };

  /**
   * Basic Recursive Extend Function
   *
   * @param     {Object}    dest   object to fill
   * @param     {Object}    src    object to copy
   *
   * @return    {Object}
   */
  function extend(dest, src) {
    for (var i in src) {
      if (isObject(src[i]) && i !== '$el') {
        dest[i] = extend({}, src[i]);
      } else {
        dest[i] = src[i];
      }
    }
    return dest;
  }

  /**
   * Clones the current instance
   *
   * @return    {Distort}
   */
  Distort.prototype.clone = function() {
    return extend(new Distort(), this);
  };

  /**
   * Translate a matrix by x and y
   *
   * @param     {Number}    x    Amount to change
   * @param     {Number}    y    Amount to change
   */
  Distort.prototype.translate = function(x, y) {
    this.topLeft.x += x;
    this.topRight.x += x;
    this.bottomLeft.x += x;
    this.bottomRight.x += x;

    this.topLeft.y += y;
    this.topRight.y += y;
    this.bottomLeft.y += y;
    this.bottomRight.y += y;

    return this;
  };

  /**
   * Translate a matrix on the x axis
   *
   * @param     {Number}    x    Amount to change
   */
  Distort.prototype.translateX = function(x) {
    this.translate(x, 0);

    return this;
  };

  /**
   * Translate a matrix on the y axis
   *
   * @param     {Number}    y    Amount to change
   */
  Distort.prototype.translateY = function(y) {
    this.translate(0, y);

    return this;
  };

  /**
   * Increase the scale of the matrix from the center
   *
   * @param     {Number}    factor    Amount to scale
   */
  Distort.prototype.scale = function(factor) {
    // Move it so the center of the matrix is at 0, 0
    this.translate(-this.width / 2, -this.height / 2);

    this.topLeft.x *= factor;
    this.topRight.x *= factor;
    this.bottomLeft.x *= factor;
    this.bottomRight.x *= factor;

    this.topLeft.y *= factor;
    this.topRight.y *= factor;
    this.bottomLeft.y *= factor;
    this.bottomRight.y *= factor;

    // Move it it back to it's original position
    this.translate(this.width / 2, this.height / 2);

    return this;
  };

  /**
   * Faux Perspective Transform
   *
   * @param     {String}    direction    ['top', 'left', 'bottom', 'right']
   * @param     {Number}    value        Amount to change
   */
  Distort.prototype.forcePerspective = function(direction, value) {
    if (direction === 'top') {
      this.topLeft.x -= value;
      this.topRight.x += value;
    } else if (direction === 'left') {
      this.topLeft.y -= value;
      this.bottomLeft.y += value;
    } else if (direction === 'bottom') {
      this.bottomLeft.x -= value;
      this.bottomRight.x += value;
    } else if (direction === 'right') {
      this.topRight.y -= value;
      this.bottomRight.y += value;
    } else {
      throw new Error('Invalid Perspective Direction');
    }

    return this;
  };

  return Distort;
});
