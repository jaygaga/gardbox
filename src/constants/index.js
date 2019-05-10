import { menu } from './menu';
import { en, zh } from './lang';
import { txFieldsMap } from './txFieldsMap';

const gardplorerDomain = 'https://www.gardplorer.io/';
let baseURL = `${gardplorerDomain}testnet/api`;
// use dev api
if (!location.hostname.match('wallet.hashgard.io')) {
  baseURL = `http://api.hgdev.io`;
}

export { en, zh, gardplorerDomain, baseURL, txFieldsMap, menu };
