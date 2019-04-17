<template>

  <s-card :title="$t('create.confirm')">
    <div class="label">
      <a
        class="btn-reset"
        @click="reset"
      >{{$t('create.reset')}}</a>
    </div>

    <el-form
      ref="form"
      :model="form"
      label-position="top"
      class="phrase-container"
    >
      <el-form-item
        v-for="i in Object.keys(form)"
        :key="i"
        :prop="i"
        class="word-input"
      >
        <el-input
          :value="form[i]"
          :placeholder="i"
          @focus="() => handleFocus(i)"
          @clear="() => handleClear(i)"
          :ref="`input_${i}`"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>

    <el-row :gutter="8">
      <el-col
        :xs="6"
        :sm="6"
        class="item"
        v-for="i in buttonList"
        :key="i"
      >
        <el-button
          class="btn"
          @click="() => onClick(i)"
        >{{i}}</el-button>
      </el-col>
    </el-row>
  </s-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { get, sortBy } from "lodash";

const phrase = {};
for (let i = 1; i < 25; i++) {
  phrase[`${i}`] = "";
}

export default {
  name: "Confirm",
  data() {
    return {
      form: { ...phrase },
      focusInput: "1"
    };
  },
  computed: {
    ...mapState("account", ["account"]),
    buttonList: function() {
      if (!this.account.phrase) return [];
      const origin = this.account.phrase.split(" ");
      const phraseList = Object.values(this.form);
      if (phraseList.length) {
        return sortBy(origin.filter(i => !phraseList.find(j => i === j)));
      }
      return sortBy(origin);
    }
  },
  methods: {
    onClick(v) {
      this.form[this.focusInput] = v;
      if (this.focusInput < 24) {
        this.focus(`${this.focusInput - 0 + 1}`);
      }

      // submit after all buttons clicked
      if (this.buttonList.length === 0) {
        if (Object.values(this.form).join(" ") !== this.account.phrase) {
          this.$message({
            type: "error",
            message: this.$t("create.mnemonicWarn")
          });
          return;
        }

        this.$store.dispatch("account/finishCreate");
        this.onFinish();
      }
    },
    reset() {
      this.form = { ...phrase };
      this.focus("1");
    },
    handleFocus(i) {
      this.focusInput = i;
    },
    focus(i) {
      this.focusInput = i;
      this.$refs[`input_${i}`][0].focus();
    },
    handleClear(i) {
      this.form[i] = "";
      this.focus(i);
    },
    onFinish() {
      this.$alert(this.$t("create.backup"), this.$t("create.success"), {
        confirmButtonText: this.$t("global.ok"),
        callback: action => {
          this.$router.push("/main?tab=assets");
        }
      });
    }
  },
  mounted() {
    this.focus("1");
  }
};
</script>

<style lang="scss" scoped>
.label {
  margin-bottom: 12px;
  text-align: right;
  a {
    cursor: pointer;
  }
}
.phrase-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-left: -4px;
  margin-right: -4px;
  margin-bottom: 16px;
  .word-input {
    flex-basis: 100px;
    flex-grow: 1;
    margin: 4px;
    input.el-input__inner {
      padding-left: 8px;
      height: 40px;
    }
  }
}
.item {
  margin-bottom: 8px;
}
.btn {
  width: 100%;
}
@include responsive($sm) {
  .phrase-container {
    .word-input {
      flex-basis: 80px;
    }
  }
}
</style>
