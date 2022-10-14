<template>
  <div class="menu">
    <div class="menu-nav">
      <div class="menu-search">
        <van-search placeholder="输入商品名称" @click="goPage" />
      </div>
      <div class="menu-option">
        <div
          class="menu-item"
          v-for="(item, index) in menuOptions"
          :key="index"
          @click="toggleMenu(index, item.type)"
        >
          <div class="m-item">
            <div class="m-icon">
              <img
                :src="menuIndex == index ? item.activeIcon : item.inactiveIcon"
                alt=""
                class="auto-img"
              />
            </div>
            <div class="m-text">{{ item.title }}</div>
          </div>
        </div>
      </div>

      <div class="menu-product">
        <div
          class="clearfix m-pro-item"
          v-for="(item, index) in productData"
          :key="index"
          @click="goDetail(item.pid)"
        >
          <div class="pro-img fl">
            <img :src="item.smallImg" class="auto-img" alt="" />
          </div>
          <div class="text fl">
            <div class="pro-text">
              <div class="pro-name">{{ item.name }}</div>
              <div class="pro-ename">{{ item.enname }}</div>
            </div>
          </div>
          <div class="price fl">￥{{ item.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
export default {
  name: "Menu",
  data() {
    return {
      menuIndex: 0,
      menuOptions: [
        {
          title: "推荐",
          inactiveIcon: require("../assets/images/icons_09.gif"),
          activeIcon: require("../assets/images/icons_21.gif"),
        },
        {
          title: "拿铁",
          inactiveIcon: require("../assets/images/icons_05.gif"),
          activeIcon: require("../assets/images/icons_19.gif"),
        },
        {
          title: "咖啡",
          inactiveIcon: require("../assets/images/icons_03.gif"),
          activeIcon: require("../assets/images/icons_18.gif"),
        },
        {
          title: "瑞纳冰",
          inactiveIcon: require("../assets/images/icons_07.gif"),
          activeIcon: require("../assets/images/icons_20.gif"),
        },
      ],
      productData: [],
    };
  },
  created() {
    this.getTypes();
  },
  methods: {
    // 切换菜单
    toggleMenu(index, type) {
      if (this.menuIndex == index) {
        return;
      }
      this.menuIndex = index;
      this.getProductByType(type);
    },

    //获取商品类型
    getTypes() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("getTypes result ==> ", result);

          if (result.data.code == 400) {
            let data = result.data.result;
            data.unshift({
              type: "isHot",
              typeDesc: "推荐",
            });

            this.menuOptions.map((v) => {
              for (let i = 0; i < data.length; i++) {
                if (v.title == data[i].typeDesc) {
                  v.type = data[i].type;
                  break;
                }
              }
            });
            let type = this.menuOptions[this.menuIndex].type;
            this.getProductByType(type);
            // console.log(this.menuOptions);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //根据类型获取商品
    getProductByType(type) {
      let params = {
        appkey: this.appkey,
      };
      if (type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      } else {
        params.key = "type";
        params.value = type;
      }
      console.log(params);
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params,
      })
        .then((result) => {
          this.$toast.clear();
          console.log("getTypes result ==> ", result);
          if (result.data.code == 500) {
            this.productData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    // 查看商品详情

    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },
    // 跳转到搜索页面
    goPage() {
      this.$router.push({ name: "Search" });
    },
  },
};
</script>

<style lang="less" scoped>
</style> 