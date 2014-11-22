describe('Distort.js', function() {
  var RESET_MATRIX = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';

  var distort;
  beforeEach(function() {
    distort = new Distort({
      width: 100,
      height: 100
    });
  });

  it('should be a function', function() {
    expect(Distort).toBeDefined();
    expect(typeof Distort).toBe('function');
  });

  it('should have `update` and `toString` methods that are the same', function() {
    expect(distort.toString).toBe(distort.update);
  });

  it('should have a `toString` method which returns a matrix', function() {
    expect(typeof distort.toString).toBe('function');
    expect(distort.toString()).toBe(RESET_MATRIX);
  });

  it('should have a `style` property which contains a matrix', function() {
    expect(typeof distort.style).toBe('string');
    expect(distort.style).toBe(RESET_MATRIX);
  });


  it('should have an `isValid` property which checks if the matrix is valid', function() {
    expect(typeof distort.isValid).toBe('boolean');
    expect(distort.isValid).toBe(true);
    distort.topLeft.x = 0;
    distort.topLeft.y = 0;
    distort.topRight.x = 0;
    distort.topRight.y = 0;
    distort.update();
    expect(distort.isValid).toBe(false);
  });

  it('should create a valid matrix3d string', function() {
    var matrix3d = /matrix3d\((\s?\d,){15}\s?\d\)/;
    expect(distort.style).toMatch(matrix3d);
  });

  it('should start with no tranformations', function() {
    expect(distort.toString()).toEqual(RESET_MATRIX);
  });

  it('should get the width/height from a jQuery element', function() {
    var $el = $('<div style="width: 100px; height: 100px"></div>');
    var distortEl = new Distort({
      $el: $el
    });

    expect(distortEl.height).toEqual(100);
    expect(distortEl.width).toEqual(100);
  });

  it('should be able to `clone` itself', function() {
    var original = new Distort({
      width: 100,
      height: 100
    });
    original.topLeft.x = 10;

    // Magic
    var cloned = original.clone();

    // Make sure it is equal
    expect(cloned.equals(original)).toBe(true);

    // Update clone
    cloned.topLeft.x = 100;
    expect(cloned.topLeft.x).toBe(100);
    expect(cloned.equals(original)).toBe(false);

    // Did we change the original?
    expect(original.topLeft.x).toBe(10);

    // Did we lose the original properties?
    expect(cloned.width).toEqual(original.width);
    expect(cloned.height).toEqual(original.height);
    expect(cloned.offset).toEqual(original.offset);
  });

  it('should have four points with x, y coordinates', function() {
    expect(typeof distort.topLeft).toBe('object');
    expect(typeof distort.topLeft.y).toBe('number');
    expect(typeof distort.topLeft.x).toBe('number');
    expect(typeof distort.topRight).toBe('object');
    expect(typeof distort.topRight.y).toBe('number');
    expect(typeof distort.topRight.x).toBe('number');
    expect(typeof distort.bottomLeft).toBe('object');
    expect(typeof distort.bottomLeft.y).toBe('number');
    expect(typeof distort.bottomLeft.x).toBe('number');
    expect(typeof distort.bottomRight).toBe('object');
    expect(typeof distort.bottomRight.y).toBe('number');
    expect(typeof distort.bottomRight.x).toBe('number');
  });


  it('should detect if it `equals` another matrix', function() {
    var distort1 = new Distort({
      width: 100,
      height: 100
    });

    var distort2 = new Distort({
      width: 100,
      height: 100
    });

    expect(distort1.equals(distort2)).toBe(true);

    distort2.bottomRight.x += 10;

    expect(distort1.equals(distort2)).toBe(false);
  });


  describe('Distorts', function() {
    it('should move the topLeft corner 10 pixels up and over', function() {
      distort.topLeft.x -= 10;
      distort.topLeft.y += 10;
      expect(distort.toString()).toEqual('matrix3d(1.05, -0.05, 0, -0.001, 0.05, 0.95, 0, 0.001, 0, 0, 1, 0, -5, 5, 0, 1)');
    });

    it('should move the topRight corner 10 pixels up and over', function() {
      distort.topRight.x += 10;
      distort.topRight.y += 10;
      expect(distort.toString()).toEqual('matrix3d(1.05, 0.05, 0, 0.001, -0.05, 0.95, 0, 0.001, 0, 0, 1, 0, 5, 5, 0, 1)');
    });

    it('should move the bottomRight corner 10 pixels down and over', function() {
      distort.bottomRight.x += 10;
      distort.bottomRight.y -= 10;
      expect(distort.toString()).toEqual('matrix3d(1.05, -0.05, 0, 0.001, 0.05, 0.95, 0, -0.001, 0, 0, 1, 0, 5, -5, 0, 1)');
    });

    it('should move the bottomLeft corner 10 pixels down and over', function() {
      distort.bottomLeft.x -= 10;
      distort.bottomLeft.y -= 10;
      expect(distort.toString()).toEqual('matrix3d(1.05, 0.05, 0, -0.001, -0.05, 0.95, 0, -0.001, 0, 0, 1, 0, -5, -5, 0, 1)');
    });
  });

  describe('Offset (transform-origin)', function() {
    it('should by default set the offset to center', function() {
      expect(distort.offset.x).toBe(-50);
      expect(distort.offset.y).toBe(-50);
    });

    it('should accept pixels', function() {
      var distortOffset = new Distort({
        width: 100,
        height: 100,
        offset: {
          x: '0px',
          y: '0px'
        }
      });
      expect(distortOffset.offset.x).toBe(0);
      expect(distortOffset.offset.y).toBe(0);
    });

    it('should accept percent', function() {
      var distortOffset = new Distort({
        width: 100,
        height: 100,
        offset: {
          x: '75%',
          y: '75%'
        }
      });
      expect(distortOffset.offset.x).toBe(-75);
      expect(distortOffset.offset.y).toBe(-75);
    });
  });

  describe('Helper Transforms', function() {

    describe('`translate`', function() {
      it('should move by both x and y', function() {
        distort.translate(10, 10);
        expect(distort.topLeft.x).toEqual(10);
        expect(distort.topRight.x).toEqual(110);
        expect(distort.bottomLeft.x).toEqual(10);
        expect(distort.bottomRight.x).toEqual(110);

        expect(distort.topLeft.y).toEqual(10);
        expect(distort.topRight.y).toEqual(10);
        expect(distort.bottomLeft.y).toEqual(110);
        expect(distort.bottomRight.y).toEqual(110);
      });

      it('should be chainable', function() {
        expect(distort.translate(0, 0)).toBe(distort);
      });
    });

    describe('`translateX`', function() {
      it('should move just the x axis', function() {
        distort.translateX(10);
        expect(distort.topLeft.x).toEqual(10);
        expect(distort.topRight.x).toEqual(110);
        expect(distort.bottomLeft.x).toEqual(10);
        expect(distort.bottomRight.x).toEqual(110);

        expect(distort.topLeft.y).toEqual(0);
        expect(distort.topRight.y).toEqual(0);
        expect(distort.bottomLeft.y).toEqual(100);
        expect(distort.bottomRight.y).toEqual(100);
      });

      it('should be chainable', function() {
        expect(distort.translateX(0)).toBe(distort);
      });
    });

    describe('`translateY`', function() {
      it('should move just the y axis', function() {
        distort.translateY(10);
        expect(distort.topLeft.x).toEqual(0);
        expect(distort.topRight.x).toEqual(100);
        expect(distort.bottomLeft.x).toEqual(0);
        expect(distort.bottomRight.x).toEqual(100);

        expect(distort.topLeft.y).toEqual(10);
        expect(distort.topRight.y).toEqual(10);
        expect(distort.bottomLeft.y).toEqual(110);
        expect(distort.bottomRight.y).toEqual(110);
      });

      it('should be chainable', function() {
        expect(distort.translateY(0)).toBe(distort);
      });
    });

    describe('`scale`', function() {
      it('should change the scale', function() {
        distort.scale(1.2);
        expect(distort.topLeft.x).toBeCloseTo(-10);
        expect(distort.topRight.x).toBeCloseTo(110);
        expect(distort.bottomLeft.x).toBeCloseTo(-10);
        expect(distort.bottomRight.x).toBeCloseTo(110);

        expect(distort.topLeft.y).toBeCloseTo(-10);
        expect(distort.topRight.y).toBeCloseTo(-10);
        expect(distort.bottomLeft.y).toBeCloseTo(110);
        expect(distort.bottomRight.y).toBeCloseTo(110);
      });

      it('should be chainable', function() {
        expect(distort.scale(1)).toBe(distort);
      });
    });

    describe('`forcePerspective`', function() {
      it('should fake perspective to the left', function() {
        distort.forcePerspective('top', 10);
        expect(distort.topLeft.x).toEqual(-10);
        expect(distort.topRight.x).toEqual(110);
        expect(distort.bottomLeft.x).toEqual(0);
        expect(distort.bottomRight.x).toEqual(100);

        expect(distort.topLeft.y).toEqual(0);
        expect(distort.topRight.y).toEqual(0);
        expect(distort.bottomLeft.y).toEqual(100);
        expect(distort.bottomRight.y).toEqual(100);
      });

      it('should fake perspective to the top', function() {
        distort.forcePerspective('left', 10);
        expect(distort.topLeft.x).toEqual(0);
        expect(distort.topRight.x).toEqual(100);
        expect(distort.bottomLeft.x).toEqual(0);
        expect(distort.bottomRight.x).toEqual(100);

        expect(distort.topLeft.y).toEqual(-10);
        expect(distort.topRight.y).toEqual(0);
        expect(distort.bottomLeft.y).toEqual(110);
        expect(distort.bottomRight.y).toEqual(100);
      });

      it('should fake perspective to the bottom', function() {
        distort.forcePerspective('bottom', 10);
        expect(distort.topLeft.x).toEqual(0);
        expect(distort.topRight.x).toEqual(100);
        expect(distort.bottomLeft.x).toEqual(-10);
        expect(distort.bottomRight.x).toEqual(110);

        expect(distort.topLeft.y).toEqual(0);
        expect(distort.topRight.y).toEqual(0);
        expect(distort.bottomLeft.y).toEqual(100);
        expect(distort.bottomRight.y).toEqual(100);
      });

      it('should fake perspective to the right', function() {
        distort.forcePerspective('right', 10);
        expect(distort.topLeft.x).toEqual(0);
        expect(distort.topRight.x).toEqual(100);
        expect(distort.bottomLeft.x).toEqual(0);
        expect(distort.bottomRight.x).toEqual(100);

        expect(distort.topLeft.y).toEqual(0);
        expect(distort.topRight.y).toEqual(-10);
        expect(distort.bottomLeft.y).toEqual(100);
        expect(distort.bottomRight.y).toEqual(110);
      });

      it('should throw an error on the wrong direction', function() {
        expect(function() {
          distort.forcePerspective('bad', 10);
        }).toThrow(new Error('Invalid Perspective Direction'));
      });

      it('should be chainable', function() {
        expect(distort.forcePerspective('left', 0)).toBe(distort);
      });
    });
  });

  describe('Errors', function() {
    describe('Distance', function() {
      it('should compared topLeft to topRight', function() {
        distort.topLeft.x = 0;
        distort.topLeft.y = 0;
        distort.topRight.x = 0;
        distort.topRight.y = 0;
        distort.update();
        expect(distort.isValid).toBe(false);
      });

      it('should compared bottomLeft to bottomRight', function() {
        distort.bottomLeft.x = 0;
        distort.bottomLeft.y = 0;
        distort.bottomRight.x = 0;
        distort.bottomRight.y = 0;
        distort.update();
        expect(distort.isValid).toBe(false);
      });

      it('should compared topLeft to bottomRight', function() {
        distort.topLeft.x = 0;
        distort.topLeft.y = 0;
        distort.bottomRight.x = 0;
        distort.bottomRight.y = 0;
        distort.update();
        expect(distort.isValid).toBe(false);
      });

      it('should compared topLeft to bottomLeft', function() {
        distort.topLeft.x = 0;
        distort.topLeft.y = 0;
        distort.bottomLeft.x = 0;
        distort.bottomLeft.y = 0;
        distort.update();
        expect(distort.isValid).toBe(false);
      });

      it('should compared topRight to bottomRight', function() {
        distort.topRight.x = 100;
        distort.topRight.y = 100;
        distort.bottomRight.x = 100;
        distort.bottomRight.y = 100;
        distort.update();
        expect(distort.isValid).toBe(false);
      });

      it('should compared topRight to bottomLeft', function() {
        distort.topRight.x = -100;
        distort.topRight.y = -100;
        distort.bottomLeft.x = -100;
        distort.bottomLeft.y = -100;
        distort.update();
        expect(distort.isValid).toBe(false);
      });
    });

    describe('Polygon', function() {
      it('should check if the element is concave', function() {
        distort.bottomRight.x = -100;
        distort.bottomRight.y = -100;
        distort.update();
        expect(distort.isValid).toBe(false);
      });
    });
  });

  describe('DPR Fix', function() {
    it('should apply addition transforms for firefox', function() {
      distort.dprFix = true;
      distort.dpr = 3;
      expect(distort.toString()).toEqual('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) scale(3, 3) perspective(1000px) translateZ(-2000px)');
    });
  });
});
