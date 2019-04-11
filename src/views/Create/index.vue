<template>
  <s-page class="create-container">
    <RouterView />
  </s-page>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

import Password from "./password";
import Mnemonic from "./mnemonic";
import Confirm from "./confirm";

export default {
  name: "Create",
  components: { Password, Mnemonic, Confirm },
  data() {
    return {
      step: 0
    };
  },
  methods: {
    onStepChange(i) {
      this.step = i;
      // if (this.step < 2) {
      //   this.step++;
      // } else {
      //   this.$router.push("/main");
      // }
    }
  }
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

