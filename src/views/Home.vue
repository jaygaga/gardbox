<template>
  <div class="home-container">
    <div>
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
        <router-link to="tx">
          <el-button
            type="primary"
            class="btn"
          >{{$t('home.send')}}</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get, isEmpty } from "lodash";

export default {
  name: "Home",
  data() {
    return {};
  },
  computed: {
    ...mapGetters("blocks", { blocksLastList: "lastList" }),
    ...mapState("account", ["userName", "keyStore", "balance"])
  },
  methods: {
    fetchData: function() {
      this.$store.dispatch("blocks/fetchList");
      this.$store.dispatch("transactions/fetchLastList");
    }
  },
  mounted() {
    this.$store.dispatch("account/fetchBalance", this.userName);
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

