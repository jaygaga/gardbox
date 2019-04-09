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

        <el-popover
          placement="bottom"
          width="400"
          trigger="click"
        >
          <div class="pop-content">
            <h4>{{$t('home.qrcode')}}</h4>
            <div id="qrcode"></div>
            <h4>{{$t('send.address')}}</h4>
            <s-address :address="keyStore.address || ''" />
          </div>

          <el-button
            plain
            class="top-btn"
            type="primary"
            slot="reference"
          >{{$t('home.receive')}}</el-button>
        </el-popover>

        <router-link
          class="top-btn"
          to="send"
        >
          <el-button
            plain
            type="primary"
          >{{$t('home.send')}}</el-button>
        </router-link>
      </div>

      <s-card
        :title="$t('home.txs')"
        :linkName="$t('home.allTxs')"
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
import QRCode from "@/utils/qrcode";

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
    ...mapGetters("blocks", { blocksLastList: "lastList" }),
    ...mapState("account", ["userName", "keyStore", "balance", "txs"]),
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
      await this.$store.dispatch("account/fetchTxs");
      new QRCode(
        document.getElementById("qrcode"),
        "http://jindo.dev.naver.com/collie"
      );
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

.pop-content {
  text-align: center;
  padding: 16px;
  h4 {
    font-size: 20px;
    font-weight: bold;
    margin: 16px;
  }
  #qrcode {
    width: 256px;
    margin: 16px auto;
  }
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

