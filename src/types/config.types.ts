/**
 * Application Config
 */
export interface AppConfig {
  bot: BotConfig;
  ethereum: EthereumConfig;
  wizards: WizardsConfig;
  discord: DiscordConfig;
  twitter: TwitterConfig;
}

/**
 * Bot config options
 */
export interface BotConfig {
  salesCheckCron: string;
  salesLookbackSeconds: number;
  openSeaApiKey: string;
}

/**
 * Ethereum node config options
 */
export interface EthereumConfig {
  url: string;
  network: string;
}

/**
 * Wizards configuration
 */
export interface WizardsConfig {
  tokenContract: string;
  openSeaSlug: string;
  openSeaFlameSlug: string;
  ipfsBaseURI: string;
  openSeaBaseURI: string;
}

/**
 * Discord configuration
 */
export interface DiscordConfig {
  token: string;
  salesChannelIds: Array<string>;
  prefix: string;
}

/**
 * Twitter api credentials
 */
export interface TwitterConfig {
  consumerKey: string;
  consumerSecret: string;
  accessTokenKey: string;
  accessTokenSecret: string;
}
