<template>
  <s-card
    :title="$t('issue.detail')"
    class="issue-detail-card"
  >
    <p class="sub-title">{{ $t('issue.basic') }}</p>
    <s-item :label="$t('issue.name')">{{ get(detail, 'name') }}</s-item>
    <s-item :label="$t('issue.symbol')">{{ get(detail, 'symbol') }}</s-item>
    <s-item :label="$t('issue.supply')">{{ get(supply, 'amount') | formatNumber }}</s-item>
    <s-item :label="$t('issue.decimals')">{{ get(detail, 'decimals') }}</s-item>

    <p class="sub-title">{{ $t('issue.describe') }}</p>
    <s-item :label="$t('issue.organization')">{{ get(describe, 'name') || '-' }}</s-item>
    <s-item :label="$t('issue.website')">{{ get(describe, 'website') || '-' }}</s-item>
    <s-item :label="$t('issue.logo')">{{ get(describe, 'logo') || '-' }}</s-item>
    <s-item :label="$t('issue.description')">{{ get(describe, 'description') || '-' }}</s-item>
    <el-button
      class="btn"
      @click="() => this.$router.push(`/issue/modify/${$route.params.id}`)"
    >{{$t('issue.modify')}}</el-button>

    <p class="sub-title">{{ $t('issue.setting') }}</p>
    <p class="sub-info warn">{{ $t('issue.settingBrif') }}</p>
    <div class="switch">
      <el-switch
        v-model="mint"
        active-color="#13ce66"
        :active-text="$t('issue.mint')"
        :disabled="!mint"
        @change="v => onClose(v, 'minting_finished')"
      ></el-switch>
    </div>
    <div class="switch">
      <el-switch
        v-model="freeze"
        active-color="#13ce66"
        :active-text="$t('issue.freeze')"
        :disabled="!freeze"
        @change="v => onClose(v, 'freeze_disabled')"
      ></el-switch>
    </div>
    <div class="switch">
      <el-switch
        v-model="burn"
        active-color="#13ce66"
        :active-text="$t('issue.burn')"
        :disabled="!burn"
        @change="v => onClose(v, 'burn_owner_disabled')"
      ></el-switch>
    </div>
    <div class="switch">
      <el-switch
        v-model="burnAny"
        active-color="#13ce66"
        :active-text="$t('issue.burnAny')"
        :disabled="!burnAny"
        @change="v => onClose(v, 'burn_from_disabled')"
      ></el-switch>
    </div>
    <div class="switch">
      <el-switch
        v-model="burnHolder"
        active-color="#13ce66"
        :active-text="$t('issue.burnHolder')"
        :disabled="!burnHolder"
        @change="v => onClose(v, 'burn_holder_disabled')"
      ></el-switch>
    </div>

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
    return {
      mint: true,
      freeze: true,
      burn: true,
      burnHolder: true,
      burnAny: true,
      switch: "",

      dialogVisible: false,
      loading: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("issue", ["tokenMap"]),
    detail() {
      return this.tokenMap[this.$route.params.id] || {};
    },
    describe() {
      if (this.detail.description) {
        return { ...JSON.parse(this.detail.description) };
      }
      return {};
    },
    supply() {
      if (isEmpty(this.detail)) return "0";
      const coin = {
        denom: this.detail.issue_id,
        amount: this.detail.total_supply
      };
      return getViewToken(coin, this.tokenMap);
    }
  },
  methods: {
    get,
    fetchData: async function() {
      await this.$store.dispatch("issue/fetchToken", this.$route.params.id);
      if (this.detail.description) {
        this.describe = { ...JSON.parse(this.detail.description) };
      }
      this.mint = !this.detail.minting_finished;
      this.freeze = !this.detail.freeze_disabled;
      this.burn = !this.detail.burn_owner_disabled;
      this.burnHolder = !this.detail.burn_holder_disabled;
      this.burnAny = !this.detail.burn_from_disabled;
    },
    onClose(v, name) {
      this.$confirm(this.$t("issue.switchWarn"), this.$t("global.confirm"), {
        confirmButtonText: this.$t("global.ok"),
        cancelButtonText: this.$t("global.cancel"),
        type: "warning"
      })
        .then(() => {
          this.switch = name;
          this.onSubmit();
        })
        .catch(() => {});
    },
    onSubmit() {
      // use math wallet
      if (!isEmpty(this.mathAccount)) {
        this.onSend(true);
        return;
      }
      // else use local wallet
      this.pass = "";
      this.dialogVisible = true;
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
        res = await this.$store.dispatch(`issue/setting`, {
          pass: this.pass,
          setting: this.switch
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
        this.fetchData();
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
  mounted() {
    this.fetchData();
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
    margin-bottom: 16px;
  }
}

.fee {
  span {
    margin-right: 16px;
  }
}
.btn {
  padding: 16px;
  width: 100%;
}
.switch {
  margin-bottom: 24px;
}
</style>

