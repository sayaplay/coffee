<template>
  <div class="main">
    <!-- 二级路由 -->
    <div>
      <router-view></router-view>
    </div>

    <van-tabbar
      v-model="activeName"
      inactive-color="#646566"
      active-color="#0C34BA"
      route
    >
      <van-tabbar-item
        v-for="(item, index) in tabbarData"
        :icon="item.icon"
        :key="index"
        :name="item.name"
        replace
        :to="item.path"
      >
        <span> {{ item.title }}</span>
        <template #icon="props">
          <img :src="props.active ? item.activeImg : item.inactiveImg" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      // 激活下标
      activeName: "Home",
      tabbarData: [
        {
          title: "首页",
          icon: "home-o",
          // 名字跳转路由
          name: "Home",
          // 路由模式:路劲
          path: "/home",
          inactiveImg: require("../assets/images/home.png"),
          activeImg: require("../assets/images/home_active.png"),
        },
        {
          title: "菜单",
          icon: "search",
          name: "Menu",
          path: "/menu",
          inactiveImg: require("../assets/images/menu.png"),
          activeImg: require("../assets/images/menu_active.png"),
        },
        {
          title: "购物袋",
          icon: "friends-o",
          name: "Shopbag",
          path: "/shopbag",
          inactiveImg: require("../assets/images/shopbag.png"),
          activeImg: require("../assets/images/shopbag_active.png"),
        },
        {
          title: "我的",
          icon: "setting-o",
          name: "My",
          path: "/my",
          inactiveImg: require("../assets/images/my.png"),
          activeImg: require("../assets/images/my_active.png"),
        },
      ],
    };
  },
  methods: {
    // changeActive(name) {
    //   this.$router.push(name);
    // },
  },
};
</script>

<style lang="scss" scoped>
</style>