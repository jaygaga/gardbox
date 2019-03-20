<template>
  <div class="create-container">

    <el-steps
      :active="step"
      simple
    >
      <el-step title="Create"></el-step>
      <el-step title="Mnemonic"></el-step>
      <el-step title="Confirm"></el-step>
    </el-steps>

    <s-card>
      <Password v-if="step === 0" />
      <Mnemonic v-if="step === 1" />
      <Mnemonic v-if="step === 2" />
      <el-button
        type="primary"
        class="btn"
        @click="onSubmit"
      >{{ step === 2 ? "Finish" : "Next" }}</el-button>
    </s-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

import Password from "./password";
import Mnemonic from "./mnemonic";

export default {
  name: "Create",
  components: { Password, Mnemonic },
  data() {
    return {
      step: 0,
      form: {
        name: "",
        password: "",
        password2: ""
      }
    };
  },
  methods: {
    onSubmit() {
      if (this.step < 2) {
        this.step++;
      }
      console.log("submit!");
    }
  }
};
</script>

<style lang="scss" scoped>
.create-container {
  color: white(0.85);
  padding: 16px 0;
  width: $sm;

  .btn {
    width: 100%;
  }

  .el-steps--simple {
    background: $color-background-card;
  }
}
</style>

