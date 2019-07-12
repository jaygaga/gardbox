<template>
  <s-page>
    <div class="singleToken-container">
      <div class="singleToken-top">
        <div class="top-left">
          <div class="top-left-img">
            <img
              :src="icon3"
              alt=""
            >
          </div>
          <div class="top-left-info">
            <p>GARD</p>
            <h3>hashgard</h3>
            <h3>coin2349804234</h3>
          </div>
        </div>
        <div class="top-right">
          <router-link to="send/form">
            <el-button type="primary">{{$t('main.send')}}</el-button>
          </router-link>
          <el-button
            type="warning"
            @click="extract"
          >{{$t('receiveVoucher.extract')}}</el-button>
        </div>
      </div>
      <div class="TransactionList">
        <div
          class="empty"
          v-if="txs.length === 0"
        >{{$t('main.empty')}}</div>
        <TransactionList :list="txs" />
        <p v-if="txs.length > 0"><a
            target="_blank"
            :href="`${domain}address/${address}`"
            style="font-size: 16px;"
          >{{$t('main.allTxs')}}</a></p>
      </div>
      <el-dialog
        title="请输入密码"
        :visible.sync="dialogVisible"
        width="30%"
        center
      >
        <el-input></el-input>
        <p style="text-align:right;padding-top: 5px;">手续费: 100 GARD</p>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            @click="dialogVisible = false"
            type="primary"
          >取 消</el-button>
          <el-button @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </s-page>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { gardplorerDomain } from "@/constants";
import TransactionList from "@/components/TransactionList";
import icon3 from "@/assets/icon-setting.svg";
export default {
  name: "SingleTokenAssets",
  components: {
    TransactionList
  },
  data() {
    return {
      icon3,
      domain: gardplorerDomain,
      dialogVisible: false
    };
  },
  computed: {
    ...mapState("account", ["keyStore", "txs"]),
    ...mapState("transactions", { txLoading: "loading", txs: "txs" }),
    ...mapGetters("account", { address: "currentAddress" })
  },
  methods: {
    extract() {
      this.dialogVisible = true;
    }
  },
  mounted() {
    this.$store.dispatch("transactions/fetchTxs", this.keyStore);
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

