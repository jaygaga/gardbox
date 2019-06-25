<template>
  <div class="tab-freeze">
    <div class="tools">
      <div>
        <el-button
          class="btn"
          :disabled="!setting.freeze"
          @click="() => this.$router.push(`/issue/freeze/${$route.params.id}?action=freeze`)"
        >{{$t('freeze.freeze')}}</el-button>
        <el-button
          class="btn"
          :disabled="!setting.freeze"
          @click="() => this.$router.push(`/issue/freeze/${$route.params.id}?action=unfreeze`)"
        >{{$t('freeze.unfreeze')}}</el-button>
      </div>
      <el-input
        :placeholder="$t('global.search')"
        suffix-icon="el-icon-search"
        v-model="filter"
        @change="onSearch"
        class="search"
      />
    </div>

    <div class="tb-container">
      <div class="tb">
        <div class="th">
          <span class="action">{{$t('mint.action')}}</span>
          <span>{{$t('freeze.type')}}</span>
          <span>{{$t('mint.address')}}</span>
          <span>{{$t('freeze.end')}}</span>
          <span>{{$t('send.time')}}</span>
        </div>
        <div
          v-for="i in ls"
          :key="i.txhash"
          class="th tr"
        >
          <span class="action">{{ get(i, 'tags.0.value') === 'issue_freeze' ? $t('freeze.freeze') : $t('freeze.unfreeze') }}</span>
          <span>{{ get(i, 'tags.4.value') }}</span>
          <span>{{ get(i, 'tx.value.msg.0.value.accAddress') | gardAddr }}</span>
          <span v-if="get(i, 'tx.value.msg.0.value.end_time')">{{ get(i, 'tx.value.msg.0.value.end_time') | formatTime }}</span>
          <span v-else>-</span>
          <span>{{ i.timestamp | formatTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import { get, isEmpty } from "lodash";

import { getViewToken } from "@/utils/helpers";
import webc from "@/utils/webc";
export default {
  name: "TabFreeze",
  props: {
    setting: Object
  },
  data() {
    return {
      filter: ""
    };
  },
  computed: {
    ...mapState("issue", ["txs", "tokenMap"]),
    ls() {
      if (this.filter) {
        const filter = this.filter.toLowerCase();
        return this.txs.filter(i => {
          const target =
            get(i, "tx.value.msg.0.value.accAddress") ||
            get(i, "tx.value.msg.0.value.sender");
          return target.match(filter);
        });
      }
      return this.txs;
    }
  },
  methods: {
    get,
    getViewToken,
    onSearch(v) {
      this.filter = v;
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-freeze {
  margin-top: $padding-basic;

  .tools {
    display: flex;
    justify-content: space-between;

    .search {
      flex-basis: 320px;
    }
  }
  .tb-container {
    overflow: hidden;
    .tb {
      overflow-x: scroll;
      padding-bottom: 24px;
      margin-bottom: -24px;
    }
  }

  .th {
    display: flex;
    justify-content: space-between;
    min-width: 900px;
    margin-top: 16px;
    padding: 16px $padding-basic;
    background: $color-background-card;
    border-radius: 4px;

    span {
      flex-basis: 160px;
      max-width: 160px;
      &.action {
        flex-basis: 100px;
      }
    }
  }
  .tr {
    margin-top: 12px;
    &:hover {
      background: rgba($color: #fff, $alpha: 0.3);
    }
  }
}
.btn {
  padding: 16px;
  min-width: 120px;
}

@include responsive($sm) {
  .tab-freeze {
    .tools {
      flex-wrap: wrap;
      .search {
        flex-basis: 100%;
        margin-top: 16px;
      }
    }
  }
}
</style>

