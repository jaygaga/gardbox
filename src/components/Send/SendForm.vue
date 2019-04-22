<template>
  <s-card :title="$t('send.form')">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
    >
      <el-form-item prop="denom">
        <el-select
          style="width: 100%"
          v-model="form.denom"
          :placeholder="$t('send.denom')"
        >
          <!-- <el-option
            v-for="i in balance"
            :key="i.denom"
            :label="i.denom | upper"
            :value="i.denom"
          ></el-option> -->
          <el-option
            :key="selectedBalance.denom"
            :label="selectedBalance.denom | upper"
            :value="selectedBalance.denom"
          ></el-option>
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
        Balance: {{selectedBalance.amount}}
        <a @click="setAmountAll">{{$t('send.all')}}</a>
      </div>
      <el-form-item prop="amount">
        <el-input
          v-model="form.amount"
          type="number"
          min="1"
          step="1"
          :placeholder="$t('send.amount')"
          clearable
        ></el-input>
      </el-form-item>
      <div class="fee"><span>{{$t('send.fee')}}</span>0 GARD</div>
    </el-form>

    <el-button
      class="btn-send"
      @click="onSubmit"
    >{{$t('main.send')}}</el-button>

  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

import webc from "@/utils/webc";

export default {
  name: "SendForm",
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateAddr = (rule, value, callback) => {
      if (value.trim() === "") {
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
      if (value <= 0 || value % 1 !== 0) {
        callback(new Error(this.$t("send.amountWarnZero")));
        return;
      }
      if (value > this.selectedBalance.amount) {
        callback(new Error(this.$t("send.amountWarn")));
        return;
      }
      callback();
    };
    return {
      form: {
        denom: "gard",
        amount: "",
        address: "",
        fee: 0
      },
      rules: {
        address: [{ validator: validateAddr, trigger: "blur" }],
        amount: [{ validator: validateAmount, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("account", ["balance"]),
    selectedBalance() {
      const gard = { amount: "0", denom: "gard" };
      return this.balance.find(i => i.denom === this.form.denom) || gard;
    }
  },
  methods: {
    setAmountAll() {
      this.form.amount = this.selectedBalance.amount;
    },
    onSubmit() {
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

