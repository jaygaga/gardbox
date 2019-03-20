<template>
  <el-form
    ref="form"
    :model="form"
    label-position="top"
  >
    <el-form-item label="Account Name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>

    <el-form-item label="Password">
      <el-input v-model="form.password"></el-input>
    </el-form-item>

    <el-form-item label="Confirm Password">
      <el-input v-model="form.password2"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get } from "lodash";

export default {
  name: "Password",
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
.home-container .item {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 14px;

  > p {
    margin-bottom: 10px;
  }
  > p:last-child {
    margin-bottom: 0;
  }
}

.block > .height {
  flex: 1;
  color: $blue;
}

.block > .txn {
  flex-basis: 100%;
}

.block > .time {
  color: rgba(0, 0, 0, 0.65);
}

.transactions > .gas {
  flex-basis: 100%;
}
</style>

