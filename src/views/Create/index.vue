<template>
  <div class="create-container">

    <s-card :title="$t('passport.create')">

      <el-steps
        class="steps"
        :active="step"
        v-if="step < 3"
        align-center
      >
        <el-step :title="$t('create.step1')"></el-step>
        <el-step :title="$t('create.step2')"></el-step>
        <el-step :title="$t('create.step3')"></el-step>
      </el-steps>

      <Password
        class="create-form"
        v-show="step === 0"
        :onStepChange="onStepChange"
      />
      <Mnemonic
        class="create-form"
        v-if="step === 1"
        :onStepChange="onStepChange"
      />
      <Confirm
        class="create-form"
        v-if="step === 2"
        :onStepChange="onStepChange"
      />
    </s-card>
  </div>
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
      //   this.$router.push("/home");
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
.create-container {
  padding: $padding-large;
  width: 100%;

  .steps {
    padding: $padding-basic 0;
  }
}
@include responsive($sm) {
  .create-container {
    padding: $padding-large / 2;
  }
}
</style>

