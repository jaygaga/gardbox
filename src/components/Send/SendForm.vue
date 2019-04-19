<template>
  <s-card :title="$t('send.form')">
    <el-form
      ref="form"
      label-position="top"
      :model="form"
    >
      <el-form-item
        prop="denom"
        required
      >
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
      <el-form-item
        prop="address"
        required
      >
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
      <el-form-item
        prop="amount"
        required
      >
        <el-input
          v-model="form.amount"
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

export default {
  name: "SendForm",
  data() {
    return {
      form: {
        denom: "gard",
        amount: "",
        address: "",
        fee: 0
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
      this.form.amount = this.balance;
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

