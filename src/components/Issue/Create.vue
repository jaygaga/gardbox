<template>
  <s-card
    :title="$t('issue.create')"
    class="issue-create-card"
  >
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      @submit="onSubmit"
    >
      <p class="sub-title">{{ $t('issue.basic') }}</p>
      <p class="sub-info">{{ $t('issue.basicBrif') }}</p>
      <el-form-item
        prop="name"
        :label="$t('issue.name')"
      >
        <el-input
          v-model="form.name"
          :placeholder="$t('issue.nameEg')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="symbol"
        :label="$t('issue.symbol')"
      >
        <el-input
          v-model="form.symbol"
          :placeholder="$t('issue.symbolEg')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="amount"
        :label="$t('issue.supply')"
      >
        <el-input
          v-model="form.amount"
          type="number"
          min="0"
          step="1"
          :placeholder="$t('issue.supplyEg')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="decimals"
        :label="$t('issue.decimals')"
      >
        <el-select
          v-model="form.decimals"
          style="width: 100%"
        >
          <el-option
            v-for="i in decimalList"
            :key="i"
            :value="i"
          ></el-option>
        </el-select>
      </el-form-item>

      <p class="sub-title">{{ $t('issue.describe') }}</p>
      <p class="sub-info">{{ $t('issue.describeBrif') }}</p>
      <el-form-item
        prop="organization"
        :label="$t('issue.organization')"
      >
        <el-input
          v-model="describe.organization"
          :placeholder="$t('issue.organizationEg')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="website"
        :label="$t('issue.website')"
      >
        <el-input
          v-model="describe.website"
          :placeholder="$t('issue.websiteEg')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="logo"
        :label="$t('issue.logo')"
      >
        <el-input
          v-model="describe.logo"
          :placeholder="$t('issue.logoEg')"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="description"
        :label="$t('issue.description')"
      >
        <el-input
          v-model="describe.description"
          :placeholder="$t('issue.description')"
          clearable
        ></el-input>
      </el-form-item>

      <p class="sub-title">{{ $t('issue.setting') }}</p>
      <p class="sub-info warn">{{ $t('issue.settingBrif') }}</p>
      <el-form-item prop="mint">
        <el-switch
          v-model="form.mint"
          active-color="#13ce66"
          :active-text="$t('issue.mint')"
        ></el-switch>
      </el-form-item>
      <el-form-item prop="freeze">
        <el-switch
          v-model="form.freeze"
          active-color="#13ce66"
          :active-text="$t('issue.freeze')"
        ></el-switch>
      </el-form-item>
      <el-form-item prop="burn">
        <el-switch
          v-model="form.burn"
          active-color="#13ce66"
          :active-text="$t('issue.burn')"
        ></el-switch>
      </el-form-item>
      <el-form-item prop="burnAny">
        <el-switch
          v-model="form.burnAny"
          active-color="#13ce66"
          :active-text="$t('issue.burnAny')"
        ></el-switch>
      </el-form-item>
      <el-form-item prop="burnHolder">
        <el-switch
          v-model="form.burnHolder"
          active-color="#13ce66"
          :active-text="$t('issue.burnHolder')"
        ></el-switch>
      </el-form-item>

      <div class="fee"><span>{{$t('send.fee')}}</span>0 GARD</div>
      <el-button
        class="btn-send"
        native-type=“submit”
        @click="onSubmit"
      >{{$t('issue.create')}}</el-button>
    </el-form>

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
  name: "IssueCreate",
  data() {
    const requireError = name =>
      new Error(this.$t("global.required", { name }));
    const validateName = (rule, value, callback) => {
      if (isEmpty(value)) {
        callback(requireError(this.$t("issue.name")));
        return;
      }
      callback();
    };
    const validateSymbol = (rule, value, callback) => {
      if (isEmpty(value)) {
        callback(requireError(this.$t("issue.symbol")));
        return;
      }
      callback();
    };
    const validateAmount = (rule, value, callback) => {
      if (!value || value.trim() === "") {
        callback(requireError(this.$t("issue.supply")));
        return;
      }
      const input = value - 0;
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
    const decimalList = [];
    for (let i = 0; i < 19; i++) {
      decimalList[decimalList.length] = i;
    }
    return {
      decimalList,
      form: {
        name: "",
        symbol: "",
        amount: "",
        decimals: "18",
        mint: true,
        freeze: true,
        burn: true,
        burnHolder: true,
        burnAny: true
      },
      describe: {
        organization: "",
        website: "",
        logo: "",
        description: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        symbol: [{ validator: validateSymbol, trigger: "blur" }],
        amount: [{ validator: validateAmount, trigger: "blur" }]
      },
      dialogVisible: false,
      loading: false,
      pass: ""
    };
  },
  computed: {},
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
      this.loading = true;
      let res = "";
      try {
        res = await this.$store.dispatch(`issue/create`, {
          pass: this.pass,
          form: this.form,
          describe: this.describe
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
        this.$router.push(`/issue/detail/${get(res, "tags.2.value")}`);
      } else {
        this.$message({
          type: "error",
          message: this.$t(`send.${res}`),
          center: true
        });
      }
      this.loading = false;
    }
  },
  mounted: async function() {}
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
.btn-send {
  margin-top: $padding-basic;
  width: 100%;
  padding: $padding-basic;
}
</style>

