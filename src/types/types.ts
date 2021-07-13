/**
 * Wizard
 */
export interface Wizard {
  name: string,
  serial: string,
  nameLength: number,
  traits: WizardTrait[],
  traitCount: number,
  backgroundColor: string,
  maxAffinity: number,
  affinities: Record<string, unknown>,
}

/**
 * Wizard Trait
 */
export interface WizardTrait {
  name: string,
  value: string,
  rarity: number,
  inline?: boolean,
}

/**
 * Wizard Backgrounds and hex color enum
 */
export enum WizardBackground {
  Black = '000000',
  Red = '1e0200',
  Blue = '09071b',
  Green = '040d04'
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
    cutoff: 16,
    affinityCutoff: 160,
    name: 'Legendary',
  },
  epic: {
    color: '#a335ee',
    cutoff: 32,
    affinityCutoff: 320,
    name: 'Epic',
  },
  rare: {
    color: '#0070dd',
    cutoff: 128,
    affinityCutoff: 1280,
    name: 'Rare',
  },
  uncommon: {
    color: '#1eff00',
    cutoff: 256,
    affinityCutoff: 2560,
    name: 'Uncommon',
  },
  common: {
    color: '#ffffff',
    cutoff: 10000,
    affinityCutoff: 10000,
    name: 'Common',
  },
};

/**
 * Daily Tweet status data
 */
export interface DailyTweet {
  status: string
}

/**
 * Cronjob names
 */
export enum CronJobs {
  SALES_CHECKER = 'Sales Checker',
}
