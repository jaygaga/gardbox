<template>
  <div class="card-container">
    <div class="header">
      <p v-if="title">{{ title }}</p>
      <div class="line"></div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "card",
  props: {
    title: String
  }
};
</script>

<style lang="scss" scoped>
.card-container {
  border-radius: 4px;
  max-width: $xs;
  margin: 0 auto;
}

.header {
  width: 100%;
  font-size: 24px;
  text-align: center;

  .line {
    width: 20%;
    margin: $padding-large auto;
    border-bottom: $border;
  }
}
.content {
  min-height: 50px;
}
</style>


