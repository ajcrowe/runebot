import { AppConfig } from '../types';

export default (): AppConfig => ({
  bot: {
    salesCheckCron: process.env.SALES_CHECK_CRON || '*/1 * * * *',
    openSeaApiKey: process.env.OPENSEA_API_KEY,
    salesLookbackSeconds: Number(process.env.SALES_LOOKBACK) || 900,
    looksRareApi:
      process.env.LOOKS_RARE_API || 'https://api.looksrare.org/graphql',
  },
  wizard: {
    tokenContract:
      process.env.WIZARD_CONTRACT ||
      '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42',
    tokenAbi: './abis/wizards.json',
    openSeaSlug: process.env.WIZARD_OPENSEA_SLUG || 'forgottenruneswizardscult',
    dataURI:
      process.env.WIZARD_DATA_URI ||
      'https://cloudflare-ipfs.com/ipfs/QmfUgAKioFE8taS41a2XEjYFrkbfpVyXYRt7c6iqTZVy9G',
    imageURI:
      process.env.WIZARD_IMAGE_URI ||
      'https://cloudflare-ipfs.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq',
    openSeaBaseURI:
      process.env.WIZARD_OPENSEA_BASE_URI ||
      'https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42',
  },
  soul: {
    tokenContract:
      process.env.SOUL_CONTRACT || '0x251b5f14a825c537ff788604ea1b58e49b70726f',
    tokenAbi: './abis/souls.json',
    openSeaSlug: process.env.SOUL_OPENSEA_SLUG || 'forgottensouls',
    dataURI:
      process.env.SOUL_DATA_URI ||
      'https://portal.forgottenrunes.com/api/souls/data',
    imageURI:
      process.env.SOUL_IMAGE_URI ||
      'https://portal.forgottenrunes.com/api/souls/img',
    openSeaBaseURI:
      process.env.SOUL_OPENSEA_BASE_URI ||
      'https://opensea.io/assets/0x251b5f14a825c537ff788604ea1b58e49b70726f',
  },
  pony: {
    tokenContract:
      process.env.PONY_CONTRACT || '0xf55b615b479482440135ebf1b907fd4c37ed9420',
    tokenAbi: './abis/ponies.json',
    openSeaSlug: process.env.PONY_OPENSEA_SLUG || 'forgottenrunesponies',
    dataURI:
      process.env.PONY_DATA_URI ||
      'https://portal.forgottenrunes.com/api/shadowfax/data',
    imageURI:
      process.env.PONY_IMAGE_URI ||
      'https://portal.forgottenrunes.com/api/shadowfax/img',
    openSeaBaseURI:
      process.env.PONY_OPENSEA_BASE_URI ||
      'https://opensea.io/assets/0xf55b615b479482440135ebf1b907fd4c37ed9420',
  },
  flame: {
    tokenContract:
      process.env.FLAME_CONTRACT ||
      '0x31158181b4b91a423bfdc758fc3bf8735711f9c5',
    tokenAbi: './abis/flames.json',
    openSeaSlug: process.env.FLAME_FLAME_OPENSEA_SLUG || 'infinityveil',
    dataURI:
      process.env.FLAME_DATA_URI ||
      'https://cloudflare-ipfs.com/ipfs/QmebNYy9k7JFzofbYa6d7hr5AWYaPqtwqTjHe6gk2BBRm1',
    imageURI: process.env.FLAME_IMAGE_URI || '',
    openSeaBaseURI:
      process.env.FLAME_OPENSEA_BASE_URI ||
      'https://opensea.io/assets/0x31158181b4b91a423bfdc758fc3bf8735711f9c5',
  },
  discord: {
    token: process.env.DISCORD_BOT_TOKEN,
    salesChannelIds: process.env.DISCORD_SALES_CHANNEL_IDS.split(',') || [],
    prefix: process.env.DISCORD_PREFIX || '#',
  },
  ethereum: {
    network: process.env.ETHEREUM_NETWORK,
    url: process.env.ETHEREUM_URL,
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessTokenKey: process.env.TWITTER_ACCESS_KEY,
    accessTokenSecret: process.env.TWITTER_ACCESS_SECRET,
  },
});
