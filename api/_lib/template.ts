
import { readFileSync } from 'fs';
// import marked from 'marked';
import { TradeableAssetBase } from '..';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
// const twemoji = require('twemoji');
// const twOptions = { folder: 'svg', ext: '.svg' };
// const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string = 'white', fontSize: string = '14px') {
    let background = 'white';
    let foreground = 'black';
    let radial = 'lightgray';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
        radial = 'dimgray';
    }
    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

      html,body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
      }

    body {
        // background: #ffffff;
//         background: #FFFFFF;
// box-shadow: inset 0px 0px 60px #00FF3B;
//         background-image: radial-gradient(50% 50% at 50% 50%, #F9F903 0%, rgba(249, 249, 3, 0) 0.01%);
        background-image:radial-gradient(68% 68% at 50% 0%, #FCFF55 0%, rgba(254, 255, 236, 0) 100%);
        // box-shadow: inset 0px 0px 60px #FCFF55;

        // background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .images-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
        gap: 16px;
    }

    .image-wrapper {
        height: 512px;
        max-height: 512px;
        width: 512px;
        min-width: 512px;
        object-fit: contain;
        border: 8px solid #FFFFFF;
        border-radius: 64px;
        overflow: hidden;
        background-color: #ffffff;
        box-shadow: 0px 100px 118px rgba(185, 185, 185, 0.07), 0px 41.7776px 49.2976px rgba(185, 185, 185, 0.0503198), 0px 22.3363px 26.3568px rgba(185, 185, 185, 0.0417275), 0px 12.5216px 14.7754px rgba(185, 185, 185, 0.035), 0px 6.6501px 7.84712px rgba(185, 185, 185, 0.0282725), 0px 2.76726px 3.26536px rgba(185, 185, 185, 0.0196802);
    }

    .image {
        // height: 512px;
        object-fit: contain;
        height: 100%;
        width: 100%;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .absolute-anchor {
        position: absolute;
        top: 128px;
        right: 128px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }`;
}

export function getHtml(parsedReq: ParsedRequest, assets: TradeableAssetBase[] | undefined) {
    const { slugId } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss()}
    </style>
    <body>
        <div>
            <div class="absolute-anchor">
            <img
            height="164px"
            src="${sanitizeHtml("https://trader.xyz/images/trader-small.png")}"
        />
            </div>
            <div class="spacer">
            <div class="images-wrapper">
                ${assets?.map((img) =>
                     getImage(img.srcImg, "auto", "512px", img.background || '#ffffff')
                ).join('')}
            </div>
            <div class="spacer">
        </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '100%', bgColor = "#ffffff") {
    return `
    <div class="image-wrapper">
    <img
        style="background-color: ${bgColor};"
        class="image"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />
    </div>
    `
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
