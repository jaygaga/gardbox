<template>
  <s-card :title="$t('staking.validator')">
    <div class="top">
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

    <p>{{ $t('staking.delegations') }}</p>

    <div class="my">
      <div class="data">
        <span>{{ $t('staking.delegations') }}</span>
        {{ numeral(get(v, 'delegation.shares')).format('0,0') }}
      </div>
      <div class="data">
        <span>{{ $t('staking.reward') }}</span>
        {{ numeral(get(v, 'reward.0.amount')).format('0,0.[000000]') }}
      </div>
      <div
        v-for="i in v.unbinding"
        :key="i.completion_time"
        class="data"
      >
        <span>{{ $t('staking.unbinding') }}</span>
        {{ numeral(get(i, 'balance')).format('0,0') }} | {{ get(i, 'completion_time') | formatTime }}
      </div>
      <div class="btns">
        <el-button
          type="danger"
          @click="toUnbind"
        >
          {{ $t('staking.unbind') }}
        </el-button>
        <el-button
          type="primary"
          @click="toRedelegate"
        >
          {{ $t('staking.redelegate') }}
        </el-button>
      </div>
    </div>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import { get, isEmpty } from "lodash";
import { getViewToken } from "@/utils/helpers";

export default {
  name: "ValidatorList",
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
    }
  },
  methods: {
    get,
    numeral,
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
.top {
  background: $color-background-card;
  padding: 4px $padding-basic;
  margin-bottom: 16px;
  .item {
    margin: 16px 0;
  }
}
.my {
  color: rgba(0, 0, 0, 0.6);
  background: white;
  border-radius: 4px;
  padding: $padding-basic;
  display: flex;
  flex-direction: column;
  .data {
    display: flex;
    justify-content: space-between;
  }
  .btns {
    margin-top: $padding-basic;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>