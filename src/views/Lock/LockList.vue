<template>
  <div class="lock-container">
    <div class="lock-title">锁定列表</div>
    <div class="lock-line"></div>
    <div class="lock-top">
      <el-select v-model="value">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <router-link to="/Lock/LockInput">
        <el-button>继续锁定</el-button>
      </router-link>
    </div>
    <div class="lock-table">
      <div class="table-header">
        <div class="header-status">{{$t('lockInput.status')}}</div>
        <div class="header-time">{{$t('lockInput.lockTime')}}</div>
        <div class="header-address">{{$t('lockInput.lockAddress')}}</div>
        <div class="header-currency">{{$t('lockInput.lockCurrency')}}</div>
        <div class="header-number">{{$t('lockInput.lockNumber')}}</div>
      </div>
      <div
        class="table-header"
        v-for="item in filterLockList"
        :key="item.id"
        @click="lockDetail(item.id)"
      >
        <div class="header-status">{{item.status}}</div>
        <div class="header-time">{{item.lock.end_time | formatTime}}</div>
        <div class="header-address">{{item.owner}}</div>
        <div class="header-currency">{{getdenom(item)}}</div>
        <div class="header-number">{{getAmount(item)}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import numeral from "numeral";
import { filter } from "lodash";
export default {
  data() {
    return {
      value: "all",
      options: [
        { value: "all", label: this.$t("lockInput.all") },
        { value: "locked", label: this.$t("lockInput.locked") },
        { value: "unlocked", label: this.$t("lockInput.unlocked") }
      ]
    };
  },
  computed: {
    ...mapState("lock", ["lockList"]),
    filterLockList() {
      const filterArr = filter(this.lockList, item => {
        return this.value == "all" ? item : this.value == item.status;
      });
      return filterArr;
    }
  },
  methods: {
    numeral,
    getdenom(row) {
      if (row.total_amount.token.denom == "agard") {
        const denom = "GARD";
        return denom;
      } else {
        const denom = row.total_amount.token.denom.toUpperCase();
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
    lockDetail(id) {
      this.$router.push({ path: `/Lock/LockDetail/${id}` });
    }
  },
  mounted() {
    this.$store.dispatch("lock/getLockList");
  }
};
</script>
<style lang="scss" scoped>
.lock-container {
  text-align: center;
  > .lock-title {
    font-size: 18px;
    font-weight: bolder;
    letter-spacing: 5px;
    margin-bottom: 10px;
  }
  > .lock-line {
    width: 100px;
    height: 2px;
    background: white;
    margin: 0 auto 50px;
  }
  > .lock-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .el-button {
      color: $color-primary-dark;
    }
  }
  .table-header {
    background-color: $color-primary-light;
    display: flex;
    justify-content: space-around;
    height: 50px;
    line-height: 50px;
    border-radius: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    > div {
      flex-basis: 15%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    > .header-currency {
      flex-basis: 12%;
    }
    > .header-time {
      flex-basis: 18%;
    }
    > .header-address {
      flex-basis: 40%;
    }
  }
}
</style>

