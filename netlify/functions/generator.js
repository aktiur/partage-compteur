import fs from 'fs';

import fetch from 'node-fetch';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

import { builder } from '@netlify/functions';

// on pourra virer toutes les fontes qu'on utilise pas
const FONTS = [
  {
    name: 'Inter',
    file: 'Inter-ThinItalic.woff',
    weight: 100,
    style: 'italic',
  },
  {
    name: 'Inter',
    file: 'Inter-Thin.woff',
    weight: 100,
    style: 'normal',
  },
  {
    name: 'Inter',
    file: 'Inter-ExtraLightItalic.woff',
    weight: 200,
    style: 'italic',
  },
  {
    name: 'Inter',
    file: 'Inter-ExtraLight.woff',
    weight: 200,
    style: 'normal',
  },
  {
    name: 'Inter',
    file: 'Inter-LightItalic.woff',
    weight: 300,
    style: 'italic',
  },
  {
    name: 'Inter',
    file: 'Inter-Light.woff',
    weight: 300,
    style: 'normal',
  },
  {
    name: 'Inter',
    file: 'Inter-Italic.woff',
    weight: 400,
    style: 'italic',
  },
  {
    name: 'Inter',
    file: 'Inter-Regular.woff',
    weight: 400,
    style: 'normal',
  },
  {
    name: 'Inter',
    file: 'Inter-MediumItalic.woff',
    weight: 500,
    style: 'italic',
  },
  {
    name: 'Inter',
    file: 'Inter-Medium.woff',
    weight: 500,
    style: 'normal',
  },
  {
    name: 'Inter',
    file: 'Inter-SemiBoldItalic.woff',
    weight: 600,
    style: 'italic',
  },
  {
    name: 'Inter',
    file: 'Inter-SemiBold.woff',
    weight: 600,
    style: 'normal',
  },
  {
    name: 'Inter',
    file: 'Inter-BoldItalic.woff',
    weight: 700,
    style: 'italic',
  },
  {
    name: 'Inter',
    file: 'Inter-Bold.woff',
    weight: 700,
    style: 'normal',
  },
  {
    name: 'Inter',
    file: 'Inter-ExtraBoldItalic.woff',
    weight: 800,
    style: 'italic',
  },
  {
    name: 'Inter',
    file: 'Inter-ExtraBold.woff',
    weight: 800,
    style: 'normal',
  },
  {
    name: 'Inter',
    file: 'Inter-BlackItalic.woff',
    weight: 900,
    style: 'italic',
  },
  {
    name: 'Inter',
    file: 'Inter-Black.woff',
    weight: 900,
    style: 'normal',
  },
];

function loadFonts() {
  return FONTS.map(({
    name, file, weight, style,
  }) => {
    const data = fs.readFileSync(`${__dirname}/assets/${file}`);
    return {
      name, data, weight, style,
    };
  });
}

const generator = async function (event, context) {
  const baseHTML = fs.readFileSync(`${__dirname}/assets/social.html`).toString();
  const fonts = loadFonts();

  const res = await fetch('https://c.compteurdegreve.fr/val');
  const { value } = await res.json();

  const vDom = html(baseHTML.replace(/\{\{ compteur \}\}/, value));
  const svg = await satori(vDom, {
    width: 1200,
    height: 630,
    fonts,
  });

  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  }).render();
  const pngBuffer = png.asPng();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 's-maxage=600',
    },
    body: pngBuffer.toString('base64'),
    isBase64Encoded: true,
    ttl: 600,
  };
};

const handler = builder(generator);

export { handler };
