<template>
  <div class="balance-container">
    <div class="icon">
      <img src="~@/assets/gard-logo.svg" />
    </div>
    <div class="amount">
      {{amount}} <span>GARD</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "BalancePanel",
  props: {
    amount: { type: String, required: true }
  }
};
</script>

<style lang="scss" scoped>
.balance-container {
  height: 64px;
  display: flex;
  margin: $padding-basic;

  .icon {
    flex-basis: 64px;
    flex-shrink: 0;
    background: white;
    box-shadow: $shadow;
    border-radius: 32px;
    text-align: center;
    padding: 8px;
    img {
      width: 40px;
      height: 40px;
      margin-top: 2px;
      position: relative;
      top: 2px;
    }
  }

  .amount {
    flex-grow: 1;
    text-align: left;
    font-size: 30px;
    padding-top: 12px;
    padding-left: 12px;
    span {
      font-size: 24px;
    }
  }
}

@include responsive($sm) {
  .balance-container {
    margin: 0;
    .amount {
      padding-top: 4px;
      font-size: 20px;
      span {
        display: block;
        font-size: 16px;
      }
    }
  }
}
</style>

