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
      <Password
        v-if="step === 0"
        :onNext="onSubmit"
      />
      <Mnemonic
        v-if="step === 1"
        :onNext="onSubmit"
      />
      <Mnemonic
        v-if="step === 2"
        :onNext="onSubmit"
      />
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
      step: 0
    };
  },
  methods: {
    onSubmit() {
      if (this.step < 2) {
        this.step++;
      } else {
        this.$router.push("/home");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.create-container {
  color: white(0.85);
  padding: 16px 0;
  width: $sm;

  .el-steps--simple {
    background: $color-background-card;
  }
}
</style>

