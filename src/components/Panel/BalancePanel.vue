<template>
  <div class="balance-container">
    <img
      v-if="viewToken.img"
      :src="viewToken.img"
    />
    <div
      v-else
      class="logo-none"
    ></div>
    <div class="name">
      {{ viewToken.denom }}
    </div>
    <div class="amount">
      {{ viewToken.amount | formatNumber }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getViewToken } from "@/utils/helpers";

export default {
  name: "BalancePanel",
  props: {
    token: { type: Object, required: true }
  },
  computed: {
    ...mapState("account", ["tokenMap"]),
    viewToken() {
      return getViewToken(this.token, this.tokenMap);
    }
  }
};
</script>

<style lang="scss" scoped>
.balance-container {
  flex-basis: 200px;
  height: 180px;
  text-align: center;
  background: white;
  color: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $padding-basic;
  border-radius: 4px;

  img {
    width: 40px;
    height: 40px;
    margin-bottom: 16px;
    position: relative;
    top: 2px;
  }
  .logo-none {
    width: 48px;
    height: 48px;
    margin-top: -4px;
    margin-bottom: 12px;
    position: relative;
    top: 2px;
    background: #eee;
    border-radius: 24px;
  }
  .name {
    font-size: 18px;
    margin-bottom: 16px;
  }
  .amount {
    font-size: 20px;
  }
}
</style>

