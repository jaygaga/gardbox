<template>
  <div id="app">
    <Header />
    <div class="main">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header/index.vue";
import Footer from "@/components/Footer/index.vue";

import { mapState } from "vuex";

export default {
  components: { Header, Footer }
};
</script>

<style lang="scss">
@import "~@/styles/_reset.scss";
@import "~@/styles/_common.scss";

html,
body {
  font-size: 14px;
  line-height: 1.571428;
  font-family: "PingFangSC", Microsoft YaHei, "Helvetica Neue", Helvetica, Arial,
    STHeiTi, sans-serif;
  color: rgba(255, 255, 255, 0.85);
  background: $color-background;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .main {
    flex: 1;
    max-width: $max-width;
    padding: 0 24px;
    margin: 0 auto;
  }
}

@include responsive($sm) {
  #app {
    .main {
      padding: 0 16px;
    }
  }
}
</style>
