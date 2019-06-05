<template>
  <div class="issue-container">
    <s-card :title="$t('issue.tokens')">
      <div class="tools">
        <el-button @click="() => $router.push('/issue/create')">{{$t('issue.create')}}</el-button>
        <el-input
          :placeholder="$t('global.search')"
          suffix-icon="el-icon-search"
          v-model="filter"
          @change="onSearch"
          class="search"
        />
      </div>

      <div class="th">
        <span class="icon"></span>
        <span>{{$t('issue.symbol')}}</span>
        <span>{{$t('issue.name')}}</span>
        <span>{{$t('issue.id')}}</span>
        <span class="supply">{{$t('issue.supply')}}</span>
        <span>{{$t('issue.time')}}</span>
      </div>
      <div class="tb">
        <div
          v-for="i in ls"
          :key="i.issue_id"
          @click="() => $router.push(`/issue/detail/${i.issue_id}`)"
          class="th tr"
        >
          <span class="icon">icon</span>
          <span>{{ i.symbol }}</span>
          <span>{{ i.name }}</span>
          <span>{{ i.issue_id }}</span>
          <span>{{ BigNumber(i.total_supply).dividedBy(Math.pow(10, i.decimals)).toFixed() | formatNumber }}</span>
          <span>{{ i.issue_time | formatTime }}</span>
        </div>
      </div>
    </s-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";

export default {
  name: "Issue",
  data() {
    return { filter: "" };
  },
  computed: {
    ...mapState("issue", ["tokens"]),
    ls() {
      if (this.filter) {
        const filter = this.filter.toLowerCase();
        return this.tokens.filter(
          i =>
            i.name.toLowerCase().match(filter) ||
            i.symbol.toLowerCase().match(filter) ||
            i.issue_id.match(filter)
        );
      }
      return this.tokens;
    }
  },
  methods: {
    BigNumber,
    onSearch(v) {
      this.filter = v;
    }
  },
  mounted() {
    this.$store.dispatch("issue/fetchTokens");
  }
};
</script>

<style lang="scss" scoped>
.issue-container .card-container {
  margin: 0 auto;
  max-width: $max-width;
  padding: $padding-large;

  .tools {
    display: flex;
    justify-content: space-between;

    .search {
      flex-basis: 320px;
    }
  }

  .th {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    padding: 16px $padding-basic;
    background: $color-background-card;
    border-radius: 4px;

    span {
      flex-basis: 160px;
      max-width: 160px;
      &.icon {
        max-width: 60px;
      }
    }
  }
  .tr {
    cursor: pointer;
    margin-top: 12px;
    &:hover {
      background: rgba($color: #fff, $alpha: 0.3);
    }
  }
}
</style>