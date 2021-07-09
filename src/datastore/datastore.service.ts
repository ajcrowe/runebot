import { Injectable, Logger } from '@nestjs/common';
import { RarityConfig, Wizard, WizardBackground, rarityRegistry } from '../types';
import { AppConfigService } from '../config';
import { EmbedFieldData } from 'discord.js';
import data from '../wizard-summary.json';

@Injectable()
export class DataStoreService {
  private readonly _logger = new Logger(DataStoreService.name);

  get name(): string {
    return 'DataStoreService';
  }

  constructor(protected readonly configService: AppConfigService) {}

  /*
   * Get Wizard by ID
   */
  public async getWizard(id: string): Promise<Wizard> {
    try {
      const wizardJson = data.wizards[id], traits = [];
      let color: string;
      for (const trait of wizardJson.traits) {
        const [ name, value ] = trait.split(': ', 2);
        if (name === 'background') {
          color = WizardBackground[value]
        }
        traits.push({
          name: name.charAt(0).toUpperCase() + name.substring(1),
          value: value,
          rarity: data.traitOccurences[trait],
        })
      }
      return {
        name: wizardJson.name,
        serial: id,
        nameLength: wizardJson.nameLength,
        traits: traits,
        traitCount: wizardJson.traitCount,
        backgroundColor: color,
        maxAffinity: wizardJson.maxAffinity,
        affinities: wizardJson.affinities,
      }
    }  
    catch (error) {
      this._logger.error(error);
    }
  }

  /*
   * Get wizard fields for discord embed message
   */
  public getWizardFields(wizard: Wizard): EmbedFieldData[] {
    const fields = [];

    // this is ugly
    let rarity = data.traitCounts[wizard.traitCount];
    let rarityName = this.getRarityConfig(rarity).name;
    fields.push({
      name: `${rarityName} Traits`,
      value: `${wizard.traitCount} (${(rarity / 100)}%)`,
      inline: true,
    });

    rarity = data.nameLengths[wizard.nameLength];
    rarityName = this.getRarityConfig(rarity).name;
    fields.push({
      name: `${rarityName} Name Length`,
      value: `${wizard.nameLength} (${(rarity / 100)}%)`,
      inline: true,
    });

    rarity = data.affinityOccurences[wizard.maxAffinity];
    rarityName = this.getRarityConfig(rarity).name;
    fields.push({
      name: `${rarityName} Affinity`,
      value: `${wizard.maxAffinity} (${(rarity / 100)}%)`,
      inline: true,
    });

    fields.push({
      name: `Traits With Affinity`,
      value: `${wizard.affinities[wizard.maxAffinity]}/${wizard.traitCount - 1}`,
      inline: true,
    });

    for (const trait of wizard.traits) {
      fields.push({
        name: `${this.getRarityConfig(trait.rarity).name} ${trait.name}`,
        value: `${trait.value} (${trait.rarity / 100}%)`,
        inline: true,
      })
    }
    return fields
  }

  /*
   * Get rarity config for specific trait
   */
  public getRarityConfig(rarity: number): RarityConfig {
    const rarityConfigs: RarityConfig[] = Object.values(rarityRegistry);
    for (const config of rarityConfigs) {
      if (config.cutoff >= rarity) {
        return config;
      }
    }
    return rarityRegistry.common;
  }
}
