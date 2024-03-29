<template>
  <div class="tab-owner">
    <p class="sub-info warn">{{ $t('owner.brif') }}</p>

    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit="onSubmit"
      class="form"
    >
      <el-form-item :label="$t('owner.from')">
        <p class="addr">{{ currentAddress }}</p>
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

      <div class="fee">{{$t('issue.fee')}} ( <span>{{$t('send.balance')}}: </span>{{ gardBalance.amount | formatNumber}} GARD )</div>
      <el-form-item prop="fee">
        <el-input :value="serviceFee"></el-input>
      </el-form-item>
      <div class="gas"><span>{{$t('send.fee')}}</span>0 GARD</div>
    </el-form>

    <el-button
      class="btn"
      native-type=“submit”
      @click="onSubmit"
    >{{$t('issue.tab4')}}</el-button>

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
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";

import { getViewToken } from "@/utils/helpers";
import webc from "@/utils/webc";

const serviceFee = 20000;

export default {
  name: "TabOwner",
  props: {
    setting: Object,
    gardBalance: Object
  },
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateAddr = (rule, value, callback) => {
      if (!value || value.trim() === "") {
        callback(requireError(this.$t("send.address")));
        return;
      }
      if (
        !webc.account.isValidAddress(value) ||
        value === this.currentAddress
      ) {
        callback(this.$t("send.addressWarn"));
        return;
      }
      callback();
    };
    const validateFee = (rule, value, callback) => {
      if (this.gardBalance.amount < serviceFee) {
        callback(new Error(this.$t("issue.feeInsuf")));
        return;
      }
      callback();
    };
    return {
      serviceFee,
      form: {
        address: ""
      },
      rules: {
        fee: [{ validator: validateFee, trigger: "blur" }],
        address: [{ validator: validateAddr, trigger: "submit" }]
      },

      dialogVisible: false,
      pass: ""
    };
  },
  computed: {
    ...mapGetters("account", ["currentAddress"]),
    ...mapState("account", ["mathAccount"])
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
        res = await this.$store.dispatch(`issue/owner`, {
          pass: this.pass,
          form: this.form,
          id: this.$route.params.id
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
          message: this.$t(`issue.closeOk`),
          center: true
        });
        this.$router.push("/issue");
      } else {
        this.$message({
          type: "error",
          message: this.$t(`send.${res}`),
          center: true
        });
      }
      loading.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  width: $xs;
}
.addr {
  font-size: 16px;
}
.sub-title {
  text-align: center;
  margin-top: $padding-large;
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
    margin: 16px 0;
  }
}

.btn {
  width: $xs;
  padding: 16px;
  margin-top: $padding-basic;
}
.switch {
  margin-bottom: 24px;
}

.fee {
  font-size: 14px;
  margin-bottom: 8px;
}
.gas {
  font-size: 14px;
  span {
    margin-right: 16px;
  }
}
</style>

