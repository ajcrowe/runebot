import { AppConfig } from '../types';

export default (): AppConfig => ({
  bot: {
    salesCheckCron: process.env.SALES_CHECK_CRON || '*/1 * * * *',
    openSeaApiKey: process.env.OPENSEA_API_KEY,
    salesLookbackSeconds: Number(process.env.SALES_LOOKBACK) || 900,
    redisUri: process.env.REDIS_URI || 'redis://localhost:6379',
    looksRareApi: 'https://api.looksrare.org/api/v1/events',
    forgottenApi: 'https://api.reservoir.tools/sales/v3',
    nftxApi:
      'https://graph-proxy.nftx.xyz/shared/subgraphs/name/nftx-project/nftx-v2',
    sushiApi: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
    forgottenBaseURI: 'https://forgotten.market',
  },
  wizard: {
    tokenContract: '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42',
    tokenAbi: 'abis/wizards.json',
    nftxVaultContract: '0x87931e7ad81914e7898d07c68f145fc0a553d8fb',
    openSeaSlug: 'forgottenruneswizardscult',
    forgottenSlug: 'forgottenruneswizardscult',
    dataURI:
      'https://cloudflare-ipfs.com/ipfs/QmfUgAKioFE8taS41a2XEjYFrkbfpVyXYRt7c6iqTZVy9G',
    imageURI:
      'https://cloudflare-ipfs.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq',
    openSeaBaseURI:
      'https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42',
  },
  warrior: {
    tokenContract: '0x9690b63eb85467be5267a3603f770589ab12dc95',
    tokenAbi: 'abis/warriors.json',
    nftxVaultContract: '0xe218a21d03dea706d114d9c4490950375f3b7c05',
    openSeaSlug: 'forgottenruneswarriorsguild',
    forgottenSlug: 'forgottenruneswarriorsguild',
    dataURI: 'https://portal.forgottenrunes.com/api/warriors/data/',
    imageURI: 'https://portal.forgottenrunes.com/api/warriors/img/',
    openSeaBaseURI:
      'https://opensea.io/assets/0x9690b63Eb85467BE5267A3603f770589Ab12Dc95',
  },
  soul: {
    tokenContract: '0x251b5f14a825c537ff788604ea1b58e49b70726f',
    tokenAbi: 'abis/souls.json',
    openSeaSlug: 'forgottensouls',
    forgottenSlug: 'forgottensouls',
    dataURI: 'https://portal.forgottenrunes.com/api/souls/data',
    imageURI: 'https://portal.forgottenrunes.com/api/souls/img',
    openSeaBaseURI:
      'https://opensea.io/assets/0x251b5f14a825c537ff788604ea1b58e49b70726f',
  },
  pony: {
    tokenContract: '0xf55b615b479482440135ebf1b907fd4c37ed9420',
    tokenAbi: 'abis/ponies.json',
    openSeaSlug: 'forgottenrunesponies',
    forgottenSlug: 'forgottenrunesponies',
    dataURI: 'https://portal.forgottenrunes.com/api/shadowfax/data',
    imageURI: 'https://portal.forgottenrunes.com/api/shadowfax/img',
    openSeaBaseURI:
      'https://opensea.io/assets/0xf55b615b479482440135ebf1b907fd4c37ed9420',
  },
  flame: {
    tokenContract: '0x31158181b4b91a423bfdc758fc3bf8735711f9c5',
    tokenAbi: 'abis/flames.json',
    openSeaSlug: 'infinityveil',
    forgottenSlug: 'infinityveil',
    dataURI:
      'https://cloudflare-ipfs.com/ipfs/QmebNYy9k7JFzofbYa6d7hr5AWYaPqtwqTjHe6gk2BBRm1',
    imageURI: '',
    openSeaBaseURI:
      'https://opensea.io/assets/0x31158181b4b91a423bfdc758fc3bf8735711f9c5',
  },
  lock: {
    tokenContract: '0xda5cf3a42ebacd2d8fcb53830b1025e01d37832d',
    tokenAbi: 'abis/lock.json',
    openSeaSlug: 'forgottenrunesgatetotheseventhrealm',
    forgottenSlug: 'forgottenrunesgatetotheseventhrealm',
    dataURI: 'https://portal.forgottenrunes.com/api/locks/data',
    imageURI: 'https://portal.forgottenrunes.com/api/locks/img',
    openSeaBaseURI:
      'https://opensea.io/assets/0xda5cf3a42ebacd2d8fcb53830b1025e01d37832d',
  },
  beast: {
    tokenContract: '0x8634c23d5794ed177e9ffd55b22fdb80a505ab7b',
    tokenAbi: 'abis/beast.json',
    openSeaSlug: 'forgottenrunesbeasts',
    forgottenSlug: 'forgottenrunesbeasts',
    dataURI: 'https://portal.forgottenrunes.com/api/beasts/data',
    imageURI: 'https://portal.forgottenrunes.com/api/beasts/img',
    openSeaBaseURI:
      'https://opensea.io/assets/0x8634c23d5794ed177e9ffd55b22fdb80a505ab7b',
  },
  spawn: {
    tokenContract: '0x7de11a2d9e9727fa5ead3094e40211c5e9cf5857',
    tokenAbi: 'abis/spawn.json',
    openSeaSlug: 'forgottenrunesbeastspawn',
    forgottenSlug: 'forgottenrunesbeastspawn',
    dataURI: 'https://portal.forgottenrunes.com/api/spawn/data',
    imageURI: 'https://portal.forgottenrunes.com/api/spawn/img',
    openSeaBaseURI:
      'https://opensea.io/assets/0x7de11a2d9e9727fa5ead3094e40211c5e9cf5857',
  },
  babies: {
    tokenContract: '0x4b1e130ae84c97b931ffbe91ead6b1da16993d45',
    tokenAbi: 'abis/babies.json',
    openSeaSlug: 'babywizards',
    forgottenSlug: 'babywizards',
    dataURI: 'http://forgottenbabies.com/uri/json',
    imageURI: 'http://forgottenbabies.com/uri/json',
    openSeaBaseURI:
      'https://opensea.io/assets/0x4b1e130ae84c97b931ffbe91ead6b1da16993d45',
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
