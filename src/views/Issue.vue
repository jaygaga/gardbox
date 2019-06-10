<template>
  <s-page
    class="issue-container"
    :link="link"
  >
    <router-view />
  </s-page>
</template>

<script>
export default {
  name: "Issue",
  computed: {
    link() {
      return this.$route.path.match("/issue/detail") ? "/issue" : null;
    }
  }
};
</script>

<style lang="scss" scoped>
.issue-container {
  margin: 0 auto;
}
</style>