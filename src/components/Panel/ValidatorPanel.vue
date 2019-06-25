<template>
  <router-link
    :to="`/staking/detail/${v.operator_address}`"
    class="delegation-item"
  >
    <h3>
      <span class="index">{{ v.index }}.</span>
      <span class="name">{{ get(v, 'description.moniker') }}</span>
      <el-tag
        size="small"
        :type="get(v, 'validator.jailed') ? 'danger' : 'success'"
      >{{ get(v, 'validator.jailed') ? 'Jailed' : 'Active' }}</el-tag>
    </h3>
    <p><span>{{ $t('staking.address') }}</span>{{ v.operator_address | gardAddr }}</p>
    <p><span>{{ $t('staking.tokens') }}</span>{{ viewToken.amount | formatNumber }} GARD</p>
    <p><span>{{ $t('staking.commission') }}</span>{{ numeral(get(v, 'commission.rate')).format('(0.[00]%)') }}</p>
    <p><span>{{ $t('staking.max') }}</span>{{ numeral(get(v, 'commission.max_rate')).format('(0.[00]%)') }}</p>

    <p v-if="get(delegation, 'shares')">
      <span>{{ $t('staking.delegations') }}</span>
      {{ numeral(getViewToken({denom: 'agard', amount: get(delegation, 'shares')}).amount).format('0,0') }} GARD
    </p>
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
    delegation: Object,
    v: { type: Object, required: true }
  },
  computed: {
    ...mapState("account", ["tokenMap"]),
    viewToken() {
      const token = { denom: "agard", amount: this.v.tokens };
      return getViewToken(token, this.tokenMap);
    }
  },
  methods: {
    get,
    numeral,
    getViewToken
  }
};
</script>

<style lang="scss" scoped>
.delegation-item {
  flex-basis: 31.3%;
  margin: 8px 1%;
  background: white;
  color: rgba(0, 0, 0, 0.75);
  padding: 14px $padding-basic;
  border-radius: 4px;

  h3 {
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .index {
      margin-right: 4px;
    }
    .name {
      flex-grow: 1;
      max-width: 160px;
      overflow: hidden;
    }
  }
  p {
    display: flex;
    justify-content: space-between;
    span {
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
@include responsive($sm) {
  .delegation-item {
    flex-basis: 100%;
    margin: 8px 0;
  }
}
</style>

