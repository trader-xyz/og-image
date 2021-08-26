import { IncomingMessage, ServerResponse } from 'http';
import { parseRequest } from './_lib/parser';
import { getScreenshot } from './_lib/chromium';
import { getHtml } from './_lib/template';
const fetch = require('node-fetch');

const isDev = !process.env.AWS_REGION;
const isHtmlDebug = process.env.OG_HTML_DEBUG === '1';

export interface EntireOrderPayloadFromBackend {
    id: string
    signed_order: any
    data: {
      makerAssets: Array<any>
      takerAssets: Array<any>
    }
    maker_address: string
    chain_id: string
    salt: string
    short_id: string
    slug_id: string
  }
  
  export interface BackendTradeSingleQueryResponse {
    trade: EntireOrderPayloadFromBackend | null
  }
  
  const getImageForNft = (nftMetadata: any) => {
    return (
        nftMetadata.image_url ||
        nftMetadata.image_original_url ||
        nftMetadata.image_preview_url ||
        nftMetadata.image_thumbnail_url ||
      null
    )
  }
  

  export interface TradeableAssetBase {
    srcImg: any;
    background: any;
    name: any;
    originalAsset: any;
  }

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    try {
        const parsedReq = parseRequest(req);
        console.log('req')
        console.log('parsedReq', parsedReq.slugId)
        if (!parsedReq.slugId) {
          res.statusCode = 200;
          res.end();
          return res;
        }
        const tradeRaw = await fetch(`https://trader.xyz/api/trade/${parsedReq.slugId}`)
        const tradeJson: BackendTradeSingleQueryResponse | undefined = await tradeRaw.json();
        const makerAssets = tradeJson?.trade?.data.makerAssets;

        const assets = makerAssets?.map(makerAsset => {
            const img = getImageForNft(makerAsset.metadata);
            return {
                srcImg: img,
                background: makerAsset.metadata.background,
                name: makerAsset.name,
                originalAsset: makerAsset,
            }
        });

        const html = getHtml(parsedReq, assets);
        if (isHtmlDebug) {
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
            return;
        }
        // const { fileType } = parsedReq;
        const file = await getScreenshot(html, "png", isDev);
        res.statusCode = 200;
        res.setHeader('Content-Type', `image/${'png'}`);
        res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`);
        res.end(file);
    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>');
        console.error(e);
    }
}
