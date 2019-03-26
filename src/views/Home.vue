<template>
  <div class="home-container">
    <div class="home-top">
      <div class="balance">
        <img
          alt="logo"
          src="~@/assets/gard-logo.svg"
        />
        <span>{{balance}}</span>
      </div>
      <el-button
        type="primary"
        @click="qrCodeVisible = true"
      >{{$t('home.receive')}}</el-button>
      <router-link to="send">
        <el-button
          type="primary"
          class="btn"
        >{{$t('home.send')}}</el-button>
      </router-link>
    </div>

    <TransactionList
      :fields="fields.filter(i => !i.hideInTable)"
      :load="load"
      :list="txs"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get, isEmpty } from "lodash";

import { txFieldsMap } from "@/constants";
import TransactionList from "@/components/TransactionList";

export default {
  name: "Home",
  components: { TransactionList },
  data() {
    return {
      fields: txFieldsMap.send,
      load: false
    };
  },
  computed: {
    ...mapGetters("blocks", { blocksLastList: "lastList" }),
    ...mapState("account", ["userName", "keyStore", "balance", "txs"])
  },
  methods: {
    fetchData: async function() {
      this.load = true;
      await this.$store.dispatch("account/fetchBalance");
      await this.$store.dispatch("account/fetchTxs");
      this.load = false;
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  margin-top: 24px;

  .home-top {
    display: flex;
    justify-content: space-around;
    padding: 24px;
    background: $color-background-card;

    .balance {
      flex-grow: 1;
      img {
        width: 32px;
        flex: 0;
      }
    }
    button {
      margin-left: 8px;
    }
  }
}
</style>

