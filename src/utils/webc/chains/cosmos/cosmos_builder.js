'use strict';
const Builder = require('../../builder').Builder;
const Old = require('old');
const Bank = require('./bank');
const Stake = require('./stake');
const Distribution = require('./distribution');
const Issue = require('./issue');
const CosmosKeypair = require('./cosmos_keypair');
const Codec = require('../../util/codec');
const Config = require('../../config');
const StdTx = require('./stdTx');

class CosmosBuilder extends Builder {
    /**
     * 构造签名内容
     *
     * @param tx  请求内容
     * @returns {StdTx}
     */
    buildTx(tx) {
        let req = super.buildParam(tx);
        let msgs = [];
        switch (req.type) {
            case Config.cosmos.tx.transfer.type: {
                msgs[msgs.length] = Bank.create(req);
                break;
            }
            case Config.cosmos.tx.delegate.type: {
                msgs[msgs.length] = Stake.createMsgDelegate(req);
                break;
            }
            case Config.cosmos.tx.undelegate.type: {
                msgs[msgs.length] = Stake.createMsgUndelegate(req);
                break;
            }
            case Config.cosmos.tx.beginRedelegate.type: {
                msgs[msgs.length] = Stake.createMsgBeginRedelegate(req);
                break;
            }
            case Config.cosmos.tx.setWithdrawAddress.type: {
                msgs[msgs.length] = Distribution.CreateMsgSetWithdrawAddress(req);
                break;
            }
            case Config.cosmos.tx.withdrawDelegatorReward.type: {
                msgs[msgs.length] = Distribution.CreateMsgWithdrawDelegatorReward(req);
                break;
            }
            case Config.cosmos.tx.withdrawDelegatorRewardsAll.type: {
                msgs = Distribution.CreateMsgWithdrawDelegatorRewardsAll(req);
                break;
            }
            case Config.cosmos.tx.withdrawValidatorCommission.type: {
                msgs[msgs.length] = Distribution.CreateMsgWithdrawValidatorCommission(req);
                break;
            }
            case 'issue': {
                msgs[msgs.length] = Issue.CreateMsgIssue(req);
                break;
            }
            default: {
                throw new Error('not exist tx type');
            }
        }
        return StdTx.create(req, msgs);
    }

    /**
     * 签名交易数据
     *
     * @param data
     * @param privateKey
     * @returns {}
     */
    sign(data, privateKey) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        let signbyte = CosmosKeypair.sign(privateKey, data);
        let keypair = CosmosKeypair.import(privateKey);

        return {
            pub_key: Codec.Hex.hexToBytes(keypair.publicKey),
            signature: signbyte
        };
    }

    /**
     * (热钱包)
     *
     * 根据请求内容构造交易并对交易进行签名
     *
     * @param tx  请求内容
     * @param privateKey 发送方账户私钥
     * @returns {StdTx}  交易
     */
    buildAndSignTx(tx, privateKey) {
        let stdTx = this.buildTx(tx);
        let signature;
        signature = this.sign(stdTx.GetSignBytes(), privateKey);
        stdTx.SetSignature(signature);
        return stdTx;
    }
}
module.exports = Old(CosmosBuilder);
