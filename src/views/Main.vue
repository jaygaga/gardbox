<template>
  <div class="main-container">
    <div class="main-top">
      <div class="top-balance">
        <div class="name"><img :src="icon" />{{userName}}</div>
        <s-address
          :address="keyStore.address"
          :ellipsis="true"
        />
      </div>

      <div class="top-btns">
        <router-link
          class="top-btn"
          to="receive"
        >
          <img :src="icon2" />
          {{$t('main.receive')}}
        </router-link>

        <router-link
          class="top-btn"
          to="send/form"
        >
          <img :src="icon1" />
          {{$t('main.send')}}
        </router-link>

        <router-link
          class="top-btn"
          to="passport"
        >
          <img :src="icon3" />
          {{$t('main.manage')}}
        </router-link>
      </div>
    </div>

    <el-tabs
      v-model="$route.query.tab"
      :before-leave="onTabChange"
      type="card"
    >
      <el-tab-pane
        :label="$t('main.assets')"
        name="assets"
      >
        <div
          v-loading="loading"
          element-loading-background="rgba(255, 255, 255, 0)"
          class="assets"
        >
          <BalancePanel
            class="asset-item"
            v-if="isEmpty(balance)"
            :token="gardBalance"
          />
          <BalancePanel
            class="asset-item"
            v-for="token in balance"
            :key="token.denom"
            :token="token"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('main.txs')"
        name="txs"
      >
        <div
          v-loading="txLoading"
          element-loading-background="rgba(255, 255, 255, 0)"
          class="txs"
        >
          <div
            class="empty"
            v-if="txs.length === 0"
          >{{$t('main.empty')}}</div>
          <TransactionList :list="txs" />
          <p v-if="txs.length > 0"><a
              target="_blank"
              :href="`${domain}address/${keyStore.address}`"
            >{{$t('main.allTxs')}}</a></p>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get, isEmpty } from "lodash";

import { gardplorerDomain } from "@/constants";

import icon from "@/assets/icon-wallet.svg";
import icon1 from "@/assets/icon-to.svg";
import icon2 from "@/assets/icon-from.svg";
import icon3 from "@/assets/icon-setting.svg";
import AvatarPanel from "@/components/Panel/AvatarPanel.vue";
import BalancePanel from "@/components/Panel/BalancePanel";
import TransactionList from "@/components/TransactionList";

export default {
  name: "Main",
  components: { AvatarPanel, BalancePanel, TransactionList },
  data() {
    return {
      icon,
      icon1,
      icon2,
      icon3,
      domain: gardplorerDomain
    };
  },
  computed: {
    ...mapState("account", [
      "userName",
      "keyStore",
      "balance",
      "txs",
      "loading"
    ]),
    ...mapState("transactions", { txLoading: "loading", txs: "txs" }),
    gardBalance() {
      const gard = { amount: "0", denom: "gard" };
      return this.balance.find(i => i.denom === "gard") || gard;
    }
  },
  methods: {
    isEmpty,
    onTabChange(tab) {
      this.$router.push(`/main?tab=${tab}`);
      if (tab === "assets") {
        this.$store.dispatch("account/fetchBalance");
      }
      if (tab === "txs") {
        this.$store.dispatch("transactions/fetchTxs", this.keyStore);
      }
    },
    onCopy() {
      this.$message({
        type: "success",
        message: this.$t("home.copy")
      });
    }
  },
  beforeMount() {
    if (!this.userName) {
      this.$router.push("/passport");
    }
  },
  mounted() {
    this.onTabChange(this.$route.query.tab);
  }
};
</script>

<style lang="scss" scoped>
.main-container {
  max-width: $max-width;
  margin: 0 auto $padding-large;
  padding: $padding-large;

  .main-top {
    display: flex;
    align-items: stretch;
    margin: -4px -4px $padding-basic;

    .top-balance {
      background: $color-primary-light;
      box-shadow: $shadow;
      padding: $padding-large;
      margin: 4px;
      flex-basis: 50%;

      .name {
        display: flex;
        align-items: center;
        font-size: 20px;
        margin-bottom: 8px;
        img {
          height: 24px;
          margin-right: 8px;
        }
      }
    }
    .top-btns {
      display: flex;
      text-align: center;
      align-items: stretch;
      margin: 4px;
      flex-basis: 50%;
      height: 130px;
      background: $color-primary-light;
      box-shadow: $shadow;

      .top-btn {
        flex-grow: 1;
        line-height: 32px;
        padding: $padding-large 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &:hover {
          background: $color-primary-light;
        }

        img {
          width: 32px;
        }
      }
    }
  }
  .assets {
    display: flex;
    align-items: flex-start;
    padding: $padding-basic 0;
    margin-left: -24px;
    .asset-item {
      margin-left: 24px;
      margin-bottom: 16px;
    }
  }
  .txs {
    padding: $padding-basic 0;

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
.line {
  border-top: $border;
  margin: $padding-basic;
}

@include responsive($sm) {
  .main-container {
    padding: 16px;
    .main-top {
      flex-direction: column;
    }
    .assets {
      flex-direction: column;
      align-items: stretch;
    }
    .txs {
      padding: $padding-basic 4px;
    }
  }
}
</style>

