<template>
  <s-card :title="$t('send.confirm')">
    <s-item :label="$t('send.denom')">{{denom}}</s-item>
    <s-item :label="$t('send.address')">{{form.address}}</s-item>
    <s-item :label="$t('send.amount')">{{form.amount | formatNumber}}</s-item>
    <s-item :label="$t('send.fee')">{{form.fee}} GARD</s-item>

    <el-button
      class="btn-send"
      @click="onSubmit"
    >{{$t('main.send')}}</el-button>

    <el-dialog
      :title="$t('create.pass')"
      :visible.sync="dialogVisible"
      width="360px"
      :close-on-click-modal="false"
    >
      <el-input
        type="password"
        v-model="pass"
        :placeholder="$t('create.pass')"
        @keyup.enter.native="onSend"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="onSend">{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";

export default {
  name: "Confirm",
  data() {
    return {
      dialogVisible: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("account", ["tokenMap", "mathAccount"]),
    ...mapState("transactions", ["form"]),
    token() {
      const { denom } = this.form;
      if (denom.match(/^coin.{10}$/)) {
        return this.tokenMap[denom];
      }
      return false;
    },
    denom() {
      if (this.token) {
        return this.token.symbol;
      }
      if (this.form.denom === "agard") {
        return "GARD";
      }
      return this.form.denom.toUpperCase();
    }
  },
  methods: {
    onSubmit: async function() {
      // use math wallet
      if (!isEmpty(this.mathAccount)) {
        this.onSend(true);
        return;
      }
      // else use local wallet
      this.pass = "";
      this.dialogVisible = true;
    },
    onSend: async function(useMathWallet) {
      if (!useMathWallet && !this.pass) {
        this.$message({
          type: "error",
          message: $t("global.required", { name: $t("create.pass") }),
          center: true
        });
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const params = { ...this.form, pass: this.pass };
      // fix token amount by token decimals
      if (this.token) {
        params.amount = BigNumber(this.form.amount)
          .times(BigNumber(10).pow(this.token.decimals))
          .toFixed();
      }
      if (this.form.denom === "agard") {
        params.amount = BigNumber(this.form.amount)
          .times(BigNumber(10).pow(18))
          .toFixed();
      }
      let res = "";
      try {
        res = await this.$store.dispatch("transactions/send", params);
      } catch (e) {
        this.$store.dispatch("transactions/result", {});
        this.$message({
          type: "error",
          message: this.$t(`send.error`),
          center: true
        });
      }
      if (res.txhash) {
        this.dialogVisible = false;
        this.$store.dispatch("transactions/result", res);
        this.$router.push("/send/finish");
      } else {
        this.$store.dispatch("transactions/result", {});
        this.$message({
          type: "error",
          message: this.$t(`send.${res}`),
          center: true
        });
      }
      loading.close();
    }
  },
  beforeMount() {
    if (!this.form.denom) {
      this.$router.push("/send/form");
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-send {
  margin-top: $padding-basic;
  width: 100%;
  padding: $padding-basic;
}
</style>

