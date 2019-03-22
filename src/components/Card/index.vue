<template>
  <div class="card-container">
    <div
      class="header"
      v-if="title"
    >
      <p>{{ title.toUpperCase() }}</p>
      <RouterLink
        :to="link"
        class="link"
        v-if="link"
      >VIEW ALL</RouterLink>
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
    title: String,
    link: String,
    data: Array
  }
};
</script>

<style lang="scss" scoped>
.card-container {
  border-radius: 2px;
  color: rgba(255, 255, 255, 0.65);
  box-shadow: $shadow;
  // border: 1px solid rgba(0, 0, 0, 0.03);
  background: $color-background-card;
  margin: 24px 0;
}

.header {
  display: flex;
  box-sizing: border-box;
  padding: 0 32px;
  width: 100%;
  height: 64px;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  color: white;
  font-weight: bold;

  .link {
    text-decoration: none;
    color: $blue;
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


