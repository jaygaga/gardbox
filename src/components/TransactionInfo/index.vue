<template>
  <s-page class="tx-container">
    <s-card :title="$t('main.txInfo')">
      <s-item :label="$t('send.amount')">{{tx | amountGard}} GARD</s-item>
      <s-item :label="$t('send.sender')">{{get(tx, 'tags.1.value')}}</s-item>
      <s-item :label="$t('send.address')">{{get(tx, 'tags.2.value')}}</s-item>
      <s-item :label="$t('send.fee')">{{get(tx, 'tx.value.fee.amount.0.amount') || '0'}} GARD</s-item>
      <s-item :label="$t('send.txHash')">{{get(tx, 'txhash')}}</s-item>
      <s-item :label="$t('send.block')">{{get(tx, 'height')}}</s-item>
      <s-item :label="$t('send.time')">{{get(blocks, `${get(tx, 'height')}.block.header.time`) | formatTime}}</s-item>
    </s-card>
  </s-page>
</template>

<script>
import { mapState } from "vuex";
import { get } from "lodash";
import moment from "dayjs";

export default {
  name: "TxInfo",
  computed: {
    ...mapState("transactions", ["blocks", "txInfo"]),
    tx() {
      return this.txInfo[this.$route.params.id];
    }
  },
  methods: {
    get,
    moment
  },
  beforeMount() {
    console.log("mont");
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

