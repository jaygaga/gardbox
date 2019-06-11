<template>
  <s-card
    :title="$t('issue.detail')"
    class="issue-detail-card max"
  >
    <div class="top">
      <div class="pad">
        <p class="sub-title">{{ $t('issue.basic') }}</p>
        <s-item :label="$t('issue.name')">{{ get(detail, 'name') }}</s-item>
        <s-item :label="$t('issue.symbol')">{{ get(detail, 'symbol') }}</s-item>
        <s-item :label="$t('issue.supply')">{{ get(supply, 'amount') | formatNumber }}</s-item>
        <s-item :label="$t('issue.decimals')">{{ get(detail, 'decimals') }}</s-item>
      </div>
      <div class="pad">
        <p class="sub-title">{{ $t('issue.describe') }}</p>
        <s-item :label="$t('issue.organization')">{{ get(describe, 'organization') || '-' }}</s-item>
        <s-item :label="$t('issue.website')">{{ get(describe, 'website') || '-' }}</s-item>
        <s-item :label="$t('issue.logo')">{{ get(describe, 'logo') || '-' }}</s-item>
        <s-item :label="$t('issue.description')">{{ get(describe, 'description') || '-' }}</s-item>
      </div>
    </div>

    <el-tabs
      v-model="$route.query.tab"
      :before-leave="onTabChange"
      type="card"
    >
      <el-tab-pane
        :label="$t('issue.tab1')"
        name="setting"
      >
        <TabSetting
          :setting="setting"
          @refresh="fetchData"
        />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('issue.tab2')"
        name="mint"
      >
        <TabMint :setting="setting" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('issue.tab3')"
        name="freeze"
      >
        <TabFreeze :setting="setting" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('issue.tab4')"
        name="transfer"
      >transfer</el-tab-pane>
    </el-tabs>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";

import { getViewToken } from "@/utils/helpers";
import webc from "@/utils/webc";

import TabSetting from "@/components/Issue/TabSetting";
import TabMint from "@/components/Issue/TabMint";
import TabFreeze from "@/components/Issue/TabFreeze";

export default {
  name: "IssueDetail",
  components: { TabSetting, TabMint, TabFreeze },
  data() {
    return {
      setting: {}
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
      this.setting = {
        mint: !this.detail.minting_finished,
        freeze: !this.detail.freeze_disabled,
        burn: !this.detail.burn_owner_disabled,
        burnHolder: !this.detail.burn_holder_disabled,
        burnAny: !this.detail.burn_from_disabled
      };
    },
    onTabChange(tab) {
      this.$router.push(`${this.$route.path}?tab=${tab}`);
      if (tab === "mint") {
        this.$store.dispatch("issue/fetchTxs", {
          id: this.$route.params.id,
          actions: ["issue_mint", "issue_burn_owner", "issue_burn_from"]
        });
      }
      if (tab === "freeze") {
        this.$store.dispatch("issue/fetchTxs", {
          id: this.$route.params.id,
          actions: ["issue_freeze", "issue_unfreeze"]
        });
      }
    }
  },
  mounted() {
    this.fetchData();
    this.onTabChange(this.$route.query.tab);
  }
};
</script>

<style lang="scss" scoped>
.issue-detail-card.max {
  max-width: $max-width;
}
.top {
  display: flex;
  margin: 0 -16px;
  .pad {
    flex-basis: 50%;
    margin: 0 16px;
    background: $color-background-card;
    padding: 0 24px;
    margin-bottom: $padding-basic;
  }
}
.sub-title {
  text-align: center;
  margin-top: $padding-large;
  margin-bottom: 8px;
}

@include responsive($sm) {
  .top {
    display: block;
    .pad {
      padding: 2px $padding-basic;
    }
  }
}
</style>

