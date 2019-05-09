<template>
  <s-card :title="$t('staking.title')">
    <div
      class="top"
      v-loading="loading"
      element-loading-background="rgba(255, 255, 255, 0)"
    >
      <p>{{ $t('staking.reward') }}</p>
      <h2>{{ numeral(reward.amount).format('0,0.[000000]') }}<span>GARD</span></h2>
      <p><span class="name">{{ userName }}</span> {{ keyStore.address | gardAddr }}</p>
      <div class="btns">
        <el-button
          type="primary"
          @click="confirmWithdraw"
        >{{ $t('staking.withdraw') }}</el-button>
        <router-link to="/staking/delegate">
          <el-button type="primary">
            {{ $t('staking.delegate') }}
          </el-button>
        </router-link>
      </div>
    </div>
    <p class="subtitle">{{ $t('staking.title') }}</p>
    <router-link
      v-for="v in validators"
      :key="v.validator_address"
      :to="`/staking/detail/${v.validator_address}`"
      class="delegation-item"
    >
      <div>
        <h3>{{ get(v.validator, 'description.moniker') }} <span :class="get(v, 'validator.jailed') ? 'jailed' : ''">{{ get(v, 'validator.jailed') ? 'Jailed' : 'Active' }}</span></h3>
        <p>{{ $t('staking.commission') }}: {{ numeral(get(v.validator, 'commission.rate')).format('(0.[00]%)') }} / {{ $t('staking.tokens') }}: {{ numeral(v.validator.tokens).format('0,0') }}</p>
      </div>
      <div class="tokens">
        <h3>{{ numeral(v.shares).format('0,0') }}</h3>
        <p>{{ $t('staking.title') }}</p>
      </div>
    </router-link>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import { get, isEmpty } from "lodash";

export default {
  name: "StakingMain",
  computed: {
    ...mapState("account", ["userName", "keyStore"]),
    ...mapState("staking", [
      "loading",
      "validatorMap",
      "delegations",
      "unbindings",
      "rewards"
    ]),
    reward() {
      return this.rewards.find(i => i.denom === "gard") || {};
    },
    validators() {
      return this.delegations.map(i => {
        return { ...i, validator: this.validatorMap[i.validator_address] };
      });
    }
  },
  methods: {
    get,
    numeral,
    confirmWithdraw() {
      console.log("withdraw");
    }
  },
  mounted() {
    this.$store.dispatch("staking/fetchValidators");
    this.$store.dispatch("staking/fetchDelegations");
    this.$store.dispatch("staking/fetchUnbindings");
    this.$store.dispatch("staking/fetchRewards");
  }
};
</script>

<style lang="scss" scoped>
.top {
  color: rgba(0, 0, 0, 0.6);
  background: white;
  border-radius: 4px;
  padding: $padding-basic;
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    color: rgba(0, 0, 0, 0.7);
    font-size: 48px;
    margin: $padding-basic;
    span {
      font-size: 16px;
    }
  }
  p .name {
    color: rgba(0, 0, 0, 0.8);
  }
  .btns {
    margin-top: $padding-basic;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
.subtitle {
  margin-top: $padding-basic;
}
.delegation-item {
  background: white;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px $padding-basic;
  border-radius: 4px;
  margin-bottom: 12px;

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
</style>