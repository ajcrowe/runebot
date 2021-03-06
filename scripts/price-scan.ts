import data from '../src/wizard-summary.json';
import fetch from 'node-fetch';
import 'cross-fetch/polyfill';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const limit = 10000000000000000000;

async function checkVaultIds(ids: Array<number>) {
  for (const idx of ids) {
    const wizard = data.wizards[idx];
    if (wizard.maxAffinityCount === 1) {
      console.log(`${idx} 5/5 in vault!`);
    }
    if (wizard.affinities[wizard.maxAffinity] === wizard.traitCount - 1) {
      if (wizard.traitCount == 5) {
        console.log(`${idx} 4/4 in vault!`);
      }
      if (wizard.traitCount == 4) {
        console.log(`${idx} 3/3 in vault!`);
      }
    }
    if (wizard.nameLength == 1) {
      console.log(`${idx} 1 name in vault!`);
    }
    if (wizard.nameLength == 2) {
      console.log(`${idx} 2 name in vault!`);
    }
  }
}

async function getMaxAff() {
  const ids = [];
  for (const idx in data.wizards) {
    const wizard = data.wizards[idx];
    if (wizard.maxAffinityCount === 1) {
      ids.push(idx);
    }
  }
  await getPrices(ids);
}

async function getNames(length = 1) {
  const ids = [];
  for (const idx in data.wizards) {
    const wizard = data.wizards[idx];
    if (wizard.nameLength == length) {
      ids.push(idx);
    }
  }
  await getPrices(ids);
}

async function get100Aff(traits = 5) {
  const ids = [];
  for (const idx in data.wizards) {
    const wizard = data.wizards[idx];
    if (wizard.affinities[wizard.maxAffinity] === wizard.traitCount - 1) {
      if (wizard.traitCount == traits) {
        ids.push(idx);
      }
    }
  }
  await getPrices(ids);
}

async function getPrices(ids: number[]) {
  for (const id of ids) {
    const url = `https://api.opensea.io/api/v1/assets?token_ids=${id}&order_direction=desc&offset=0&limit=1&collection=forgottenruneswizardscult`;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-KEY': process.env.OPENSEA_API_KEY,
      }
    };
    try {
      const response = await fetch(url, options);
      const osWiz = (await response.json()).assets[0];
      if (osWiz.sell_orders) {
        for (const order of osWiz.sell_orders) {
          if (order.current_price <= limit) {
            console.log(`${(order.current_price / 1000000000000000000).toFixed(2)} https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/${id}`)
          }
        }
      }
    } catch(error) {
      console.log(`${id} ${error}`);
    } finally {
      await delay(1000);
    }
  }
}

async function getVaultTokens() {
  const ids = [];
  const url = `https://api.thegraph.com/subgraphs/name/nftx-project/nftx-v2`;
  const query = `
    query {
      vault(id:"0x87931e7ad81914e7898d07c68f145fc0a553d8fb") {
        holdings (first: 1000) {
          tokenId
        }
      }
    }
  `
  const client = new ApolloClient({
    uri: url,
    cache: new InMemoryCache()
  });
  try {
    const response = await client.query({
      query: gql(query)
    })
    for (const wiz of response.data.vault.holdings) {
      ids.push(wiz.tokenId);
    }
  } catch(error) {
    console.log(error);
  }
  checkVaultIds(ids);
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

async function main() {
  await getVaultTokens();
  console.log(`getting max affinity prices`);
  await getMaxAff();
  console.log(`getting 4/4 affinity prices`);
  await get100Aff(5);
  //console.log(`getting 3/3 affinity prices`);
  //await get100Aff(4);
  //console.log(`getting 1 name prices`);
  //await getNames(1);
  console.log(`getting 2 name prices`);
  await getNames(2);
  console.log(`getting 3 name prices`);
  await getNames(3);
}

main()

