<template>
  <div class="card-container">
    <div
      class="header"
      v-if="title"
    >
      <p>{{ title }}</p>
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
  // border: 1px solid rgba(0, 0, 0, 0.03);
  margin: 0 auto;
}

.header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;

  .line {
    width: 20%;
    margin: 16px auto;
    border-bottom: $border;
  }
}
.content {
  min-height: 50px;
  padding: $basic-padding;
}

@include responsive($sm) {
  .content {
    padding: 16px;
  }
}
</style>


