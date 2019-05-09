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
        <span>{{ $t('staking.title') }}</span>
        {{ numeral(get(v, 'delegation.shares')).format('0,0') }}
      </div>
      <div class="data">
        <span>{{ $t('staking.reward') }}</span>
        {{ numeral(get(v, 'delegation.shares')).format('0,0') }}
      </div>
      <div class="data">
        <span>{{ $t('staking.unbinding') }}</span>
        {{ numeral(get(v, 'delegation.shares')).format('0,0') }}
      </div>
      <div class="btns">
        <router-link to="/staking/unbind">
          <el-button type="danger">
            {{ $t('staking.unbind') }}
          </el-button>
        </router-link>
        <router-link to="/staking/redelegate">
          <el-button type="primary">
            {{ $t('staking.redelegate') }}
          </el-button>
        </router-link>
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
      return {
        ...validator,
        delegation: get(this.delegationMap, address),
        unbinding: get(this.unbindingMap, address),
        reward: get(this.rewardMap, address)
      };
    }
  },
  methods: {
    get,
    numeral
    // onSelect(v) {
    //   this.$store.dispatch("staking/setToValidator", v);
    //   this.$router.back();
    // }
  },
  mounted() {
    const { validator } = this.$route.params;
    this.$store.dispatch("staking/fetchValidators");
    this.$store.dispatch("staking/fetchDelegation", validator);
    this.$store.dispatch("staking/fetchReward", validator);
    this.$store.dispatch("staking/fetchDelegation", validator);
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