<template>
  <div class="home-container">
    <div class="banner">
      <BgEffect />
      <h1>
        {{$t('home.title')}}
      </h1>
      <h4>
        {{$t('home.banner')}}
      </h4>
    </div>
    <div class="banner-img">
      <img src="~@/assets/img-home.png" />
    </div>

    <div class="home-items">
      <div class="items">
        <div class="item">
          <img :src="icon1" />
          <h4>{{$t('home.itemTitle1')}}</h4>
          <div>{{$t('home.itemText1')}}</div>
        </div>
        <div class="item">
          <img :src="icon2" />
          <h4>{{$t('home.itemTitle2')}}</h4>
          <div>{{$t('home.itemText2')}}</div>
        </div>
        <div class="item">
          <img :src="icon3" />
          <h4>{{$t('home.itemTitle3')}}</h4>
          <div>{{$t('home.itemText3')}}</div>
        </div>
      </div>
    </div>

    <div class="home-links">
      <a
        class="link"
        href="https://t.me/hashgardeng"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'telegram-plane']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="https://twitter.com/Hashgard1"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'twitter']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="https://medium.com/@hashgard"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'medium']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="https://www.reddit.com/r/Hashgard/"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'reddit-alien']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="https://www.linkedin.com/company/hashgard/"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'linkedin']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="https://www.facebook.com/gard.hash.5"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'facebook']"
          size="2x"
        />
      </a>
      <a
        class="link"
        href="http://weibo.com/p/1005056511186474/home?from=page_100505&mod=TAB&is_all=1#place"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'weibo']"
          size="2x"
        />
      </a>
      <a
        class="link"
        v-popover:popover
        href="javascript:;"
      >
        <font-awesome-icon
          :icon="['fab', 'weixin']"
          size="2x"
        />
      </a>
      <el-popover
        placement="top"
        ref="popover"
        trigger="hover"
      >
        <img
          src="@/assets/wx.jpeg"
          width='200'
          height='200'
        />
      </el-popover>
    </div>

  </div>
</template>

<script>
import icon1 from "@/assets/icon-home-1.svg";
import icon2 from "@/assets/icon-home-2.svg";
import icon3 from "@/assets/icon-home-3.svg";

import BgEffect from "@/components/BackgroundEffect";

export default {
  components: { BgEffect },
  data() {
    return {
      icon1,
      icon2,
      icon3
    };
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  text-align: center;
  .banner {
    padding: $padding-large;
    margin-top: 80px;
    max-width: $max-width;
    margin: 0 auto;
    h1 {
      font-size: 32px;
      margin-top: 40px;
    }
    img {
      width: 90%;
      margin-top: 56px;
      margin-bottom: -140px;
    }
  }

  .banner-img {
    max-width: $max-width;
    margin: 0 auto -100px;
    padding: $padding-large;
    background: transparent;
    position: relative;
    z-index: 9;
    & > img {
      width: 100%;
    }
  }
  .home-items {
    background: white;
    .items {
      display: flex;
      max-width: $max-width;
      padding: 180px $padding-large 160px;
      margin: 0 auto;
      justify-content: space-between;
      .item {
        flex-basis: 360px;
        background: white;
        box-shadow: 1px 1px 16px 0px rgba(0, 0, 0, 0.06);
        border-radius: 16px;
        padding: $padding-large;
        margin: 16px;
        color: gray;
        font-size: 14px;
        img {
          width: 80px;
        }
        h4 {
          font-size: 18px;
          color: rgba(0, 0, 0, 0.85);
          margin-bottom: 16px;
        }
      }
    }
  }

  .home-links {
    padding: 100px 16px 160px;
    margin: 0 auto -72px;
    background-color: #3d3b58;
    .link {
      color: $color-font;
      display: inline-block;
      width: 64px;
      height: 64px;
      padding: 16px;
      margin: 16px;
      border-radius: 32px;
      background: $color-background-card;
      &:hover {
        background: $color-primary-light;
      }
    }
  }
}

@include responsive($sm) {
  .home-container {
    .banner {
      img {
        width: 100%;
        margin-bottom: -80px;
      }
    }
    .banner-img {
      padding: 0;
      margin-bottom: -40px;
    }
    .home-items {
      .items {
        padding: 100px $padding-large 80px;
        flex-direction: column;
      }
    }
    .home-links {
      .link {
        margin: 8px;
      }
    }
  }
}
</style>

