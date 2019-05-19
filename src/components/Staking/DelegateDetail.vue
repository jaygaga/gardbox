<template>
  <s-card :title="$t('staking.validator')">
    <div class="div">
      <s-item
        :label="$t('staking.name')"
        class="item"
      >{{ get(v, 'description.moniker') }}</s-item>
      <s-item
        :label="$t('staking.status')"
        class="item"
      ><span :class="v.jailed ? 'jailed' : ''">{{ v.jailed ? 'Jailed' : 'Active' }}</span></s-item>
      <s-item
        :label="$t('staking.tokens')"
        class="item"
      >{{ shares.amount | formatNumber }} GARD</s-item>
      <s-item
        :label="$t('staking.address')"
        class="item"
      >{{ get(v, 'operator_address') }}</s-item>
      <s-item
        :label="$t('staking.commission')"
        class="item"
      >{{ numeral(get(v, 'commission.rate')).format('(0.[00]%)') }}</s-item>
      <s-item
        :label="$t('staking.max')"
        class="item"
      >{{ numeral(get(v, 'commission.max_rate')).format('(0.[00]%)') }}</s-item>
      <s-item
        :label="$t('staking.commissionChange')"
        class="item"
      >{{ numeral(get(v, 'commission.max_change_rate')).format('(0.[00]%)') }}</s-item>

      <s-item
        :label="$t('staking.website')"
        class="item"
      >{{ get(v, 'description.website') || '-' }}</s-item>
      <s-item
        :label="$t('staking.description')"
        class="item"
      >{{ get(v, 'description.detail') || '-' }}</s-item>
    </div>

    <div class="btns">
      <el-button
        @click="confirmWithdraw"
        :disabled="isEmpty(v.reward)"
        class="btn"
      >
        {{ $t('staking.withdraw') }}
      </el-button>

      <el-button
        @click="toDelegate"
        class="btn"
      >
        {{ $t('staking.delegate') }}
      </el-button>
    </div>

    <p
      class="label"
      v-if="isDelegating"
    >{{ $t('staking.delegations') }}</p>

    <div
      v-if="isDelegating"
      class="div"
    >
      <s-item
        v-if="!isEmpty(v.delegation)"
        :label="$t('staking.delegated')"
        class="item"
      >{{ numeral(get(v, 'delegation.shares')).format('0,0') }}</s-item>
      <s-item
        v-if="!isEmpty(v.reward)"
        :label="$t('staking.reward')"
        class="item"
      >{{ numeral(get(v, 'reward.0.amount')).format('0,0.[000000]') }}</s-item>
      <s-item
        v-if="!isEmpty(v.unbinding)"
        :label="$t('staking.unbinding')"
        class="item"
      >
        <div
          v-for="i in v.unbinding"
          :key="i.completion_time"
          class="data"
        >
          <span>{{ $t('staking.unbinding') }}</span>
          {{ numeral(get(i, 'balance')).format('0,0') }} | {{ get(i, 'completion_time') | formatTime }}
        </div>
      </s-item>
    </div>

    <div
      v-if="isDelegating"
      class="btns"
    >
      <el-button
        type="danger"
        @click="toUnbind"
        class="btn"
      >
        {{ $t('staking.unbind') }}
      </el-button>
      <el-button
        @click="toRedelegate"
        class="btn"
      >
        {{ $t('staking.redelegate') }}
      </el-button>
    </div>

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
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import { get, isEmpty } from "lodash";
import { getViewToken } from "@/utils/helpers";

export default {
  name: "ValidatorList",
  data() {
    return {
      dialogVisible: false,
      withdrawLoading: false,
      pass: ""
    };
  },
  computed: {
    ...mapState("staking", [
      "validatorMap",
      "delegationMap",
      "unbindingMap",
      "rewardMap"
    ]),
    v() {
      const address = this.$route.params.validator;
      const validator = get(this.validatorMap, address) || {};
      const unbinding = get(this.unbindingMap, address);
      const unbindingList = [];
      if (!isEmpty(unbinding)) {
        unbinding.entries.forEach(i => {
          unbindingList[unbindingList.length] = i;
        });
      }
      return {
        ...validator,
        delegation: get(this.delegationMap, address),
        unbinding: unbindingList,
        reward: get(this.rewardMap, address)
      };
    },
    shares() {
      const t = { denom: "agard", amount: this.v.tokens };
      return getViewToken(t);
    },
    isDelegating() {
      return !isEmpty(this.v.delegation) || !isEmpty(this.v.unbinding);
    }
  },
  methods: {
    get,
    isEmpty,
    numeral,
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
    },
    toDelegate() {
      const { validator } = this.$route.params;
      this.$router.push(`/staking/delegate?to=${validator}`);
    },
    toUnbind() {
      const { validator } = this.$route.params;
      this.$router.push(`/staking/unbind?from=${validator}`);
    },
    toRedelegate() {
      const { validator } = this.$route.params;
      this.$router.push(`/staking/redelegate?from=${validator}`);
    }
  },
  mounted() {
    const { validator } = this.$route.params;
    this.$store.dispatch("staking/fetchValidators");

    // rest api returns 500 if result data empty
    // this.$store.dispatch("staking/fetchDelegation", validator);
    // this.$store.dispatch("staking/fetchReward", validator);
    // this.$store.dispatch("staking/fetchUnbinding", validator);
    // so we fetch list api
    this.$store.dispatch("staking/fetchDelegations");
    this.$store.dispatch("staking/fetchRewards");
    this.$store.dispatch("staking/fetchUnbindings");
  }
};
</script>

<style lang="scss" scoped>
.div {
  background: $color-background-card;
  padding: 4px $padding-basic;
  margin-bottom: 16px;
  .item {
    margin: 16px 0;
  }
}
.label {
  margin-bottom: 12px;
}
.btns {
  margin-top: $padding-basic;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .btn {
    height: 48px;
    flex-basis: 48%;
  }
}
</style>