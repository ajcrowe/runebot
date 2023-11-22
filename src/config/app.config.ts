import { AppConfig } from '../types';

export default (): AppConfig => ({
  bot: {
    salesCheckCron: process.env.SALES_CHECK_CRON || '*/1 * * * *',
    salesLookbackSeconds: Number(process.env.SALES_LOOKBACK) || 900,
    redisUri: process.env.REDIS_URL || 'redis://localhost:6379',
    reservoirApiMainnet: 'https://forgotten.market/api/sales/v6',
    reservoirApiArbitrum: 'https://api-arbitrum.reservoir.tools/sales/v6', // TODO: switch to our paid version?
    forgottenBaseURI: 'https://forgotten.market',
  },
  wizard: {
    tokenContract: '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42',
    tokenAbi: 'abis/wizards.json',
    forgottenSlug: 'forgottenruneswizardscult',
    dataURI:
      'https://cloudflare-ipfs.com/ipfs/QmfUgAKioFE8taS41a2XEjYFrkbfpVyXYRt7c6iqTZVy9G',
    imageURI:
      'https://cloudflare-ipfs.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq',
  },
  warrior: {
    tokenContract: '0x9690b63eb85467be5267a3603f770589ab12dc95',
    tokenAbi: 'abis/warriors.json',
    forgottenSlug: 'forgottenruneswarriorsguild',
    dataURI: 'https://portal.forgottenrunes.com/api/warriors/data/',
    imageURI: 'https://portal.forgottenrunes.com/api/warriors/img/',
  },
  soul: {
    tokenContract: '0x251b5f14a825c537ff788604ea1b58e49b70726f',
    tokenAbi: 'abis/souls.json',
    forgottenSlug: 'forgottensouls',
    dataURI: 'https://portal.forgottenrunes.com/api/souls/data',
    imageURI: 'https://portal.forgottenrunes.com/api/souls/img',
  },
  pony: {
    tokenContract: '0xf55b615b479482440135ebf1b907fd4c37ed9420',
    tokenAbi: 'abis/ponies.json',
    forgottenSlug: 'forgottenrunesponies',
    dataURI: 'https://portal.forgottenrunes.com/api/shadowfax/data',
    imageURI: 'https://portal.forgottenrunes.com/api/shadowfax/img',
  },
  flame: {
    tokenContract: '0x31158181b4b91a423bfdc758fc3bf8735711f9c5',
    tokenAbi: 'abis/flames.json',
    forgottenSlug: 'infinityveil',
    dataURI:
      'https://cloudflare-ipfs.com/ipfs/QmebNYy9k7JFzofbYa6d7hr5AWYaPqtwqTjHe6gk2BBRm1',
    imageURI: '',
  },
  lock: {
    tokenContract: '0xda5cf3a42ebacd2d8fcb53830b1025e01d37832d',
    tokenAbi: 'abis/lock.json',
    forgottenSlug: 'forgottenrunesgatetotheseventhrealm',
    dataURI: 'https://portal.forgottenrunes.com/api/locks/data',
    imageURI: 'https://portal.forgottenrunes.com/api/locks/img',
  },
  beast: {
    tokenContract: '0x8634c23d5794ed177e9ffd55b22fdb80a505ab7b',
    tokenAbi: 'abis/beast.json',
    forgottenSlug: 'forgottenrunesbeasts',
    dataURI: 'https://portal.forgottenrunes.com/api/beasts/data',
    imageURI: 'https://portal.forgottenrunes.com/api/beasts/img',
  },
  spawn: {
    tokenContract: '0x7de11a2d9e9727fa5ead3094e40211c5e9cf5857',
    tokenAbi: 'abis/spawn.json',
    forgottenSlug: 'forgottenrunesbeastspawn',
    dataURI: 'https://portal.forgottenrunes.com/api/spawn/data',
    imageURI: 'https://portal.forgottenrunes.com/api/spawn/img',
  },
  babies: {
    tokenContract: '0x4b1e130ae84c97b931ffbe91ead6b1da16993d45',
    tokenAbi: 'abis/babies.json',
    forgottenSlug: 'babywizards',
    dataURI: 'http://forgottenbabies.com/uri/json',
    imageURI: 'http://forgottenbabies.com/uri/json',
  },
  treats: {
    tokenContract: '0x7c104b4db94494688027cced1e2ebfb89642c80f',
    tokenAbi: 'abis/treats.json',
    forgottenSlug: 'athenaeum',
    dataURI: 'https://portal.forgottenrunes.com/api/treats/data/',
    imageURI: 'https://portal.forgottenrunes.com/api/treats/img/',
  },
  tricks: {
    tokenContract: '0x881731d0b01db270379389ba5234326d8d16a124',
    tokenAbi: 'abis/tricks.json',
    forgottenSlug: 'lootshapeshifter',
    dataURI: 'https://portal.forgottenrunes.com/api/treats/data/',
    imageURI: 'https://portal.forgottenrunes.com/api/treats/img/',
  },
  boxes: {
    tokenContract: '0x59775fd5f266c216d7566eb216153ab8863c9c84',
    tokenAbi: 'abis/boxes.json',
    forgottenSlug: 'nightmareimpstreatboxes',
    dataURI: 'https://portal.forgottenrunes.com/api/halloween/boxes/data/',
    imageURI: 'https://portal.forgottenrunes.com/api/halloween/boxes/img',
  },
  rings: {
    tokenContract: '0x5d4aa6ff9de7963ead5a17b454dc1093ca9e98e7',
    forgottenSlug: 'forgottenruniversewatchersrings',
  },
  runiverseitems: {
    tokenContract: '0xa3abf5552cc5e1477009bbf90d0b8d2689883891',
    forgottenSlug: 'forgottenruniverseitems',
    chain: 'arbitrum',
  },
  athenaeum: {
    tokenContract: '0x7c104b4db94494688027cced1e2ebfb89642c80f',
    forgottenSlug: 'athenaeum',
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
