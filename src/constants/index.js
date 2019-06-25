import { en, zh } from './lang';
import { txFieldsMap } from './txFieldsMap';

const apiDomain = 'https://node.hashgard.com/';
let baseURL = `${apiDomain}testnet/api`;
const gardplorerDomain = 'https://www.gardplorer.io/';
// use dev api
// if (!location.hostname.match('wallet.hashgard.io')) {
//   baseURL = `http://api.hgdev.io`;
// }

export { en, zh, gardplorerDomain, baseURL, txFieldsMap };
