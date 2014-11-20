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
   * Default Matrix with no distortions
   *
   * @type    {String}
   */
  var RESET_MATRIX = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';

  /**
   * Generates a matrix3d string to to  be used with CSS3 based on four coordinates
   *
   * @constructor
   * @param   {Object}   [options]   config object
   */
  function Distort(options) {

    // Set width height of the matrix
    this.width = options.width;
    this.height = options.height;

    // If $el is a jQuery element pull the height/width directly from it
    if (options.$el && options.$el instanceof window.$) {
      this.width = options.$el.width();
      this.height = options.$el.height();
    }

    // Setup Transform Origin
    options.offset = options.offset || {};
    this.offset.x = options.offset.x || this.width * -0.5;
    this.offset.y = options.offset.y || this.height * -0.5;

    // Define Starting Points
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

    // Calculate the matrix
    this.style = this.calculate();
  }

  /**
   * By default a matrix is not valid until it has be calculated
   *
   * @type    {Boolean}
   */
  Distort.prototype.isValid = false;

  /**
   * Transform Origin
   *
   * @type    {Object}
   */
  Distort.prototype.offset = {
    x: 0,
    y: 0
  };

  /**
   * Default values for top left corner
   *
   * @type    {Object}
   */
  Distort.prototype.topLeft = {
    x: 0,
    y: 0
  };

  /**
   * Default values for top right corner
   *
   * @type    {Object}
   */
  Distort.prototype.topRight = {
    x: 0,
    y: 0
  };

  /**
   * Default values for bottom left corner
   *
   * @type    {Object}
   */
  Distort.prototype.bottomLeft = {
    x: 0,
    y: 0
  };

  /**
   * Default values for bottom right corner
   *
   * @type    {Object}
   */
  Distort.prototype.bottomRight = {
    x: 0,
    y: 0
  };

  /**
   * Calculate the matrix depending upon what the current coordinates are
   *
   * @return    {String}
   */
  Distort.prototype.calculate = function() {
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

    // Check to see if there are any errors and reset the matrix if so
    if (this.hasErrors()) {
      this.isValid = false;
      this.style = RESET_MATRIX;
      return this.style;
    }

    this.isValid = true;

    // Construct the string
    this.style = 'matrix3d(' + parseFloat(arr[0].toFixed(9)) + ', ';
    this.style += parseFloat(arr[3].toFixed(9)) + ', ';
    this.style += '0, ';
    this.style += parseFloat(arr[6].toFixed(9)) + ', ';
    this.style += parseFloat(arr[1].toFixed(9)) + ', ';
    this.style += parseFloat(arr[4].toFixed(9)) + ', ';
    this.style += '0, ';
    this.style += parseFloat(arr[7].toFixed(9)) + ', ';
    this.style += '0, ';
    this.style += '0, ';
    this.style += '1, ';
    this.style += '0, ';
    this.style += parseFloat(arr[2].toFixed(9)) + ', ';
    this.style += parseFloat(arr[5].toFixed(9)) + ', 0, 1)';

    // A fix for firefox on retina display
    if (this.dprFix) {
      this.style += ' scale(' + this.dpr + ', ' + this.dpr + ') ';
      this.style += 'perspective(1000px) ';
      this.style += 'translateZ(' + ((1 - this.dpr) * 1000) + 'px)';
    }

    return this.style;
  };

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
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) { return true; }

    lenX = this.bottomLeft.x - this.bottomRight.x;
    lenY = this.bottomLeft.y - this.bottomRight.y;
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) { return true; }

    lenX = this.topLeft.x - this.bottomLeft.x;
    lenY = this.topLeft.y - this.bottomLeft.y;
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) { return true; }

    lenX = this.topRight.x - this.bottomRight.x;
    lenY = this.topRight.y - this.bottomRight.y;
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) { return true; }

    lenX = this.topLeft.x - this.bottomRight.x;
    lenY = this.topLeft.y - this.bottomRight.y;
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) { return true; }

    lenX = this.topRight.x - this.bottomLeft.x;
    lenY = this.topRight.y - this.bottomLeft.y;
    if (Math.sqrt(lenX * lenX + lenY * lenY) <= 1) { return true; }

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
    if (det1 <= 0 || det2 <= 0) { return true; }

    det1 = getDeterminant(this.topRight, this.bottomRight, this.bottomLeft);
    det2 = getDeterminant(this.bottomLeft, this.topLeft, this.topRight);
    if (det1 <= 0 || det2 <= 0) { return true; }

    return false;
  };

  /**
   * Run various error checks
   *
   * @return    {Boolean}
   */
  Distort.prototype.hasErrors = function() {
    if (this.hasDistancesError()) { return 1; }
    if (this.hasPolygonError()) { return 2; }
    return 0; // Falsy
  };

  /**
   * Calculates the current matrix and returns it
   *
   * @return    {String}
   */
  Distort.prototype.update = function() {
    return this.calculate();
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

  return Distort;
});
