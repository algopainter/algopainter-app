/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Jimp from 'jimp';
import crypto from 'crypto';
import seedrandom from 'seedrandom';

export class PaintExpression {
  constructor() {
    this.basePath = 'https://raw.githubusercontent.com/algopainter/ms-algopainter-expressions/master'
  }

  /*
    {
      shadowHue: 1,
      background: 2,
      gender: 'M',
      expression: 'disgust',
      expressionTemplate: 2,
      useWireframe: true,
      wireframeHue: 0,
      useWireframeBlend: true,
      wireframeBlendStyle: 'BLEND_ADD',
      innerColorHue: 0,
      overlay: 1,
      overlayHue: 0,
      useShadow: true,
      flip: true
    }
  */

  async generate({
    background, //2
    gender, //M
    expression, //digust
    expressionTemplate, //2
    innerColorHue, //0
    overlay, //1
    overlayHue, //1
    useShadow,
    shadowHue,
    useWireframe,
    wireframeHue,
    useWireframeBlend,
    wireframeBlendStyle,
    size,
    flip,
  }) {
    const path = !size ? `${this.basePath}/expressions-resized/400x400/expressions` : `${this.basePath}/expressions-resized/${size}/expressions`;

    const backgroundFile = await Jimp.read(`${path}/background/BG${background}.png`);
    const expressionFile = await Jimp.read(`${path}/expressions/${gender}_${expression}_T${expressionTemplate}.png`);
    const shadowFile = useShadow ? await Jimp.read(`${path}/shadow/${gender}_shadow.png`) : null;
    const wireframeFile = useWireframe ? await Jimp.read(`${path}/wireframe/${gender}_${expression}.png`) : null;
    const innerColorFile = await Jimp.read(`${path}/innercolor/${gender}_${expression}.png`);
    const overlayFile = overlay ? await Jimp.read(`${path}/overlay/overlay_${overlay}.png`) : null;

    if (shadowFile) {
      shadowFile.color([
        { apply: 'hue', params: [shadowHue * 36] },
      ]);

      backgroundFile.composite(shadowFile, 0, 0);
    }

    backgroundFile.composite(expressionFile, 0, 0);

    if (wireframeFile) {
      wireframeFile.color([
        { apply: 'hue', params: [wireframeHue * 36] },
      ]);

      if (useWireframeBlend) {
        backgroundFile.composite(wireframeFile, 0, 0, {
          mode: Jimp[wireframeBlendStyle],
          opacityDest: 1,
          opacitySource: 1
        });
      } else {
        backgroundFile.composite(wireframeFile, 0, 0);
      }
    }

    innerColorFile.color([
      { apply: 'hue', params: [innerColorHue * 36] },
    ]);
    backgroundFile.composite(innerColorFile, 0, 0);

    if (overlayFile) {
      overlayFile.color([
        { apply: 'hue', params: [overlayHue * 36] },
      ]);

      backgroundFile.composite(overlayFile, 0, 0, {
        mode: Jimp.BLEND_LIGHTEN,
        opacityDest: 1,
        opacitySource: 1
      });
    }

    if (flip) {
      backgroundFile.flip(true, false);
    }

    return await backgroundFile.getBase64Async('image/png');
  }
}

export class PaintGwei {
  constructor() {
    this.basePath = 'https://raw.githubusercontent.com/algopainter/ms-algopainter-gwei/master'
  }

  /*
  {
    width: 400,
    height: 400,
    inspiration: 1,
    text: 'My Amazing Painting',
    useRandom: false,
    probability: 0.5,
    wallType: 1,
    overlay: 0,
    overlayOpacity: 1
  }
  */
  async generate({
    finalWidth,
    finalHeight,
    inspiration,
    text,
    useRandom,
    probability,
    useRandomOpacity,
    wallType,
    overlay,
    overlayOpacity,
  }) {
    const size = 190;
    const width = size * 8;
    const height = size * 8;

    const firstHash = crypto.createHash('sha256')
      .update(text)
      .digest('hex');

    const secondHash = crypto.createHash('sha256')
      .update(firstHash)
      .digest('hex');

    const hash = `${firstHash}${secondHash}`;

    const keys = [];

    const base = new Jimp(width, height, 'white');

    for (let i = 0; i < hash.length; i += 2) {
      const hex = hash.substr(i, 2)
      const int = parseInt(hex, 16)
      keys.push(int);
    }

    let src = null;
    let part = null;

    const rng = seedrandom(text);
    let continuos = 0;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        continuos = ((i * 8) + j);
        part = keys[continuos];

        let currentInspiration = inspiration === '0' ? parseInt(rng() * 721 % 5) + 1 : inspiration;

        if (currentInspiration >= 6) currentInspiration = 6;
        if (currentInspiration <= 0) currentInspiration = 1;

        src = await Jimp.read(`${this.basePath}/inspirations/${currentInspiration}/${part}.png`);

        const r = rng();
        const p = 1 - probability;
        if (useRandom && rng() >= (1 - probability)) {
          src.invert();
        }

        base.composite(src, i * size, j * size);
      }
    }

    if (rng() > 0.5) {
      base.contrast(0.2);
    }

    if (rng() > 0.9) {
      base.posterize(rng() % 3 + 5);
    }

    const colorChange = rng();

    if (colorChange >= 0.99) {
      base.sepia();
    } else if (colorChange > 0.95) {
      base.greyscale();
    }

    if (overlay > 0) {
      const overlayLayer = await Jimp.read(`${this.basePath}/overlays/overlay-${overlay}.png`);
      overlayLayer.resize(width, height);
      base.composite(overlayLayer, 0, 0, {
        mode: Jimp.BLEND_EXCLUSION,
        opacityDest: 1,
        opacitySource: overlayOpacity
      });
    }

    const signature = await Jimp.read(`${this.basePath}/inspirations/gwei-signature.png`);
    base.composite(signature, 1180, 1220);

    if (wallType === '0') {
      return base;
    } else if (wallType === '7') {
      const finalWidth = size * 14;
      const finalHeight = size * 14;
      const final = new Jimp(finalWidth, finalHeight, 'white');

      const background = base.clone();
      background.resize(finalWidth * 0.25, finalHeight * 0.25);
      //background.gaussian(3);
      background.resize(finalWidth, finalHeight);
      final.composite(background, 0, 0);

      const startPoint = useRandomOpacity ? rng() * 100 % 3 * 0.1 : 0;

      final.composite(base, size * 3, 0);

      let x1 = 2.5;
      let y1 = 0.5;
      let x2 = 3.5;
      let y2 = 0.5;

      const factor = 0.5;

      for (let i = 0; i < 6; i++) {
        const newBase = base.clone();
        newBase.opacity(1 - startPoint - (i * 0.1));

        if (rng() > 0.5) {
          newBase.invert();
        }

        final.composite(newBase, size * x1, y1 * size);
        final.composite(newBase, size * x2, y2 * size);

        x1 -= factor;
        x2 += factor;
        y1 += factor;
        y2 += factor;
      }

      for (let i = 0; i < 6; i++) {
        const newBase = base.clone();
        newBase.opacity(1 - startPoint - (i * 0.1));

        if (rng() < 0.5) {
          newBase.invert();
        }

        final.composite(newBase, size * x1, y1 * size);
        final.composite(newBase, size * x2, y2 * size);

        x1 += factor;
        x2 -= factor;
        y1 += factor;
        y2 += factor;
      }

      const final2 = base.clone();
      const finalBackground = base.clone();
      finalBackground.invert();
      finalBackground.blur(3);
      final.composite(finalBackground, size * 2.5, size * 3.5);
      final.composite(finalBackground, size * 2.6, size * 3.4);
      final.composite(finalBackground, size * 2.7, size * 3.3);
      final.composite(finalBackground, size * 2.8, size * 3.2);
      final.composite(finalBackground, size * 2.9, size * 3.1);

      const frame = await new Jimp.read(`${this.basePath}/inspirations/silver-frame.png`);

      final.composite(final2, size * 3, size * 3);
      final.composite(frame, 0, 0);

      if (finalWidth && finalHeight) {
        final.resize(finalWidth, finalHeight)
      }

      return await final.getBase64Async('image/png');
    } else {
      const background = await new Jimp.read(`${this.basePath}/walls/wall${wallType}.jpg`);
      const newPainting = base.clone();

      if (wallType === '1') {
        newPainting.resize(1159, 1155);
        background.composite(newPainting, 632, 618);
      }

      if (wallType === '2') {
        newPainting.resize(1519, 1519);
        background.composite(newPainting, 485, 520);
      }

      if (wallType === '3') {
        newPainting.resize(912, 933);
        background.composite(newPainting, 307, 546);
      }

      if (wallType === '4') {
        newPainting.resize(659, 659);
        background.composite(newPainting, 915, 955);
      }

      if (wallType === '5') {
        newPainting.resize(926, 1016);
        background.composite(newPainting, 755, 635);
      }

      if (wallType === '6') {
        newPainting.resize(665, 615);
        background.composite(newPainting, 1904, 907);
      }

      if (finalWidth && finalHeight) {
        background.resize(finalWidth, finalHeight)
      }

      return await background.getBase64Async('image/png');
    }
  }
}
