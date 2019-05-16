<template>
  <router-link
    :to="`/staking/detail/${v.operator_address}`"
    class="delegation-item"
  >
    <div>
      <h3>{{ get(v.validator, 'description.moniker') }} <span :class="get(v, 'validator.jailed') ? 'jailed' : ''">{{ get(v, 'validator.jailed') ? 'Jailed' : 'Active' }}</span></h3>
      <p>{{ $t('staking.commission') }}: {{ numeral(get(v.validator, 'commission.rate')).format('(0.[00]%)') }} / {{ $t('staking.tokens') }}: {{ numeral(get(v, 'validator.tokens')).format('0,0') }}</p>
    </div>
    <div class="tokens">
      <h3>{{ numeral(v.shares).format('0,0') }}</h3>
      <p>{{ $t('staking.delegations') }}</p>
    </div>
  </router-link>
</template>

<script>
import { mapState } from "vuex";
import numeral from "numeral";
import { get, isEmpty } from "lodash";
import { getViewToken } from "@/utils/helpers";

export default {
  name: "ValidatorPanel",
  props: {
    v: { type: Object, required: true }
  },
  computed: {
    ...mapState("account", ["tokenMap"]),
    viewToken() {
      return getViewToken(this.token, this.tokenMap);
    }
  },
  methods: {
    get,
    numeral
  }
};
</script>

<style lang="scss" scoped>
.delegation-item {
  flex-basis: 300px;
  height: 180px;
  text-align: center;
  background: white;
  color: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $padding-basic;
  border-radius: 4px;

  img {
    width: 40px;
    height: 40px;
    margin-bottom: 16px;
    position: relative;
    top: 2px;
  }
  .logo-none {
    width: 48px;
    height: 48px;
    margin-top: -4px;
    margin-bottom: 12px;
    position: relative;
    top: 2px;
    background: #eee;
    border-radius: 24px;
  }
  .name {
    font-size: 18px;
    margin-bottom: 16px;
  }
  .amount {
    font-size: 20px;
  }
}
</style>

