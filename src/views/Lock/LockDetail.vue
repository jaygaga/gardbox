<template>
  <div class="lockDetail-container">
    <div class="lockDetail-top">{{$t('lockInput.lockInfo')}}</div>
    <div class="lockDetail-line"></div>
    <div class="lockDetail-content">
      <p>{{$t('lockInput.lockCurrency')}} : {{getdenom(detailData.value.total_amount.token.denom)}}</p>
      <p class="lock-address">{{$t('lockInput.lockAddress')}} : {{detailData.value.owner}}</p>
      <p>{{$t('lockInput.lockNumber')}} : {{getAmount(detailData.value)}}</p>
      <p>{{$t('lockInput.lockTime')}}: {{detailData.value.lock.end_time | formatTime}}</p>
    </div>
    <div class="lockDetail-btn">
      <router-link to="/lock/lockList">
        <el-button>{{$t('global.ok')}}</el-button>
      </router-link>

    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
export default {
  data() {
    return {
      detailData: {}
    };
  },
  methods: {
    getdenom(name) {
      if (name == "agard") {
        const denom = "GARD";
        return denom;
      } else {
        const denom = name.toUpperCase();
        return denom;
      }
    },
    getAmount(row) {
      if (row.total_amount.token.denom == "agard") {
        const amount = BigNumber(row.total_amount.token.amount)
          .dividedBy(Math.pow(10, 18))
          .toString();
        return amount;
      } else {
      }
    },
    getLockDetail: async function() {
      const res = await this.$store.dispatch(
        "lock/getLockDetail",
        this.$route.params.id
      );
      this.detailData = res;
    }
  },
  mounted() {
    this.getLockDetail();
  }
};
</script>
<style lang="scss" scoped>
.lockDetail-container {
  width: 50%;
  margin: 0 auto;
  > .lockDetail-top {
    font-size: 18px;
    font-weight: bolder;
    letter-spacing: 5px;
    margin-bottom: 10px;
    text-align: center;
  }
  > .lockDetail-line {
    width: 90px;
    height: 2px;
    background: white;
    margin: 0 auto 50px;
  }
  > .lockDetail-content {
    margin-bottom: 40px;
    > p {
      height: 50px;
      line-height: 50px;
    }
    > .lock-address {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  > .lockDetail-btn {
    .el-button {
      width: 100%;
    }
  }
}
@include responsive($sm) {
  .lockDetail-container {
    width: 80%;
    > .lockDetail-content {
      width: 100%;
    }
  }
}
</style>
