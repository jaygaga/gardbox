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

    <el-button
      @click="toDelegate"
      class="btn-delegate"
    >
      {{ $t('staking.delegate') }}
    </el-button>

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
        :label="$t('staking.unpaidIncome')"
        class="item"
      >{{numeral(unpaidIncome.amount).format('0,0.[0000]')}}</s-item>
      <s-item
        v-if="!isEmpty(v.delegation)"
        :label="$t('staking.delegated')"
        class="item"
      >{{ numeral(myDelegation.amount).format('0,0') }} GARD</s-item>
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
          {{ numeral(getViewToken({denom: 'agard', amount: get(i, 'balance')}).amount).format('0,0') }} GARD | {{ get(i, 'completion_time') | formatTime }}
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
      unpaidIncome: ''
    }
  },
  computed: {
    ...mapState("staking", ["validatorMap", "delegationMap", "unbindingMap"]),
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
        unbinding: unbindingList
      };
    },
    shares() {
      const t = { denom: "agard", amount: this.v.tokens };
      return getViewToken(t);
    },
    isDelegating() {
      return !isEmpty(this.v.delegation) || !isEmpty(this.v.unbinding);
    },
    myDelegation() {
      const t = {
        denom: "agard",
        amount: this.v.tokens * get(this.delegationMap, [this.v.operator_address, "shares"]) / this.v.delegator_shares
      };
      return getViewToken(t);
    }
  },
  methods: {
    get,
    isEmpty,
    numeral,
    getViewToken,
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
    },
    getUnpaidIncome: async function(validator) {
      var data = await this.$store.dispatch("staking/fetchReward", validator)
      this.unpaidIncome = getViewToken(data[0])
    }
  },
  mounted() {
    const { validator } = this.$route.params;
    this.$store.dispatch("staking/fetchValidators");

    // rest api returns 500 if result data empty
    // this.$store.dispatch("staking/fetchDelegation", validator);
    // this.$store.dispatch("staking/fetchUnbinding", validator);
    // so we fetch list api
    this.$store.dispatch("staking/fetchDelegations");
    this.$store.dispatch("staking/fetchUnbindings");
    this.getUnpaidIncome(validator)
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
  margin-top: 24px;
  margin-bottom: 12px;
}
.btn-delegate {
  width: 100%;
  height: 48px;
}
.btns {
  margin-top: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .btn {
    width: 100%;
    height: 48px;
    flex-basis: 48%;
  }
}
</style>