<template>
  <div class="card-container">
    <div
      class="header"
      v-if="title"
    >
      <p>{{ title }}</p>
      <a
        :href="link"
        target="_blank"
        class="link"
        v-if="link"
      >{{linkName}}</a>
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
    linkName: String,
    link: String
  }
};
</script>

<style lang="scss" scoped>
.card-container {
  border-radius: 2px;
  box-shadow: $shadow;
  background: white;
  border-radius: 4px;
  // max-width: $sm;
  // border: 1px solid rgba(0, 0, 0, 0.03);
  margin: 0 auto;
}

.header {
  display: flex;
  box-sizing: border-box;
  padding: 0 32px;
  width: 100%;
  height: 64px;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  border-bottom: $border;
  font-weight: bold;

  .link {
    font-size: 16px;
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


