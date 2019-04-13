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
        <el-dropdown-item
          command="delete"
          class="btn-delete"
        >{{$t('passport.delete')}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      :title="`${$t('passport.backup')} ${user}`"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="420px"
    >
      <a
        class="btn-backup btn-copy"
        v-clipboard:copy="JSON.stringify(userMap[user])"
        v-clipboard:success="onCopy"
      ><i class="el-icon-document"></i>{{$t('passport.backupCopy')}}</a>
      <a
        class="btn-backup"
        :download="`${user}.keyStore.txt`"
        :href="fileLink"
      ><i class="el-icon-download"></i>{{$t('passport.backupFile')}}</a>
    </el-dialog>
  </div>
</template>

<script>
import { get, set, isEmpty } from "lodash";

export default {
  name: "selectContent",
  props: {
    userMap: Object,
    user: String
  },
  data() {
    return { dialogVisible: false, fileLink: "" };
  },
  methods: {
    handleClick(e) {
      e.stopPropagation();
    },
    handleCommand(user, cmd) {
      const cmds = {
        edit: this.edit,
        backup: this.backup,
        delete: this.delete
      };
      cmds[cmd](user);
    },
    edit(user) {
      const inputValidator = v => {
        const name = v.trim();
        if (name.length === 0) {
          return this.$t("global.required", { name: this.$t("create.name") });
        }
        if (name !== user && !isEmpty(this.userMap[name])) {
          return this.$t("create.exist");
        }
        return true;
      };
      this.$prompt("", this.$t("passport.edit"), {
        confirmButtonText: this.$t("global.ok"),
        cancelButtonText: this.$t("global.cancel"),
        inputValue: user,
        inputValidator
      })
        .then(({ value }) => {
          this.$store.dispatch("account/editName", { user, name: value });
          this.$message({
            type: "success",
            message: this.$t("global.success", {
              name: this.$t("passport.edit")
            })
          });
        })
        .catch(() => {});
    },
    backup(user) {
      this.$prompt(
        this.$t("create.pass"),
        `${this.$t("passport.backup")} ${user}`,
        {
          confirmButtonText: this.$t("global.ok"),
          cancelButtonText: this.$t("global.cancel"),
          inputType: "password",
          inputValidator: v =>
            v.trim().length > 0
              ? true
              : this.$t("global.required", { name: this.$t("create.pass") })
        }
      )
        .then(({ value }) => {
          this.$store
            .dispatch("account/backup", {
              user,
              pass: value
            })
            .then(key => {
              this.dialogVisible = true;
            })
            .catch(e => {
              console.log(e);
              this.$message.error(
                `${this.$t("create.pass")} ${this.$t("global.error")}`
              );
            });
        })
        .catch(() => {});
    },
    onCopy() {
      this.$message({
        type: "success",
        message: this.$t("main.copy")
      });
    },
    delete(user) {
      this.$confirm(
        this.$t("passport.deleteWarn"),
        `${this.$t("passport.delete")} ${user}`,
        {
          confirmButtonText: this.$t("global.ok"),
          cancelButtonText: this.$t("global.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          this.doDelete(user);
        })
        .catch(() => {});
    },
    doDelete(user) {
      const successMsg = this.$t("global.success", {
        name: this.$t("passport.delete")
      });
      this.$prompt(
        this.$t("create.pass"),
        `${this.$t("passport.delete")} ${user}`,
        {
          confirmButtonText: this.$t("global.ok"),
          cancelButtonText: this.$t("global.cancel"),
          inputType: "password",
          inputValidator: v =>
            v.trim().length > 0
              ? true
              : this.$t("global.required", { name: this.$t("create.pass") }),
          beforeClose: (action, ins, done) => {
            if (action !== "confirm") {
              return done();
            }
            this.$store
              .dispatch("account/delete", {
                user,
                pass: ins.inputValue
              })
              .then(res => {
                this.$message({
                  type: "success",
                  message: successMsg
                });
                done();
              })
              .catch(e => {
                console.log(e);
                this.$message.error(
                  `${this.$t("create.pass")} ${this.$t("global.error")}`
                );
              });
          }
        }
      )
        .then(({ value }) => {})
        .catch(() => {});
    }
  },
  mounted() {
    this.fileLink = URL.createObjectURL(
      new Blob([JSON.stringify(this.userMap[this.user])])
    );
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
.btn-delete,
.btn-delete:hover {
  color: red;
}

.btn-backup {
  display: block;
  padding: $padding-basic;
  margin-top: $padding-basic;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  i {
    margin-right: 16px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &.btn-copy {
    margin-top: 0;
  }
}
</style>


