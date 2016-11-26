---
layout: post
title:  Thoughts on Linear Gradients That Resemble Images
date:   2016-11-30
categories: coding
sharing: true
---

Harry Roberts wrote an article about improving perceived loading time
[Improving Perceived Performance with Multiple Background Images](http://csswizardry.com/2016/10/improving-perceived-performance-with-multiple-background-images/)
a topic which is dear to me, as one can see in my dominant colors lazy-loading article
„until there’s a way to reliably automate this“ 
he called for automation of his process, so I went and over-engineered it in the past month

## Creating pixels using radial gradients

first thought was re-creating pixels with radial gradients
I even created a script automating the process, but Will Wallace beat me to sharing this idea with the world
[Blurground](https://codepen.io/wiiiiilllllll/post/blurground)
Sass function with Photoshop's eyedropper tool
if you don't want to use the eyedropper you can use my script

~~~ js
const gm = require('gm');
const fs = require('fs');
const handlebars = require('handlebars');

const args = process.argv.slice(2);
const input = args[0];

function rgb(hex) {
    var parts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [
        parseInt(parts[1], 16),
        parseInt(parts[2], 16),
        parseInt(parts[3], 16)
    ].join(', ');
}

const source = gm(input);

const dominant = new Promise((resolve, reject) => {
    source
        .colors(1)
        .toBuffer('RGB', (error, buffer) => {
            if (error) {
                reject(error);
            }
            resolve('#' + buffer.slice(0, 3).toString('hex'));
        });
});

const colors = new Promise((resolve, reject) => {
    source
        .resize(3, 3, '!')
        .toBuffer('RGB', (error, buffer) => {
            if (error) {
                reject(error);
            }
            const string = buffer.toString('hex');
            const colors = [];
            for (let i = 0; i < 9;) {
                colors.push(rgb(string.slice(i * 6, ++i * 6)));
            }
            resolve(colors);
        });
});

Promise.all([dominant, colors])
    .then((values) => {
        fs.readFile('./gradients.hbs', 'utf-8', (error, content) => {
            let template = handlebars.compile(content);
            fs.writeFile('./gradients.html', template({
                image: input,
                dominant: values[0],
                colors: values[1]
            }));
        });
    });
~~~

~~~ html
<!doctype html>
<html>
<head>
    <style>
        body {
            width: 100vh;
            height: 100vh;
            background-size: 100% 100%;
            background-color: {{dominant}};
            background-image:
                url({{image}}),
                radial-gradient(ellipse at 16.7% 16.7%, rgba({{colors.[0]}}, 1), rgba({{colors.[0]}}, 0) 50%),
                radial-gradient(ellipse at 50%   16.7%, rgba({{colors.[1]}}, 1), rgba({{colors.[1]}}, 0) 50%),
                radial-gradient(ellipse at 83.3% 16.7%, rgba({{colors.[2]}}, 1), rgba({{colors.[2]}}, 0) 50%),
                radial-gradient(ellipse at 16.7% 50%,   rgba({{colors.[3]}}, 1), rgba({{colors.[3]}}, 0) 50%),
                radial-gradient(ellipse at 50%   50%,   rgba({{colors.[4]}}, 1), rgba({{colors.[4]}}, 0) 50%),
                radial-gradient(ellipse at 83.3% 50%,   rgba({{colors.[5]}}, 1), rgba({{colors.[5]}}, 0) 50%),
                radial-gradient(ellipse at 16.7% 83.3%, rgba({{colors.[6]}}, 1), rgba({{colors.[6]}}, 0) 50%),
                radial-gradient(ellipse at 50%   83.3%, rgba({{colors.[7]}}, 1), rgba({{colors.[7]}}, 0) 50%),
                radial-gradient(ellipse at 83.3% 83.3%, rgba({{colors.[8]}}, 1), rgba({{colors.[8]}}, 0) 50%);
        }
    </style>
</head>
<body>
</body>
</html>
~~~

INSERT IMAGE

## Automating generation of linear gradients with equal-width stops

second thought was automating the color retrieval process, but I did not want to just slice the image in four quarters
Ben Briggs beat me to writing a npm module on this exact topic
"Provide a gradient fallback for an image that loosely resembles the original."
[PostCSS plugin](https://github.com/ben-eb/postcss-resemble-image)
so I admitted my defeat and decided to improve upon his PostCSS plugin
he was using [Paper.js](https://www.npmjs.com/package/paper)
having to install non-npm dependencies complicates setup and lengthens builds times
I replaced asset-resolver, image-size and paper with a single dependency to Jimp, making the plugin a Node.js-only solution

~~~ js
const Jimp = require('jimp');

const args = process.argv.slice(2);
const input = args[0];
const stops = args[1] || 4;

function hex({ r, g, b }) {
    function convert(c) {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    return '#' + convert(r) + convert(g) + convert(b);
}

function round(number, precision) {
    return Math.round(number * Math.pow(10, precision) ) / Math.pow(10, precision);
}

function gradient(stops) {
    return 'linear-gradient(90deg, ' + stops.map((stop) => {
        return `${stop.color} ${stop.position}%`;
    }).join(', ') + ')';
}

Jimp.read(input, (err, image) => {
    if (err) {
        throw err;
    }

    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const chunk = width / stops;

    const result = [];

    for (let i = 0; i < width; i += chunk) {
        let color = image.clone()
            .crop(i, 0, chunk, height)
            .resize(1, 1, Jimp.RESIZE_BICUBIC)
            .getPixelColor(0, 0);

        result.push({
            color: hex(Jimp.intToRGBA(color)),
            position: round(i * 100 / width, 2)
        });
    }

    console.log(gradient(result));
});
~~~

~~~ css
linear-gradient(90deg, #023d33 0%, #036357 25%, #91aaa5 50%, #cdcfd5 75%)
~~~

INSERT IMAGE

## Automatic generation of linear gradients with variable-width stops

I still wanted to pursue my „intelligent algorithm“ idea
my idea was to smoothen and quantize the image, so that you can get an image with the largest color areas
this would then have to be flattened to a single strip, which already is our linear gradient
the final step is to take n of the largest color areas in the strip and create a linear gradient for usage in CSS

there is no quantization in Jimp, so I searched for an implementation of the NeuQuant algorithm
neuquant-js by Daniel Perez Alvarez is a fork of a fork of Johan Nordberg’s gif.js
I thought about implementing and opening a pull request for Jimp, but upon discovering that the most popular pure JavaScript GIF library is not an npm module I have just implemented what I need for my algorithm

~~~ js
const Jimp = require('jimp');
const quant = require('neuquant-js').palette;

const args = process.argv.slice(2);
const input = args[0];

function findClosest(palette, r, g, b) {
    let minPos = 0;
    let minD = Number.MAX_SAFE_INTEGER;

    for (let i = 0, l = palette.length; i < l;) {
        const dR = r - palette[i++];
        const dG = g - palette[i++];
        const dB = b - palette[i];
        const d = dR * dR + dG * dG + dB * dB;

        if (d < minD) {
            minD = d;
            minPos = i / 3 | 0;
        }

        i++;
    }

    return minPos;
}

function hex({ r, g, b }) {
    function convert(c) {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    return '#' + convert(r) + convert(g) + convert(b);
}

function round(number, precision) {
    return Math.round(number * Math.pow(10, precision) ) / Math.pow(10, precision);
}

function gradient(stops) {
    return 'linear-gradient(90deg, ' + stops.map((stop) => {
        return `${stop.color} ${round(stop.center, 2)}%`;
    }).join(', ') + ')';
}

Jimp.read(input, (err, image) => {
    if (err) {
        throw err;
    }

    const strip = image.clone().resize(256, 4, Jimp.RESIZE_BICUBIC);

    const palette = quant(strip.bitmap.data, {
        netsize: 16,
        samplefac: 10
    });

    strip.scan(0, 0, strip.bitmap.width, strip.bitmap.height, function (x, y, idx) {
        const colorIndex = findClosest(
            palette,
            this.bitmap.data[idx],
            this.bitmap.data[idx + 1],
            this.bitmap.data[idx + 2]
        );
        this.bitmap.data[idx] = palette[colorIndex * 3];
        this.bitmap.data[idx + 1] = palette[colorIndex * 3 + 1];
        this.bitmap.data[idx + 2] = palette[colorIndex * 3 + 2];
    });

    strip.resize(256, 1, Jimp.RESIZE_BICUBIC);

    const groups = [];
    let previous = '#';

    for (let x = 0; x < strip.bitmap.width; x++) {
        const color = hex(Jimp.intToRGBA(strip.getPixelColor(x, 0)));
        if (color !== previous) {
            groups.push({
                color: color,
                pixels: [x],
                weight: 1,
                center: x / strip.bitmap.width
            });
        } else {
            const group = groups[groups.length - 1];
            group.pixels.push(x);
            group.weight += 1;
            group.center = 100 * (group.pixels.reduce((a, b) => a + b) / group.weight) / strip.bitmap.width;
        }
        previous = color;
    }

    const weighted = groups.sort((a, b) => a.weight - b.weight);

    const sorted = weighted.slice(-4).sort((a, b) => a.center - b.center);

    console.log(gradient(sorted));
});
~~~

~~~ css
linear-gradient(90deg, #043630 9.77%, #02554b 33.79%, #c4c6dd 67.97%, #c4c6dd 95.31%)
~~~

INSERT IMAGE

## Conclusion
the approach is not always favorable, it is center-weighted though and can return better results, depending on the image itself
you can use any of the three scripts and keep the gradients that work best for you

INSERT IMAGE(S)

and if Oliver Moran wants me to incorporate Devon Govett’s gif-stream and neuqnat into Jimp, I’d be happy to do it
