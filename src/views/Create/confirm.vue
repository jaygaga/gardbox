<template>
  <el-form
    ref="form"
    :model="form"
  >
    <div class="label">
      <a
        class="btn-back"
        @click="onPrev"
      >{{$t('global.back')}}</a>

      <a
        class="btn-reset"
        @click="reset"
      >{{$t('create.reset')}}</a>
    </div>

    <el-input
      class="input"
      type="textarea"
      :autosize="{ minRows: 6, maxRows: 8}"
      :value="phraseValue"
    >
    </el-input>

    <div class="label">
      {{$t('create.confirm')}}
    </div>

    <el-row :gutter="16">
      <el-col
        :xs="8"
        :sm="4"
        class="item"
        v-for="i in buttonList"
        :key="i"
      >

        <el-button
          type="primary"
          class="btn"
          @click="() => onClick(i)"
        >{{i}}</el-button>
      </el-col>
    </el-row>

  </el-form>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get, sortBy } from "lodash";

const phrase = [];
for (let i = 0; i < 24; i++) {
  phrase[i] = "33";
}

export default {
  name: "Mnemonic",
  props: {
    onStepChange: { type: Function, required: true }
  },
  data() {
    return {
      form: { phrase: "" },
      phraseList: []
    };
  },
  computed: {
    ...mapState("account", ["account"]),
    buttonList: function() {
      if (!this.account.phrase) return [];
      const origin = this.account.phrase.split(" ");
      // const {phraseList} = this;
      if (this.phraseList.length) {
        return sortBy(origin.filter(i => !this.phraseList.find(j => i === j)));
      }
      return sortBy(origin);
    },
    phraseValue: function() {
      return this.phraseList.join(" ");
    }
  },
  methods: {
    onClick(i) {
      this.phraseList.push(i);
      if (this.buttonList.length === 0) {
        if (this.phraseList.join(" ") !== this.account.phrase) {
          this.$message({
            type: "error",
            message: "Wrong Mnemonic!"
          });
          reset();
          return;
        }

        this.$store.dispatch("account/finishCreate");
        this.onFinish();
      }
    },
    reset() {
      this.phraseList = [];
    },
    onPrev() {
      this.onStepChange(1);
    },
    onFinish() {
      this.$alert(this.$t("create.backup"), this.$t("create.success"), {
        confirmButtonText: this.$t("global.ok"),
        callback: action => {
          this.$router.push("home");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.input {
  margin-bottom: 32px;
}
.label {
  margin-bottom: 16px;
  a {
    color: $color-primary;
    cursor: pointer;
  }
  .btn-reset {
    float: right;
  }
}
.item {
  margin-bottom: 8px;
}
.btn {
  width: 100%;
}
</style>
