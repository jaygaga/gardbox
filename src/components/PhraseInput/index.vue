<template>
  <div class="phrase-container">
    <el-autocomplete
      v-for="i in Object.keys(phrase)"
      :key="i"
      class="word-input"
      v-model="phrase[`${i}`]"
      :fetch-suggestions="(query, callback) => querySearch(i, query, callback)"
      :placeholder="`${i - 0 + 1}`"
      :trigger-on-focus="false"
      @change="v => handleChange(i, v)"
      @select="v => handleSelect(i, v)"
      clearable
    ></el-autocomplete>
  </div>

</template>

<script>
import { get } from "lodash";
import { wordList } from "@/constants/wordList";

const phrase = {};
for (let i = 0; i < 24; i++) {
  phrase[`${i}`] = "";
}

export default {
  data() {
    return {
      wordList,
      phrase
    };
  },
  props: {
    onChange: Function
  },
  methods: {
    handleChange(i, v) {
      console.log(v);
      this.onChange(this.phrase);
    },
    querySearch(i, query, callback) {
      this.handleChange(i, query);

      const words = query
        ? this.wordList.filter(w => w.indexOf(query) > -1)
        : this.wordList;
      callback(words.map(w => ({ value: w })));
    },
    handleSelect(i, v) {
      this.handleChange(i, v);
    }
  }
};
</script>

<style lang="scss" scoped>
.phrase-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .word-input {
    flex-basis: 100px;
    margin-bottom: 8px;
    // width: 25%;
  }
}
</style>

