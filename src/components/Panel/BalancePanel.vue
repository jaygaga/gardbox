<template>
  <div class="balance-container">
    <img src="~@/assets/gard-logo.svg" />
    <div class="denom">
      {{denom}}
    </div>
    <div class="amount">
      {{amount}}
    </div>
  </div>
</template>

<script>
export default {
  name: "BalancePanel",
  props: {
    amount: { type: String, required: true },
    denom: { type: String, required: true }
  }
};
</script>

<style lang="scss" scoped>
.balance-container {
  flex-basis: 200px;
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
  .denom {
    font-size: 18px;
    margin-bottom: 16px;
  }
  .amount {
    font-size: 20px;
  }
}
</style>

