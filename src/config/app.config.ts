import { AppConfig } from '../types';

export default (): AppConfig => ({
  bot: {
    salesCheckCron: process.env.SALES_CHECK_CRON || '*/1 * * * *',
    openSeaApiKey: process.env.OPENSEA_API_KEY,
    salesLookbackSeconds: Number(process.env.SALES_LOOKBACK) || 900,
    looksRareApi: process.env.LOOKS_RARE_API || 'https://api.looksrare.org/graphql'
  },
  wizard: {
    tokenContract: process.env.WIZARD_CONTRACT || '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42',
    tokenAbi: './abis/wizards.json',
    openSeaSlug: process.env.WIZARD_OPENSEA_SLUG || 'forgottenruneswizardscult',
    ipfsBaseURI: process.env.WIZARD_IPFS_BASE_URI,
    openSeaBaseURI: process.env.WIZARD_OPENSEA_BASE_URI,
  },
  soul: {
    tokenContract: process.env.SOUL_CONTRACT || '0x251b5f14a825c537ff788604ea1b58e49b70726f',
    tokenAbi: './abis/souls.json',
    openSeaSlug: process.env.SOUL_OPENSEA_SLUG || 'forgottensouls',
    ipfsBaseURI: process.env.SOUL_IPFS_BASE_URI,
    openSeaBaseURI: process.env.SOUL_OPENSEA_BASE_URI,
  },
  pony: {
    tokenContract: process.env.PONY_CONTRACT || '0xf55b615b479482440135ebf1b907fd4c37ed9420',
    tokenAbi: './abis/ponies.json',
    openSeaSlug: process.env.PONY_OPENSEA_SLUG || 'forgottenrunesponies',
    ipfsBaseURI: process.env.PONY_IPFS_BASE_URI,
    openSeaBaseURI: process.env.PONY_OPENSEA_BASE_URI,
  },
  flame: {
    tokenContract: process.env.FLAME_CONTRACT || '0x31158181b4b91a423bfdc758fc3bf8735711f9c5',
    tokenAbi: './abis/flames.json',
    openSeaSlug: process.env.FLAME_FLAME_OPENSEA_SLUG || 'infinityveil',
    ipfsBaseURI: process.env.FLAME_IPFS_BASE_URI,
    openSeaBaseURI: process.env.FLAME_OPENSEA_BASE_URI,
  },
  discord: {
    token: process.env.DISCORD_BOT_TOKEN,
    salesChannelIds: process.env.DISCORD_SALES_CHANNEL_IDS.split(',') || [],
    prefix: process.env.DISCORD_PREFIX || "#",
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
