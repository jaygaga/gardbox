<template>
  <el-form label-position="top">
    <el-form-item label="Your Mnemonic">
      <el-input
        type="textarea"
        :autosize="{ minRows: 8, maxRows: 12}"
        :value="mnem"
      >
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Mnemonic",
  data() {
    return {
      mnem: "who are you this is your mnem haha"
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>


