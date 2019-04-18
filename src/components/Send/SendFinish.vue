<template>
  <s-card :title="$t('send.finish')">
    <s-item :label="$t('send.amount')">{{form.amount}} {{denom}}</s-item>
    <s-item :label="$t('send.sender')">{{get(result, 'tags.1.value')}}</s-item>
    <s-item :label="$t('send.address')">{{get(result, 'tags.2.value')}}</s-item>
    <s-item :label="$t('send.fee')">{{form.fee}} {{denom}}</s-item>
    <s-item :label="$t('send.txHash')">{{get(result, 'txhash')}}</s-item>
    <s-item :label="$t('send.block')">{{get(result, 'height')}}</s-item>
    <s-item :label="$t('send.time')">{{get(result, 'block.header.time') | formatTime}}</s-item>

    <div class="btns">
      <router-link
        class="btn-again"
        to="/send/form"
      >
        <el-button>{{$t('send.again')}}</el-button>
      </router-link>
      <router-link
        class="btn-back"
        to="/main?tab=txs"
      >
        <el-button>{{$t('send.back')}}</el-button>
      </router-link>
    </div>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";
import moment from "dayjs";

export default {
  name: "Send",
  data() {
    return {};
  },
  computed: {
    ...mapState("transactions", ["form", "result"]),
    denom() {
      return this.form.denom && this.form.denom.toUpperCase();
    }
  },
  methods: {
    get,
    moment
  }
};
</script>

<style lang="scss" scoped>
.btns {
  display: flex;
  .btn-again {
    margin-right: 16px;
    flex-grow: 1;
    button {
      padding: $padding-basic;
      width: 100%;
    }
  }
  .btn-back {
    margin-left: 16px;
    flex-grow: 1;
    button {
      padding: $padding-basic;
      width: 100%;
    }
  }
}
</style>

