<template>
  <router-link
    class="btn-panel"
    :to="link"
  >
    <img
      :alt="title"
      :src="src"
    />
    <div>
      <h4>{{title}}</h4>
      <p>{{breif}}</p>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "BtnPanel",
  props: {
    src: { type: String, required: true },
    title: { type: String, required: true },
    breif: { type: String, required: true },
    link: { type: String, required: true }
  }
};
</script>

<style lang="scss" scoped>
.btn-panel {
  padding: $padding-basic;
  background: $color-primary-dark;
  box-shadow: $shadow;
  display: flex;
  margin-bottom: $padding-basic;

  &:hover {
    background: $color-primary-light;
  }

  img {
    height: 80px;
    margin-right: $padding-basic;
  }
  h4 {
    font-size: 20px;
    font-weight: bold;
  }
  p {
    text-overflow: ellipsis;
    margin-bottom: 8px;
  }
}
</style>

