# Distort.js

Library to generate complex matrixes to be used with CSS3 transforms. You can individually set/adjust/animate each of the four points of an element. Supports AMD.

[![Build Status](http://img.shields.io/travis/isuttell/distort.svg?style=flat)](https://travis-ci.org/isuttell/distort)
[![Coverage Status](https://img.shields.io/coveralls/isuttell/distort.svg?style=flat)](https://coveralls.io/r/isuttell/distort)
[![Codacy Badge](https://www.codacy.com/project/badge/acc9c0ea49c7433fb86216e3aaebce5c)](https://www.codacy.com/public/isuttell/distort)
[![Dev Dependencies](http://img.shields.io/david/dev/isuttell/distort.svg?style=flat)](https://david-dm.org/isuttell/distort#info=devDependencies)
[![Release](http://img.shields.io/github/release/isuttell/distort.svg?style=flat)](https://github.com/isuttell/distort/tarball/master)

## Bower
The easiest way to install and stay up to date with Distort is through [Bower](http://bower.io/):
```shell
bower install distort --save
```

## Basic Usage
```js
    // Height and Width are need to calcuate matrix
    var distort = new Distort({
        width: 100, // Required
        height: 100, // Required

        // Or

        $el: $('.element'), // Or you can specify a jQuery element

        // (Optional) Transform Origin - Defaults to center
        offset: {
            x: '0%' || '0px', // Accepts 'px' or '%'
            y: '0%' || '0px',
        }
    });

    // Relative
    distort.topRight.x += 100;
    distort.topRight.y += 100;

    // Absolute
    distort.bottomRight.x = 50;
    distort.bottomRight.y = 50;

    // Optionally check if the matrix was successfully calculated
    if(distort.isValid) {

        // Using jQuery for convenience
        $('#image').css({
            'transform' : distort.toString()
        });
    }
```

## Examples

* [3x3 Grid Menu](http://codepen.io/isuttell/full/Wbbwyd/)
* [Using CSS Transitions](http://codepen.io/isuttell/full/dPPKWx/)
* [Using with GSAP TimelineMax](http://codepen.io/isuttell/full/yyyjmX/)

## Credit
Forked from [edankwan/PerspectiveTransform.js](https://github.com/edankwan/PerspectiveTransform.js)

The original PerspectiveTransform.js is created by  Israel Pastrana
http://www.is-real.net/experiments/css3/wonder-webkit/js/real/display/PerspectiveTransform.js

Matrix Libraries from a Java port of JAMA: A Java Matrix Package, http://math.nist.gov/javanumerics/jama/
Developed by Dr Peter Coxhead: http://www.cs.bham.ac.uk/~pxc/
Available here: http://www.cs.bham.ac.uk/~pxc/js/

I simply removed some irrelevant variables and functions and merge everything into a smaller function. I also added some error checking functions and bug fixing things.

## License
Distort is open-sourced software licensed under the MIT license

## Release Historty
* v1.0.2-alpha - Refactoring
* v1.0.1-alpha - Minor bug fixes
* v1.0.0-alpha - Initial Release
