<template>
  <div class="create-container">

    <el-steps
      :active="1"
      simple
    >
      <el-step title="Generate Wallet"></el-step>
      <el-step title="Save Seeds"></el-step>
      <el-step title="Confirm Seeds"></el-step>
    </el-steps>

    <password />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

import Password from "./password";

export default {
  name: "Create",
  components: { Password },
  data() {
    return {
      form: {
        name: "",
        password: "",
        password2: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>

<style lang="scss" scoped>
.create-container {
  color: white(0.85);
  padding: 16px 0;

  .el-steps--simple {
    background: $color-background-card;
  }
}
</style>

