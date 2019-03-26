import Irisnet from '@/utils/crypto';
const account = Irisnet.getCrypto('cosmos');
const tx = Irisnet.getBuilder('cosmos');

export default { account, tx };
