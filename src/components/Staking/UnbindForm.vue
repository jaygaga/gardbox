<template>
  <s-card :title="$t('staking.unbind')">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit="onSubmit"
    >
      <el-form-item prop="validator">
        <el-input
          :value="get(fromValidator, 'description.moniker')"
          :placeholder="$t('staking.fromValidator')"
        ></el-input>
      </el-form-item>
      <div class="row-balance">
        Total: {{ viewBalance.shares | formatNumber }} GARD
        <a @click="setAmountAll">{{$t('staking.unbindAll')}}</a>
      </div>
      <el-form-item prop="amount">
        <el-input
          v-model="form.amount"
          type="number"
          min="0"
          step="1"
          :placeholder="$t('send.amount')"
          clearable
        ></el-input>
      </el-form-item>
      <div class="fee"><span>{{$t('send.fee')}}</span>0 GARD</div>

      <el-button
        class="btn-send"
        native-type=“submit”
        @click="onSubmit"
      >{{$t('staking.unbind')}}</el-button>
    </el-form>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";

import webc from "@/utils/webc";

export default {
  name: "UnbindForm",
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateAmount = (rule, value, callback) => {
      if (!value || value.trim() === "") {
        callback(requireError(this.$t("send.amount")));
        return;
      }
      const input = value - 0;
      const balance = this.viewBalance.shares - 0;
      if (input <= 0) {
        callback(new Error(this.$t("send.amountWarnPositive")));
        return;
      }
      if (input > balance) {
        callback(new Error(this.$t("send.amountWarn")));
        return;
      }
      if (
        BigNumber(input)
          .modulo(1)
          .toNumber() !== 0
      ) {
        callback(new Error(this.$t("send.amountWarnInvalid")));
        return;
      }
      callback();
    };
    return {
      rules: {
        amount: [{ validator: validateAmount, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("staking", [
      "validatorMap",
      "delegationMap",
      "form",
      "fromValidator"
    ]),
    viewBalance() {
      const total = this.delegationMap[this.$route.query.from];
      return total || {};
    }
  },
  methods: {
    get,
    setAmountAll() {
      this.$store.dispatch("staking/setForm", {
        ...this.form,
        amount: this.viewBalance.shares - 0
      });
    },
    onSubmit(e) {
      e.preventDefault();
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
        const { from } = this.$route.query;
        this.$router.push(`/staking/confirm?action=unbind&from=${from}`);
      });
    }
  },
  mounted: async function() {
    const { from } = this.$route.query;
    isEmpty(this.validatorMap[from]) &&
      (await this.$store.dispatch("staking/fetchValidators"));
    this.$store.dispatch("staking/setFromValidator", this.validatorMap[from]);
    this.$store.dispatch("staking/setToValidator", {});
    this.$store.dispatch("staking/fetchDelegation", from);
  }
};
</script>

<style lang="scss" scoped>
.row-balance {
  a {
    cursor: pointer;
    float: right;
  }
}

.fee {
  span {
    margin-right: 16px;
  }
}

.btn-send {
  margin-top: $padding-basic;
  width: 100%;
  padding: $padding-basic;
}
</style>

