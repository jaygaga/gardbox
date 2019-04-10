<template>
  <div class="page-container">
    <div class="header">
      <a
        href="javascript:;"
        @click="$router.back()"
      >
        <i class="el-icon-back"></i>
      </a>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "Page",
  props: {
    title: String,
    linkName: String,
    link: String
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  max-width: $max-width;
  margin: 0 auto;
  a {
    color: rgba(255, 255, 255, 0.75);
    font-size: 28px;
    transition: color 0.3s ease 0s;
    &:hover {
      color: white;
    }
  }
}

.header {
  text-align: right;
}
.content {
  min-height: 50px;
}
</style>


