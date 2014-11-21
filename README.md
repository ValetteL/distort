# Distort.js

Library to generate complex matrixes to be used with CSS3. You can individually
set/adjust/animate each of the four points of an element;

[![Build Status](http://img.shields.io/travis/isuttell/distort.svg?style=flat)](https://travis-ci.org/isuttell/distort)
[![Coverage Status](https://img.shields.io/coveralls/isuttell/distort.svg?style=flat)](https://coveralls.io/r/isuttell/distort)
[![Codacy Badge](https://www.codacy.com/project/badge/acc9c0ea49c7433fb86216e3aaebce5c)](https://www.codacy.com/public/isuttell/distort)
[![Release](http://img.shields.io/github/release/isuttell/distort.svg?style=flat)](https://github.com/isuttell/distort/tarball/master)

## Basic Usage
````
    // Height and Width are need to calcuate matrix
    var distort = new Distort({
        width: 100, // Required
        height: 100, // Required

        $el: $('.element') // Or you can specify a jQuery element
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
````

## Examples

* [3x3 Grid Menu on Codepen.io](http://codepen.io/isuttell/full/Wbbwyd/)
* [Using with GSAP TimelineMax on Codepen.io](http://codepen.io/isuttell/full/yyyjmX/)

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
