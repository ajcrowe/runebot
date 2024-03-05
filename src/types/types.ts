/**
 * Wizard
 */
export interface Wizard {
  name: string;
  serial: string;
  nameLength: number;
  traits: WizardTrait[] | any[];
  traitCount: number;
  backgroundColor: string;
  maxAffinity: number;
  affinities: Record<string, unknown>;
}

/**
 * Wizard Trait
 */
export interface WizardTrait {
  name: string;
  value: string;
  rarity: number;
  inline?: boolean;
}

/**
 * Wizard Backgrounds and hex color enum
 */
export enum WizardBackground {
  Black = '000000',
  Red = '1e0200',
  Blue = '09071b',
  Green = '040d04',
}

/**
 * Soul
 */
export interface Soul {
  name: string;
  serial: string;
  traits: any[];
  backgroundColor: string;
}

/**
 * Soul Trait
 */
export interface SoulTrait {
  trait_type: string;
  value: string;
}

/**
 * Soul Attribute names
 */
export enum SoulAttrName {
  Background = 'background',
  Body = 'body',
  Head = 'head',
  Prop = 'prop',
  Rune = 'rune',
  Familiar = 'familiar',
  Affinity = 'Affinity',
  TraitsCount = '# Traits',
  TraitsAffinityCount = '# Traits in Affinity',
  TraitsAffinityPercent = '% Traits in Affinity',
  TransmutedNumber = 'Transmuted from number',
  TransmutedName = 'Transmuted from',
  BurnOrder = 'Burn order',
  Undesirable = 'undesirable',
}

/**
 * Pony
 */
export interface Pony {
  name: string;
  serial: string;
  traits: any[];
  backgroundColor: string;
}

/**
 * Pony Attribute names
 */
export enum PonyAttrName {
  Generation = 'Generation',
  Background = 'background',
  Pony = 'pony',
  Clothes = 'clothes',
  Head = 'head',
  Rune = 'rune',
  Mouth = 'mouth',
}

/**
 * Lock
 */
export interface Lock {
  name: string;
  serial: string;
  traits: any[];
  backgroundColor: string;
}

/**
 * Lock Attribute names
 */
export enum LockAttrName {
  Spell = 'Spell used',
  Key = 'Key used',
  Material = 'Material',
}

/**
 * Beast
 */
export interface Beast {
  name: string;
  serial: string;
  traits: any[];
  backgroundColor: string;
  description: string;
}

/**
 * Beast Attribute names
 */
export enum BeastAttrName {
  Species = 'Species',
  Wings = 'Wings',
  Heads = 'Heads',
  Tail = 'Tail',
}

/**
 * Beast Spawn
 */
export interface Spawn {
  name: string;
  serial: string;
  traits: any[];
  backgroundColor: string;
}

/**
 * Warrior
 */
export interface Warrior {
  name: string;
  serial: string;
  traits: any[];
  backgroundColor: string;
}

/**
 * InfinityVeil
 */
export interface InfinityVeil {
  name: string;
  serial: string;
  traits: any[];
  backgroundColor: string;
}

/**
 * Soul Attribute names
 */
export enum WarriorAttrName {
  Background = 'background',
  Body = 'body',
  Head = 'head',
  Weapon = 'weapon',
  Rune = 'rune',
  Shield = 'shield',
  Companion = 'companion',
  Affinity = 'Affinity',
  TraitsCount = '# Traits',
  TraitsAffinityCount = '# Traits in Affinity',
  TraitsAffinityPercent = '% Traits in Affinity',
}

/**
 * Traits
 */
export interface Trait {
  trait_type: string;
  value: string;
}

/**
 * Item
 */
export type Item = Wizard | Warrior | Soul | Pony | Lock | Beast | Spawn;

export interface RarityConfig {
  color: string;
  cutoff: number;
  affinityCutoff: number;
  name: string;
}

export interface RarityRegistry {
  artifact: RarityConfig;
  legendary: RarityConfig;
  epic: RarityConfig;
  rare: RarityConfig;
  uncommon: RarityConfig;
  common: RarityConfig;
}

export const rarityRegistry: RarityRegistry = {
  artifact: {
    color: '#e6cc80',
    cutoff: 1,
    affinityCutoff: 1,
    name: 'Artifact',
  },
  legendary: {
    color: '#ff8000',
    cutoff: 25,
    affinityCutoff: 200,
    name: 'Legendary',
  },
  epic: {
    color: '#a335ee',
    cutoff: 75,
    affinityCutoff: 1500,
    name: 'Epic',
  },
  rare: {
    color: '#0070dd',
    cutoff: 175,
    affinityCutoff: 4500,
    name: 'Rare',
  },
  uncommon: {
    color: '#1eff00',
    cutoff: 275,
    affinityCutoff: 8800,
    name: 'Uncommon',
  },
  common: {
    color: '#ffffff',
    cutoff: 10000,
    affinityCutoff: 20000,
    name: 'Common',
  },
};

/**
 * Daily Tweet status data
 */
export interface DailyTweet {
  status: string;
}

/**
 * Cronjob names
 */
export enum CronJobs {
  SALES_CHECKER = 'Sales Checker',
}

/**
 * Sale type
 */
export interface Sale {
  id: string;
  title: string;
  tokenSymbol: string;
  tokenPrice: number;
  usdPrice?: string;
  buyerAddr: string;
  buyerName?: string;
  sellerAddr: string;
  sellerName?: string;
  txHash: string;
  cacheKey: string;
  permalink: string;
  thumbnail: string;
  backgroundColor: string;
  market: string;
  marketIcon: string;
  creatorRoyalties?: string;
}

/**
 * Listing type
 */
export interface Listing {
  id: string;
  title: string;
  tokenSymbol: string;
  tokenPrice: number;
  usdPrice?: string;
  sellerAddr: string;
  sellerName?: string;
  permalink: string;
  thumbnail: string;
  backgroundColor: string;
  cacheKey: string;
  market: string;
  marketIcon: string;
}

export enum Market {
  OPENSEA = 'OpenSea',
  LOOKSRARE = 'Looks Rare',
  NFTX = 'NFTX',
  FORGOTTEN = 'Forgotten Market',
  BLUR = 'Blur',
  GEM = 'OpenSea Pro',
  ZAAR = 'Zaar',
  X2Y2 = 'X2Y2',
  SUDOSWAP = 'Sudoswap',
}

export enum MarketIcons {
  OPENSEA = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/os.png',
  LOOKSRARE = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/lr.png',
  NFTX = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/nft-x.png',
  FORGOTTEN = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/forgotten.png',
  BLUR = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/blur.png',
  GEM = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/gem.png',
  ZAAR = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/zaar.png',
  X2Y2 = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/x2y2.png',
  SUDOSWAP = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/x2y2.png',
}

export enum MarketURI {
  OPENSEA = 'opensea.io',
  OPENSEAPRO = 'pro.opensea.io',
  LOOKSRARE = 'looksrare.org',
  NFTX = 'nftx.io',
  FORGOTTEN = 'forgotten.market',
  BLUR = 'blur.io',
  GEM = 'gem.xyz',
  ZAAR = 'zaar.market',
  X2Y2 = 'x2y2.io',
  SUDOSWAP = 'sudoswap.xyz',
}

export interface MarketMetaData {
  name: string;
  icon: string;
  uri: string;
}

/**
 * Token Currency to Symbols
 */
export enum TokenSymbols {
  WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
}
