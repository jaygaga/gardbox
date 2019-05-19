<template>
  <div class="staking-container">
    <div class="staking-top">
      <div class="top-left">
        <div>
          <p>{{ $t('staking.delegationTotal') }}</p>
          <h2>{{ totalDelegation }}</h2>
          <span>GARD</span>
        </div>
        <div>
          <p>{{ $t('staking.reward') }}</p>
          <h2>{{ numeral(reward.amount).format('0,0.[0000]') }}</h2>
          <span>GARD</span>
        </div>
      </div>

      <div class="top-btns">
        <a @click="confirmWithdraw">
          <i class="el-icon-money"></i>
          {{ $t('staking.withdraw') }}
        </a>

        <router-link to="/staking/delegate">
          <i class="el-icon-lock"></i>
          {{ $t('staking.delegate') }}
        </router-link>
      </div>
    </div>

    <el-tabs
      v-model="$route.query.tab"
      :before-leave="onTabChange"
      type="card"
    >
      <el-tab-pane
        :label="$t('staking.delegations')"
        name="delegations"
        class="delegations"
      >
        <ValidatorPanel
          v-for="v in viewDelegations"
          :key="v.validator_address"
          :v="v.validator"
          :delegation="v.delegation"
          class="item"
        />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('staking.validators')"
        name="validators"
      >
        <!-- <div class="tools">
          <el-select v-model="filter">
            <el-option
              value="tokens"
              :label="$t('staking.tokensMax')"
            ></el-option>
            <el-option
              value="commission"
              :label="$t('staking.commissionMin')"
            ></el-option>
          </el-select>
        </div> -->
        <div class="validators">
          <ValidatorPanel
            v-for="v in validators"
            :key="v.validator_address"
            :v="v"
            class="item"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :title="$t('create.pass')"
      :visible.sync="dialogVisible"
      width="360px"
      v-loading="withdrawLoading"
      :close-on-click-modal="false"
    >
      <el-input
        type="password"
        v-model="pass"
        :placeholder="$t('create.pass')"
        @keyup.enter.native="onWithdraw"
      ></el-input>
      <span slot="footer">
        <el-button @click="onWithdraw">{{$t('global.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import { get, isEmpty } from "lodash";

import ValidatorPanel from "@/components/Panel/ValidatorPanel";

export default {
  name: "StakingMain",
  components: { ValidatorPanel },
  data() {
    return {
      filter: "tokens",
      dialogVisible: false,
      withdrawLoading: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("account", ["userName", "keyStore"]),
    ...mapState("staking", [
      "loading",
      "validators",
      "validatorMap",
      "delegations",
      "unbindings",
      "rewards"
    ]),
    totalDelegation() {
      let res = 0;
      this.delegations.forEach(i => {
        res = numeral(i.shares)
          .add(res)
          .format("0,0");
      });
      return res;
    },
    reward() {
      return this.rewards.find(i => i.denom === "gard") || {};
    },
    viewDelegations() {
      return this.delegations.map(i => {
        return {
          delegation: i,
          validator: this.validatorMap[i.validator_address]
        };
      });
    },
    viewValidators() {
      if (this.filter === "tokens") {
        return this.validators;
      }
      return [...this.validators].sort(
        (a, b) => get(a, "commission.rate") - get(b, "commission.rate")
      );
    }
  },
  methods: {
    get,
    numeral,
    fetchData() {
      this.$store.dispatch("staking/fetchValidators");
      this.$store.dispatch("staking/fetchDelegations");
      this.$store.dispatch("staking/fetchUnbindings");
      this.$store.dispatch("staking/fetchRewards");
    },
    onTabChange(tab) {
      this.$router.push(`/staking?tab=${tab}`);
    },
    confirmWithdraw() {
      this.pass = "";
      this.dialogVisible = true;
    },
    onWithdraw: async function() {
      if (!this.pass) {
        this.$message({
          type: "error",
          message: $t("global.required", { name: $t("create.pass") }),
          center: true
        });
        return false;
      }
      this.withdrawLoading = true;
      let res = "";
      try {
        res = await this.$store.dispatch("staking/withdrawAll", {
          pass: this.pass
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
      this.withdrawLoading = false;
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style lang="scss" scoped>
.staking-container {
  max-width: $max-width;
  margin: 0 auto $padding-large;
  padding: $padding-large;

  .staking-top {
    display: flex;
    align-items: stretch;
    margin: -4px -4px $padding-basic;

    .top-left {
      flex-basis: 50%;
      display: flex;
      justify-content: space-between;
      background: $color-primary-light;
      box-shadow: $shadow;
      padding: $padding-basic;
      margin: 4px;
      text-align: center;

      div {
        flex-basis: 50%;
      }

      h2 {
        color: white;
        font-size: 28px;
      }
      span {
        font-size: 14px;
      }
    }
    .top-btns {
      display: flex;
      text-align: center;
      align-items: stretch;
      margin: 4px;
      flex-basis: 50%;
      height: 138px;
      background: $color-primary-light;
      box-shadow: $shadow;

      a {
        flex-basis: 50%;
        flex-grow: 1;
        line-height: 32px;
        font-size: 16px;
        padding: $padding-large 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &:hover {
          background: $color-primary-light;
        }

        i {
          font-size: 36px;
          margin-bottom: 4px;
        }
      }
    }
  }
  .tools {
    margin-top: $padding-basic;
  }
  .delegations,
  .validators {
    display: flex;
    // align-items: flex-start;
    flex-wrap: wrap;
    padding: $padding-basic 0;
    margin-left: -18px;
    .item {
      margin-left: 18px;
      margin-bottom: 16px;
    }
  }
}
@include responsive($sm) {
  .staking-container {
    padding: 16px;
    .staking-top {
      flex-direction: column;
    }
    .delegations {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style>

