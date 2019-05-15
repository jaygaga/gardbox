<template>
  <s-card :title="$t('send.form')">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit="onSubmit"
    >
      <el-form-item prop="denom">
        <el-select
          style="width: 100%"
          v-model="form.denom"
          :placeholder="$t('send.denom')"
        >
          <el-option
            v-for="i in viewBalance"
            :key="i.denom"
            :label="i.label"
            :value="i.denom"
          ></el-option>
          <!-- <el-option
            :key="selectedBalance.denom"
            :label="selectedBalance.denom | upper"
            :value="selectedBalance.denom"
          ></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item prop="address">
        <el-input
          v-model="form.address"
          :placeholder="$t('send.address')"
          clearable
        ></el-input>
      </el-form-item>
      <div class="row-balance">
        Balance: {{ selectedBalance.amount | formatNumber }}
        <a @click="setAmountAll">{{$t('send.all')}}</a>
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
      >{{$t('main.send')}}</el-button>
    </el-form>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";

import webc from "@/utils/webc";

export default {
  name: "SendForm",
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
      const balance = this.selectedBalance.amount - 0;
      if (input <= 0) {
        callback(new Error(this.$t("send.amountWarnPositive")));
        return;
      }
      if (input > balance) {
        callback(new Error(this.$t("send.amountWarn")));
        return;
      }

      let decimal = 1;
      const token = this.tokenMap[this.form.denom];
      if (!isEmpty(token)) {
        decimal = BigNumber(0.1).pow(token.decimals);
      }
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
      rules: {
        address: [{ validator: validateAddr, trigger: "blur" }],
        amount: [{ validator: validateAmount, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("account", ["balance", "tokenMap"]),
    ...mapState("transactions", ["form"]),
    viewBalance() {
      return this.balance.map(i => {
        const token = { ...i };
        if (token.denom.match(/^coin.{10}$/)) {
          const detail = this.tokenMap[token.denom];
          if (!isEmpty(detail)) {
            token.label = `${detail.symbol} (${detail.issue_id})`;
            token.amount = BigNumber(token.amount)
              .dividedBy(Math.pow(10, detail.decimals))
              .toString();
          }
        } else {
          token.label = token.denom.toUpperCase();
        }
        return token;
      });
    },
    selectedBalance() {
      const gard = { amount: "0", denom: "gard" };
      return this.viewBalance.find(i => i.denom === this.form.denom) || gard;
    }
  },
  methods: {
    setAmountAll() {
      this.form.amount = this.selectedBalance.amount;
    },
    onSubmit(e) {
      e.preventDefault();
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
        this.$store.dispatch("transactions/input", this.form);
        this.$router.push("/send/confirm");
      });
    }
  },
  mounted() {
    this.$store.dispatch("account/fetchBalance");
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

