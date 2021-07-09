/**
 * Application Config
 */
export interface AppConfig {
  ethereum: EthereumConfig;
  wizards: WizardsConfig;
  discord: DiscordConfig;
  twitter: TwitterConfig;
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
  ipfsBaseURI: string;
  openSeaBaseURI: string;
}

/**
 * Discord configuration
 */
export interface DiscordConfig {
  token: string;
  salesChannelId?: string;
  tradingChannelId?: string;
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
