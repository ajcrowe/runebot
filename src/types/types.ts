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
    name: 'Artifact',
  },
  legendary: {
    color: '#ff8000',
    cutoff: 16,
    name: 'Legendary',
  },
  epic: {
    color: '#a335ee',
    cutoff: 32,
    name: 'Epic',
  },
  rare: {
    color: '#0070dd',
    cutoff: 128,
    name: 'Rare',
  },
  uncommon: {
    color: '#1eff00',
    cutoff: 256,
    name: 'Uncommon',
  },
  common: {
    color: '#ffffff',
    cutoff: 10000,
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
  WIZARD_TWEET = 'Wizard Tweet',
}
