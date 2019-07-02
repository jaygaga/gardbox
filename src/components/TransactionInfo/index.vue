<template>
  <s-page class="tx-container">
    <s-card :title="$t('main.txInfo')">
      <s-item :label="$t('send.amount')">
        <div>
          <p
            v-for="(token, i) in viewTokens"
            :key="i"
          >{{token.amount}} {{token.denom}}</p>
        </div>
      </s-item>
      <s-item :label="$t('send.sender')">{{get(tx, 'tags.1.value')}}</s-item>
      <s-item :label="$t('send.address')">{{get(tx, 'tags.2.value')}}</s-item>
      <s-item :label="$t('send.fee')">{{get(tx, 'tx.value.fee.amount.0.amount') || '0'}} GARD</s-item>
      <s-item :label="$t('send.txHash')">{{get(tx, 'txhash')}}</s-item>
      <s-item :label="$t('send.block')">{{get(tx, 'height')}}</s-item>
      <s-item :label="$t('send.time')">{{get(tx, `timestamp`) | formatTime}}</s-item>
    </s-card>
  </s-page>
</template>

<script>
import { mapState } from "vuex";
import { get } from "lodash";
import moment from "dayjs";
import { getViewToken } from "@/utils/helpers";

export default {
  name: "TxInfo",
  computed: {
    ...mapState("transactions", ["txInfo"]),
    ...mapState("account", ["tokenMap"]),
    tx() {
      return this.txInfo[this.$route.params.id];
    },
    viewTokens() {
      const tokens = get(this.tx, "tx.value.msg.0.value.amount");
      return tokens ? tokens.map(t => getViewToken(t, this.tokenMap)) : [];
    }
  },
  methods: {
    get,
    moment
  },
  beforeMount() {
    this.$store.dispatch("transactions/fetchTxInfo", this.$route.params.id);
  }
};
</script>

<style lang="scss" scoped>
.tx-container {
  margin: 0 auto;
  padding: $padding-large;
}
</style>

