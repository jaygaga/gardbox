<template>
  <s-card
    :title="$t('issue.modify')"
    class="issue-modify-card"
  >
    <el-form
      ref="form"
      label-position="top"
      :model="describe"
      :rules="rules"
      @submit="onSubmit"
    >
      <el-form-item
        prop="org"
        :label="$t('issue.org')"
      >
        <el-input
          v-model="describe.org"
          :placeholder="$t('issue.orgEg')"
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
        prop="intro"
        :label="$t('issue.intro')"
      >
        <el-input
          type="textarea"
          :rows="3"
          v-model="describe.intro"
          :placeholder="$t('issue.intro')"
          clearable
        ></el-input>
      </el-form-item>

      <div class="fee">{{$t('issue.fee')}} ( <span>{{$t('send.balance')}}: </span>{{ gardBalance.amount | formatNumber}} GARD )</div>
      <el-form-item prop="fee">
        <el-input :value="serviceFee"></el-input>
      </el-form-item>
      <div class="gas"><span>{{$t('send.fee')}}</span>0 GARD</div>
      <el-button
        class="btn-send"
        native-type=“submit”
        @click="onSubmit"
      >{{$t('issue.modify')}}</el-button>
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
import { get, isEmpty } from "lodash";

import { getViewToken, getStringLength } from "@/utils/helpers";
import webc from "@/utils/webc";

const serviceFee = 4000;

export default {
  name: "IssueModify",
  data() {
    const validateDescribe = (value, callback, length) => {
      const len = getStringLength(value);
      if (len > length) {
        callback(new Error(this.$t("issue.lengthInvalid")));
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
      describe: {
        org: "",
        website: "",
        logo: "",
        intro: ""
      },
      rules: {
        org: [
          {
            validator: (r, v, cb) => validateDescribe(v, cb, 124),
            trigger: "blur"
          }
        ],
        website: [
          {
            validator: (r, v, cb) => validateDescribe(v, cb, 64),
            trigger: "blur"
          }
        ],
        logo: [
          {
            validator: (r, v, cb) => validateDescribe(v, cb, 124),
            trigger: "blur"
          }
        ],
        intro: [
          {
            validator: (r, v, cb) => validateDescribe(v, cb, 712),
            trigger: "blur"
          }
        ],
        fee: [{ validator: validateFee, trigger: "blur" }]
      },
      dialogVisible: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("account", ["mathAccount"]),
    ...mapState("issue", ["tokenMap"]),
    ...mapGetters("account", ["gardBalance"]),
    detail() {
      return this.tokenMap[this.$route.params.id];
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
        res = await this.$store.dispatch(`issue/modify`, {
          pass: this.pass,
          describe: this.describe,
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
  mounted: async function() {
    this.$store.dispatch("account/fetchBalance");
    await this.$store.dispatch("issue/fetchToken", this.$route.params.id);
    if (this.detail.description) {
      this.describe = { ...JSON.parse(this.detail.description) };
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

