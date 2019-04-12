<template>
  <s-page class="create-container">
    <RouterView />
  </s-page>
</template>

<script>
export default {
  name: "Create"
};
</script>

<style lang="scss" scoped>
.create-container {
  padding: $padding-large;
  width: 100%;
}
@include responsive($sm) {
  .create-container {
    padding: $padding-large / 2;
  }
}
</style>

