<template>

  <el-table
    class="table"
    :data="list"
    v-loading="load"
    style="width: 100%"
  >
    <el-table-column
      v-for="item in fields"
      :key="item.name"
      :label="item.name"
    >
      <template slot-scope="scope">
        <s-link
          v-if="item.linkType"
          :type="item.linkType"
          :content="get(scope.row, item.field)"
        />
        <span v-if="!item.linkType">
          {{ item.field instanceof Array ? item.field.map(i => get(scope.row, i)).join(' ') : get(scope.row, item.field) || '-' }}
        </span>
      </template>
    </el-table-column>

    <el-table-column
      prop="header.num_txs"
      label="TIME"
    >
      <template slot-scope="scope">
        {{ get(blocks, [scope.row.height, 'block', 'header', 'time']) | formatTime }}
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
import { isEmpty, get } from "lodash";
import { mapGetters, mapState } from "vuex";

export default {
  props: {
    list: Array,
    fields: Array,
    load: { type: Boolean, default: false }
  },
  methods: { get },
  computed: {
    ...mapState("account", ["blocks"])
  },
  watch: {
    list: function() {
      if (isEmpty(this.list)) {
        return false;
      }
      this.list.forEach(item => {
        this.$store.dispatch("account/fetchBlock", get(item, "height"));
      });
    }
  }
};
</script>

