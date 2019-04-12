<template>
  <div class="item-content">
    <div class="name">
      <div>{{user}}</div>
      <p>{{userMap[user].address}}</p>
    </div>

    <el-dropdown @command="v => handleCommand(user, v)">
      <span
        @click="handleClick"
        class="el-dropdown-link"
      >
        <i class="el-icon-more"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="edit">{{$t('passport.edit')}}</el-dropdown-item>
        <el-dropdown-item command="backup">{{$t('passport.backup')}}</el-dropdown-item>
        <el-dropdown-item command="delete">{{$t('passport.delete')}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "selectContent",
  props: {
    userMap: Object,
    user: String,
    handleCommand: Function
  },
  methods: {
    handleClick(e) {
      e.stopPropagation();
    }
  }
};
</script>

<style lang="scss" scoped>
.item-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    margin-top: 16px;
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .el-dropdown-link {
    padding: $padding-basic;
    margin-right: -$padding-basic;
    i {
      font-size: $padding-basic;
    }
  }
}
</style>


