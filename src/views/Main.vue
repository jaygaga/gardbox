<template>
  <div class="main-container">
    <div class="main-top">
      <div class="top-balance">
        <div>{{userName}}</div>
        <s-address :address="keyStore.address" />
      </div>

      <div class="top-btns">
        <router-link
          class="top-btn"
          to="receive"
        >
          {{$t('main.receive')}}
        </router-link>

        <router-link
          class="top-btn"
          to="send/form"
        >
          {{$t('main.send')}}
        </router-link>

        <router-link
          class="top-btn"
          to="passport"
        >
          {{$t('main.manage')}}
        </router-link>
      </div>
    </div>

    <el-tabs
      v-model="activeName"
      type="card"
    >
      <el-tab-pane
        :label="$t('main.assets')"
        name="0"
      >
        <div class="assets">
          <BalancePanel
            :amount="balance"
            denom="GARD"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('main.txs')"
        name="1"
      >
        <div class="txs">
          <TransactionList
            :fields="fields.filter(i => !i.hideInTable)"
            :load="load"
            :list="txs"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

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
  name: "Main",
  components: { AvatarPanel, BalancePanel, TransactionList },
  data() {
    return {
      fields: txFieldsMap.send,
      load: false,
      activeName: "0"
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
.main-container {
  max-width: $max-width;
  margin: 0 auto $padding-large;
  padding: $padding-large;

  .main-top {
    display: flex;
    align-items: stretch;
    background: rgba(255, 255, 255, 0.1);
    margin-bottom: $padding-basic;

    .top-balance {
      padding: $padding-large;
      flex-basis: 50%;
    }
    .top-btns {
      display: flex;
      text-align: center;
      align-items: stretch;
      flex-basis: 50%;
      background: rgba(255, 255, 255, 0.1);

      .top-btn {
        flex-grow: 1;
        line-height: 114px;

        &:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      }
    }
  }
  .assets {
    display: flex;
    min-height: 50vh;
    align-items: flex-start;
    padding: $padding-basic;
  }
  .txs {
    padding: $padding-basic 8px;
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

