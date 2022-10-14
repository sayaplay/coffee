<template>
  <div class="like">
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <BgBox>
      <div v-if="likeProduct.length > 0">
        <div class="prodict-item" >
          <div class="like-box">
            <div v-for="(item, index) in likeProduct" :key="index" @click="goDetail(item.pid)">
              <ProductItem :item="item" class="like-item" @remove="removeLikeProduct(item.pid,index)" :is-remove="true"></ProductItem>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <van-empty description="没有收藏商品" />
      </div>
    </BgBox>
  </div>
</template>

<script>
import "../assets/less/like.less";
import BgBox from "../components/BgBox";
import ProductItem from "../components/ProductItem";

export default {
  name: "Like",
  components: {
    BgBox,
    ProductItem,
  },
  created() {
    this.getLikeProduct();
  },
  data() {
    return {
      likeProduct: [],
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    // 获取收藏商品
    getLikeProduct() {
      let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("findAllLike result ==> ", result);
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 2000) {
            this.likeProduct = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("findAllLike err ==> ", err);
        });
    },

    //查看商品详情
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },

    // 删除收藏商品
    removeLikeProduct(pid, index) {
      let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          tokenString,
          pid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("removeLikeProduct result ==> ", result);
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 900) {
            this.likeProduct.splice(index, 1);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("removeLikeProduct err ==> ", err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>