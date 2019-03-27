<template>
  <div class="footer-container">
    <div class="footer">
      <el-col
        :xs="12"
        :sm="8"
      >
        <h1>{{$t('footer.community')}}</h1>
        <p><a
            href="https://t.me/hashgardeng"
            target="_blank"
          >Telegram</a></p>
        <p><a
            href="https://twitter.com/Hashgard1"
            target="_blank"
          >Twitter</a></p>
        <p><a
            href="https://medium.com/@hashgard"
            target="_blank"
          >Medium</a></p>
        <p><a
            href="https://www.reddit.com/r/Hashgard/"
            target="_blank"
          >Reddit</a></p>
        <p><a
            href="https://www.linkedin.com/company/hashgard/"
            target="_blank"
          >LinkedIn</a></p>
        <p><a
            href="https://www.facebook.com/gard.hash.5"
            target="_blank"
          >Facebook</a></p>
        <p><a
            href="http://weibo.com/p/1005056511186474/home?from=page_100505&mod=TAB&is_all=1#place"
            target="_blank"
          >Weibo</a></p>
        <el-popover
          placement="top"
          trigger="hover"
        >
          <img
            src="@/assets/wx.jpeg"
            width='200'
            height='200'
          />
          <a
            slot="reference"
            href="javascript:;"
          >Wechat</a>
        </el-popover>

      </el-col>
      <el-col
        :xs="12"
        :sm="8"
      >
        <h1>{{$t('footer.resources')}}</h1>
        <p><a href="https://www.gardplorer.io">{{$t('footer.plorer')}}</a></p>
        <!-- <p><a href="https://www.gardplorer.io">{{$t('footer.help')}}</a></p> -->
        <!-- <p><a href="https://www.gardplorer.io">{{$t('footer.announce')}}</a></p> -->
        <p><a href="https://hashgard.zendesk.com/hc/en-us/requests/new">{{$t('footer.contact')}}</a></p>
      </el-col>
      <el-col
        :xs="12"
        :sm="8"
      >
        <h1>{{$t('footer.about')}}</h1>
        <p><a href="https://www.hashgard.io">{{$t('footer.website')}}</a></p>
        <p><a href="mailto:contact@hashgard.io">{{$t('footer.collaborate')}}</a></p>
      </el-col>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.footer-container {
  width: 100%;
  background: $color-primary;
  padding: $basic-padding;
  color: white;

  .footer {
    padding: 16px $padding-large;
    max-width: $max-width;
    margin: 0 auto;

    h1 {
      font-size: 24px;
    }
    p {
      margin-bottom: 8px;
    }
    a {
      color: white;
      text-decoration: none;
    }
  }
}
</style>

