<template>
  <s-page>
    <div class="singleToken-container">
      <div class="singleToken-top">
        <div class="top-left">
          <div class="top-left-img">
            <img
              v-if="viewToken.img"
              :src="viewToken.img"
              alt=""
            >
            <div
              v-else
              class="logo-none"
            ></div>
          </div>
          <div class="top-left-info">
            <p>{{viewToken.denom}}</p>
            <!-- <h3>hashgard</h3>
            <h3>coin2349804234</h3> -->
          </div>
        </div>
        <div class="top-center">
          <p>{{$t('singleTokenAssets.available')}}</p>
          <p>{{ numeral(viewToken.amount).format('0,0.[0000]') }}</p>
        </div>
        <div
          class="top-center"
          @click="goLockList"
        >
          <p>{{$t('singleTokenAssets.lock')}}</p>
          <p>{{lockedAmount}}</p>
        </div>
        <div class="top-right">
          <router-link to="send/form">
            <el-button type="primary">{{$t('main.send')}}</el-button>
          </router-link>
          <router-link to="receive">
            <el-button type="primary">{{$t('main.receive')}}</el-button>
          </router-link>
          <router-link to="Lock/LockInput">
            <el-button type="warning">{{$t('singleTokenAssets.lock')}}</el-button>
          </router-link>
        </div>
      </div>
      <div class="TransactionList">
        <div
          class="empty"
          v-if="txs.length === 0"
        >{{$t('main.empty')}}</div>
        <TransactionList :list="transaction" />
        <p v-if="txs.length > 0"><a
            target="_blank"
            :href="`${domain}address/${address}`"
            style="font-size: 16px;"
          >{{$t('main.allTxs')}}</a></p>
      </div>
    </div>
  </s-page>
</template>
<script>
import { getViewToken } from "@/utils/helpers";
import { mapState, mapGetters } from "vuex";
import numeral from "numeral";
import { filter, forEach } from "lodash";
import { gardplorerDomain } from "@/constants";
import TransactionList from "@/components/TransactionList";
import BigNumber from "bignumber.js";
export default {
  name: "SingleTokenAssets",
  components: {
    TransactionList
  },
  data() {
    return {
      domain: gardplorerDomain,
      denom: null
    };
  },
  computed: {
    ...mapState("account", ["keyStore", "txs", "tokenMap"]),
    ...mapState("transactions", { txLoading: "loading", txs: "txs" }),
    ...mapState("lock", ["lockList"]),
    ...mapGetters("account", { address: "currentAddress" }),
    viewToken() {
      return getViewToken(
        JSON.parse(sessionStorage.getItem("token")),
        this.tokenMap
      );
    },
    transaction() {
      return this.txs;
    },
    lockedAmount() {
      let lockedAmount = 0;
      const filterArr = filter(this.lockList, item => {
        const denom = item.total_amount.token.denom;
        return this.viewToken.denom == "GARD"
          ? denom == "agard"
          : this.viewToken.denom == denom.toUpperCase();
      });
      forEach(filterArr, item => {
        if (item.status == "locked") {
          lockedAmount += parseInt(this.getAmount(item));
        }
      });
      return lockedAmount;
    }
  },
  methods: {
    numeral,
    goLockList() {
      this.$router.push({ path: "/Lock/LockList" });
    },
    getAmount(row) {
      if (row.total_amount.token.denom == "agard") {
        const amount = BigNumber(row.total_amount.token.amount).dividedBy(
          Math.pow(10, 18)
        );
        return amount;
      } else {
      }
    }
  },
  mounted() {
    this.$store.dispatch("transactions/fetchTxs", this.keyStore);
    this.$store.dispatch("lock/getLockList");
  }
};
</script>
<style lang="scss" scoped>
.singleToken-container {
  max-width: $max-width;
  margin: 0 auto $padding-large;
  padding: $padding-large;
  > .singleToken-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: $color-primary-light;
    box-shadow: $shadow;
    padding: $padding-large;
    border-radius: 10px;
    > .top-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > .top-left-img {
        > img {
          width: 80px;
        }
        > .logo-none {
          width: 80px;
          height: 80px;
          background: #eee;
          border-radius: 24px;
        }
      }
      > .top-left-info {
        margin-left: 10px;
        > p {
          font-size: 16px;
          color: #fff;
          font-weight: bolder;
          height: 30px;
          line-height: 30px;
        }
        > h3 {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          height: 30px;
          line-height: 30px;
        }
      }
    }
    > .top-center {
      font-size: 18px;
      text-align: center;
      cursor: pointer;
    }
    > .top-right {
      .el-button {
        margin-left: 10px;
      }
      .el-button--primary {
        background: rgb(74, 170, 248);
        border-color: rgb(74, 170, 248);
      }
    }
  }
  > .TransactionList {
    margin-top: 10px;
    .empty {
      margin: $padding-large;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
    }
    p {
      margin-top: 16px;
      text-align: center;
    }
  }
}
@include responsive($sm) {
  .singleToken-container {
    padding: 16px;
    .singleToken-top {
      flex-direction: column;
      > .top-center {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        > p {
          padding: 0 10px;
        }
      }
    }
  }
}
</style>

