<template>
  <s-card
    :title="$t(`mint.${$route.query.action}`) + ' ' + detail.symbol + ' (' + detail.name + ')'"
    class="issue-mint-card"
  >
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit="onSubmit"
    >
      <el-form-item
        prop="amount"
        :label="$t('send.amount')"
      >
        <el-input
          v-model="form.amount"
          :placeholder="$t('send.amount')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="address"
        :label="$t('mint.address')"
      >
        <el-input
          v-model="form.address"
          :placeholder="$t('mint.address')"
          clearable
        ></el-input>
      </el-form-item>

      <div class="fee"><span>{{$t('send.fee')}}</span>0 GARD</div>
      <el-button
        class="btn-send"
        native-type=“submit”
        @click="onSubmit"
      >{{$t(`mint.${$route.query.action}`)}}</el-button>
    </el-form>

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
      <span slot="footer">
        <el-button @click="onSend">{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";

import { getViewToken } from "@/utils/helpers";
import webc from "@/utils/webc";

export default {
  name: "IssueMint",
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateAddr = (rule, value, callback) => {
      if (!value || value.trim() === "") {
        callback(requireError(this.$t("send.address")));
        return;
      }
      if (!webc.account.isValidAddress(value)) {
        callback(this.$t("send.addressWarn"));
        return;
      }
      callback();
    };
    const validateAmount = (rule, value, callback) => {
      const input = value - 0;
      if (input <= 0) {
        callback(new Error(this.$t("send.amountWarnPositive")));
        return;
      }
      const decimal = BigNumber(0.1).pow(this.detail.decimals);
      if (
        BigNumber(input)
          .modulo(decimal)
          .toNumber() !== 0
      ) {
        callback(new Error(this.$t("send.amountWarnInvalid")));
        return;
      }
      callback();
    };
    return {
      form: {
        amount: "",
        address: ""
      },
      rules: {
        address: [{ validator: validateAddr, trigger: "blur" }],
        amount: [{ validator: validateAmount, trigger: "blur" }]
      },
      dialogVisible: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("issue", ["tokenMap"]),
    ...mapGetters("account", ["currentAddress", "mathAccount"]),
    detail() {
      return this.tokenMap[this.$route.params.id] || {};
    }
  },
  methods: {
    get,
    onSubmit(e) {
      e.preventDefault();
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
        // use math wallet
        if (!isEmpty(this.mathAccount)) {
          this.onSend(true);
          return;
        }
        // else use local wallet
        this.pass = "";
        this.dialogVisible = true;
      });
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
      let res = "";
      try {
        res = await this.$store.dispatch(`issue/mint`, {
          pass: this.pass,
          form: this.form,
          id: this.$route.params.id,
          action: this.$route.query.action
        });
      } catch (e) {
        this.$message({
          type: "error",
          message: this.$t(`send.error`),
          center: true
        });
      }
      if (res.txhash) {
        this.dialogVisible = false;
        this.$message({
          type: "success",
          message: this.$t("global.success", {
            name: this.$t(`mint.${this.$route.query.action}`)
          }),
          center: true
        });
        this.$router.back();
      } else {
        this.$message({
          type: "error",
          message: this.$t(`send.${res}`),
          center: true
        });
      }
      loading.close();
    }
  },
  mounted() {
    this.form.address = this.currentAddress;
    this.$store.dispatch("issue/fetchToken", this.$route.params.id);
  }
};
</script>

<style lang="scss" scoped>
.btn-send {
  margin-top: $padding-basic;
  width: 100%;
  padding: $padding-basic;
}
.sub-title {
  text-align: center;
  margin-top: 24px;
  margin-bottom: 8px;
}
.sub-info {
  font-size: 14px;
  background: $color-background-card;
  border-radius: 4px;
  padding: 16px;

  &.warn {
    background: rgba(255, 219, 126, 1);
    color: #996802;
    margin-bottom: 16px;
  }
}

.fee {
  span {
    margin-right: 16px;
  }
}
</style>

