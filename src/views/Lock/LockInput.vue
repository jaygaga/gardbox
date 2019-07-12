<template>
  <div class="lock-container">
    <div class="lock-title">{{$t('singleTokenAssets.lock')}}</div>
    <div class="lock-line"></div>
    <div class="lock-form">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="0px"
      >
        <el-form-item prop="name">
          <el-input
            v-model="form.name"
            :placeholder="$t('lockInput.boxName')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="denom">
          <el-select
            v-model="form.denom"
            :placeholder="$t('lockInput.currency')"
            style="width:100%;"
          >
            <el-option
              v-for="i in viewBalance"
              :key="i.denom"
              :label="i.label"
              :value="i.denom"
              :disabled="i.label == 'GARD' ? false : true"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop=end_time>
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            value-format="timestamp"
            :placeholder="$t('lockInput.lockTime')"
            style="width:100% !important"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="total_amount">
          <div class="tips">
            <p>{{$t('lockInput.currentBalance')}}: {{ amount }}</p>
            <p @click="allOut">{{$t('lockInput.allOut')}}</p>
          </div>
          <el-input
            v-model="form.total_amount"
            :placeholder="$t('lockInput.lockNumber')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit('form')">{{$t('global.confirm')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
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
        @keyup.enter.native="creatLock(false)"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="creatLock(false)">{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import numeral from "numeral";
import { isEmpty, find } from "lodash";
export default {
  data() {
    return {
      dialogVisible: false,
      pass: "",
      form: {
        name: null,
        denom: null,
        end_time: null,
        total_amount: null
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("global.required", {
              name: this.$t("lockInput.boxName")
            }),
            trigger: "blur"
          }
        ],
        denom: [
          {
            required: true,
            message: this.$t("global.required", {
              name: this.$t("lockInput.lockCurrency")
            }),
            trigger: "change"
          }
        ],
        end_time: [
          {
            required: true,
            message: this.$t("global.required", {
              name: this.$t("lockInput.lockTime")
            }),
            trigger: "blur"
          }
        ],
        total_amount: [
          {
            required: true,
            message: this.$t("global.required", {
              name: this.$t("lockInput.lockNumber")
            }),
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("account", ["balance", "tokenMap", "mathAccount"]),
    viewBalance() {
      const coins = this.balance.filter(
        i => !i.denom.match(/^box.{11}$/) && !i.denom.match(/^box.{13}$/)
      );
      return coins.map(i => {
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
          if (token.denom === "agard") {
            token.amount = BigNumber(token.amount)
              .dividedBy(Math.pow(10, 18))
              .toString();
            token.label = "GARD";
          } else {
            token.label = token.denom.toUpperCase();
          }
        }
        return token;
      });
    },
    amount() {
      const { denom } = this.form;
      return find(this.viewBalance, item => {
        return item.denom == denom;
      }).amount;
    },
    token() {
      const { denom } = this.form;
      if (denom.match(/^coin.{10}$/)) {
        return this.tokenMap[denom];
      }
      return false;
    }
  },
  methods: {
    numeral,
    allOut() {
      this.form.total_amount = this.amount;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // use math wallet
          if (!isEmpty(this.mathAccount)) {
            this.creatLock(true);
            return;
          }
          // else use local wallet
          this.pass = "";
          this.dialogVisible = true;
        } else {
          return false;
        }
      });
    },
    creatLock: async function(useMathWallet) {
      if (!useMathWallet && !this.pass) {
        this.$message({
          type: "error",
          message: this.$t("global.required", { name: this.$t("create.pass") }),
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
      const params = {
        ...this.form,
        pass: this.pass,
        decimals: this.form.denom === "agard" ? 1 : this.token.decimals
      };
      if (this.token) {
        params.total_amount = BigNumber(this.form.total_amount)
          .times(BigNumber(10).pow(this.token.decimals))
          .toFixed();
      }
      if (this.form.denom === "agard") {
        params.total_amount = BigNumber(this.form.total_amount)
          .times(BigNumber(10).pow(18))
          .toFixed();
      }
      let res = "";
      try {
        res = await this.$store.dispatch("lock/creatLock", params);
      } catch (e) {
        this.$store.dispatch("lock/setLockResult", {});
        this.$message({
          type: "error",
          message: this.$t(`send.error`),
          center: true
        });
      }
      if (res.txhash) {
        this.dialogVisible = false;
        this.$store.dispatch("lock/setLockResult", res);
        this.$message({
          type: "success",
          message: this.$t("global.success", {
            name: this.$t("lockInput.lock")
          }),
          center: true,
          duration: 2000,
          onClose: () => {
            this.$router.push({ path: "/Lock/LockList" });
          }
        });
      } else {
        this.$store.dispatch("lock/setLockResult", {});
        this.$message({
          type: "error",
          message: this.$t(`send.${res}`),
          center: true
        });
      }
      loading.close();
    }
  },
  mounted: async function() {
    const balance = await this.$store.dispatch("account/fetchBalance");
    if (isEmpty(balance)) {
      this.form.denom = "";
    } else {
      if (!balance.find(i => i.denom === this.form.denom)) {
        this.form.denom = balance[0].denom;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.lock-container {
  width: 50%;
  margin: 0 auto;
  text-align: center;
  > .lock-title {
    font-size: 18px;
    font-weight: bolder;
    letter-spacing: 5px;
    margin-bottom: 10px;
  }
  > .lock-line {
    width: 50px;
    height: 2px;
    background: white;
    margin: 0 auto 50px;
  }
  > .lock-form {
    width: 80%;
    margin: 0 auto;
    .el-button {
      width: 100%;
      color: rgb(30, 86, 184);
    }
    .tips {
      display: flex;
      justify-content: space-between;
      > p:first-child {
        color: rgba(255, 255, 255, 0.6);
      }
      > p:last-child {
        cursor: pointer;
      }
    }
  }
}
@include responsive($sm) {
  .lock-container {
    width: 80%;
    > .lock-form {
      width: 100%;
    }
  }
}
</style>

