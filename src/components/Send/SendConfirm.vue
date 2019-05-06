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
      v-loading="loading"
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
import { get } from "lodash";

export default {
  name: "Send",
  data() {
    return {
      dialogVisible: false,
      loading: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("account", ["keyStore", "tokenMap"]),
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
      return this.form.denom.toUpperCase();
    }
  },
  methods: {
    onSubmit: async function() {
      this.dialogVisible = true;
    },
    onSend: async function() {
      if (!this.pass) {
        this.$message({
          type: "error",
          message: $t("global.required", { name: $t("create.pass") }),
          center: true
        });
        return false;
      }
      this.loading = true;
      const params = { ...this.form, pass: this.pass, keyStore: this.keyStore };
      // fix token amount by token decimals
      if (this.token) {
        params.amount = BigNumber(params.amount).times(
          BigNumber(10).pow(this.token.decimals)
        );
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
      this.loading = false;
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

