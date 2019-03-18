<template>
  <div class="header-container">
    <div class="header">
      <div class="logo">
        <a href="/">
          <img
            alt="logo"
            src="~@/assets/logo.svg"
          />
          <span>SHIELD</span>
        </a>
      </div>

      <el-dropdown
        class="dropdown-menu"
        trigger="click"
        @command="handleCommand"
      >
        <i class="el-icon-more"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item,index) in menu"
            :key="index"
            :command="item.link"
          >
            {{item.name}}
          </el-dropdown-item>
          <el-dropdown-item>
            <a
              href="https://www.hashgard.pro"
              target="_blank"
              style="color:#606266"
            >Faucet</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { getMapper } from "vuex";
import { menu } from "@/constants";

export default {
  data() {
    return {
      value: "",
      menu
    };
  },
  props: {
    netName: String
  },
  methods: {
    handleCommand(v) {
      this.$router.push(v);
    }
  }
};
</script>

<style lang="scss" scoped>
.header-container {
  width: 100%;
  background: $color-background-card;
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 16px $basic-padding;
  max-width: $max-width;
  margin: 0 auto;
  .logo {
    flex-basis: 150px;
    flex-shrink: 0;
    font-size: $font-size-title;
    font-weight: bolder;
    a {
      color: $color-primary;
    }
    img {
      width: 40px;
    }
    span {
      position: relative;
      top: -8px;
    }
  }
}

.dropdown-menu {
  font-size: $font-size-title;
  i {
    position: relative;
    top: 8px;
    color: white;
  }
}
</style>
