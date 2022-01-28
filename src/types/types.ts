import { env } from 'process';

/**
 * Wizard
 */
export interface Wizard {
  name: string;
  serial: string;
  nameLength: number;
  traits: WizardTrait[];
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
 * Pony Traits
 */
export interface PonyTrait {
  trait_type: string;
  value: string;
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
}

export enum MarketIcons {
  OpenSea = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/os.png',
  LooksRare = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/lr.png',
  NFTX = 'https://raw.githubusercontent.com/ajcrowe/runebot/master/assets/nft-x.png',
}

/**
 * Token Currency to Symbols
 */
export enum TokenSymbols {
  WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
}
