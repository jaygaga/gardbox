<template>
  <div class="delegation-container">
    <div class="logo-none"></div>
    <div class="denom">
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
  name: "DelegationPanel",
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
.delegation-container {
  flex-basis: 200px;
  text-align: center;
  background: white;
  color: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $padding-basic;
  border-radius: 4px;

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
  .denom {
    font-size: 18px;
    margin-bottom: 16px;
  }
  .amount {
    font-size: 20px;
  }
}
</style>

