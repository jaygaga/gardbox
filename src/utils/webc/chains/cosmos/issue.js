const Amino = require('../base');
const Utils = require('../../util/utils');
const Config = require('../../config');

function MsgIssue(properties) {
    if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
}
MsgIssue.prototype.type = Config.cosmos.tx.issue.prefix;
MsgIssue.prototype.GetSignBytes = function() {
    let sortMsg = Utils.sortObjectKeys({ ...this });
    return Amino.MarshalJSON(this.type, sortMsg);
};

MsgIssue.prototype.ValidateBasic = function() {
    if (Utils.isEmpty(this.CoinIssueInfo)) {
        throw new Error('CoinIssueInfo is  empty');
    }
};

MsgIssue.prototype.GetMsg = function() {
    return { ...this };
};

module.exports = class Issue {
    static CreateMsgIssue(req) {
        return new MsgIssue({ ...req.msg });
    }
};
