<template>
  <s-card :title="$t('send.confirm')">
    <s-item :label="$t('send.denom')">{{denom}}</s-item>
    <s-item :label="$t('send.address')">{{form.address}}</s-item>
    <s-item :label="$t('send.amount')">{{form.amount}}</s-item>
    <s-item :label="$t('send.fee')">{{form.fee}} {{denom}}</s-item>

    <el-button
      class="btn-send"
      @click="onSubmit"
    >{{$t('main.send')}}</el-button>

    <el-dialog
      :title="$t('create.pass')"
      :visible.sync="dialogVisible"
      width="360px"
      v-loading="loading"
    >
      <el-input
        type="password"
        v-model="pass"
        :placeholder="$t('create.pass')"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">{{$t('global.cancel')}}</el-button>
        <el-button
          type="primary"
          @click="onSend"
        >{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";
import { gardplorerDomain } from "@/constants";

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
    ...mapState("account", ["keyStore"]),
    ...mapState("transactions", ["form"]),
    denom() {
      return this.form.denom && this.form.denom.toUpperCase();
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
      const res = await this.$store.dispatch("transactions/send", params);
      if (res) {
        this.dialogVisible = false;
        this.$store.dispatch("transactions/result", res);
        this.$router.push("/send/finish");
      } else {
        this.$store.dispatch("transactions/result", {});
        this.$message({
          type: "error",
          message: this.$t("send.error"),
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
