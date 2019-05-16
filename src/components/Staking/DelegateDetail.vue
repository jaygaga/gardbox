<template>
  <s-card :title="$t('staking.detail')">
    <div class="item">
      <div>
        <h3>{{ $t('staking.validator') }}: {{ get(v, 'description.moniker') }} <span :class="v.jailed ? 'jailed' : ''">{{ v.jailed ? 'Jailed' : 'Active' }}</span></h3>
        <p>{{ $t('staking.commission') }}: {{ numeral(get(v, 'commission.rate')).format('(0.[00]%)') }} / {{ $t('staking.max') }}: {{ numeral(get(v, 'commission.max_rate')).format('(0.[00]%)') }}</p>
      </div>
      <div class="tokens">
        <h3>{{ numeral(v.tokens).format('0,0') }}</h3>
        <p>{{ $t('staking.tokens') }}</p>
      </div>
    </div>
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
    this.$store.dispatch("staking/fetchDelegation", validator);
    this.$store.dispatch("staking/fetchReward", validator);
    this.$store.dispatch("staking/fetchUnbinding", validator);
  }
};
</script>

<style lang="scss" scoped>
.item {
  background: white;
  box-shadow: $shadow;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px $padding-basic;
  border-radius: 4px;
  margin-bottom: 12px;
  cursor: pointer;

  h3 {
    color: rgba(0, 0, 0, 0.8);
    font-size: 18px;

    span {
      font-size: 14px;
      color: $color-success;

      &.jailed {
        color: $color-error;
      }
    }
  }
  p {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
  }

  .tokens {
    text-align: center;
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