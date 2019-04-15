<template>
  <div class="home-container">
    <div class="home-sider">
      <AvatarPanel
        :name="userName"
        :address="keyStore.address || ''"
      />
      <div class="line"></div>
      <BalancePanel :amount="balance" />
    </div>

    <div class="home-main">
      <div class="home-top">

        <BalancePanel
          class="top-balance"
          :amount="balance"
        />

        <router-link
          class="top-btn"
          to="receive"
        >
          <el-button
            plain
            type="primary"
          >{{$t('main.receive')}}</el-button>
        </router-link>

        <router-link
          class="top-btn"
          to="send/form"
        >
          <el-button
            plain
            type="primary"
          >{{$t('main.send')}}</el-button>
        </router-link>

        <router-link
          class="top-btn"
          to="passport"
        >
          <el-button
            plain
            type="primary"
          >{{$t('main.manage')}}</el-button>
        </router-link>
      </div>

      <s-card
        :title="$t('main.txs')"
        :linkName="$t('main.allTxs')"
        :link="`address/${keyStore.address}` | explorerUrl"
      >
        <TransactionList
          :fields="fields.filter(i => !i.hideInTable)"
          :load="load"
          :list="txs"
        />
      </s-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get, isEmpty } from "lodash";

import { txFieldsMap } from "@/constants";

import AvatarPanel from "@/components/Panel/AvatarPanel.vue";
import BalancePanel from "@/components/Panel/BalancePanel";
import TransactionList from "@/components/TransactionList";

export default {
  name: "Home",
  components: { AvatarPanel, BalancePanel, TransactionList },
  data() {
    return {
      fields: txFieldsMap.send,
      load: false
    };
  },
  computed: {
    ...mapState("account", ["userName", "keyStore", "balance", "txs"]),
    ...mapState("transactions", ["txs"]),
    avatarColor() {
      const code = this.userName.slice(0, 1).charCodeAt();
      const factor = code > 122 ? 73 : code;
      const Hue = 360 * (factor / 122);
      return "hsla(" + Hue + ",60%,65%,1)";
    }
  },
  methods: {
    fetchData: async function() {
      this.load = true;
      await this.$store.dispatch("account/fetchBalance");
      await this.$store.dispatch("transactions/fetchTxs", this.keyStore);
      this.load = false;
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
    this.fetchData();
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  padding: $padding-basic;

  .home-sider {
    flex-basis: 300px;
    background: white;
    margin-right: 16px;
    box-shadow: $shadow;
    border-radius: 4px;
    text-align: center;
  }
  .home-main {
    flex-grow: 1;
  }

  .home-top {
    display: flex;
    align-items: center;
    padding: 24px;
    background: white;
    box-shadow: $shadow;
    border-radius: 4px;
    margin-bottom: 16px;

    .top-balance {
      flex-grow: 1;
    }
    .top-btn {
      flex-grow: 0;
      height: 40px;
      margin-left: 16px;
    }
  }
}
.line {
  border-top: $border;
  margin: $padding-basic;
}

@include responsive($sm) {
  .home-container {
    .home-sider {
      display: none;
    }
    .home-top {
      .top-btn {
        margin-left: 8px;
      }
    }
  }
}
</style>

