<template>
  <div class="search">
    <van-nav-bar left-text="返回" left-arrow fixed @click-left="back">
      <template #right>
        <div class="home-search">
          <van-search
            v-model="name"
            placeholder="输入商品名称"
            ref="search"
            @click="search"
            show-action
          />
        </div>
      </template>
    </van-nav-bar>

    <BgBox>
      <div class="prodict-item">
        <div class="like-box">
          <div
            v-for="(item, index) in products"
            :key="index"
            @click="goDetail(item.pid)"
          >
            <ProductItem :item="item" class="like-item"></ProductItem>
          </div>
        </div>
      </div>
    </BgBox>
  </div>
</template>

<script>
import ProductItem from "../components/ProductItem";
import BgBox from "../components/BgBox";
export default {
  name: "Search",
  components: {
    ProductItem,
    BgBox,
  },
  data() {
    return {
      // 搜索
      name: "",
      // 商品
      products: [],
    };
  },
  created(){
    this.$nextTick(()=>{
      // 获取搜索框
      let searchIpt = this.$refs.search.querySelector('[type="search"]')
      console.log(searchIpt);
      // 获取焦点
      searchIpt.focus();
    })
    },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 搜索商品
    search() {
      console.log("11");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/search",
        params: {
          appkey: this.appkey,
          name: this.name,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("search result ==> ", result);
          if (result.data.code == "Q001") {
            this.products = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //查看商品详情
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  padding-top: 46px;
  /deep/ .home-search .van-search {
    padding: 0;
    border-radius: 17px;
    overflow: hidden;
  }

  /deep/ .home-search .van-icon {
    color: #0c34ba;
  }
  /deep/ .van-nav-bar__right {
    width: calc(~"100% - 110px");
  }

  .home-search {
    width: 100%;
  }

  /deep/ .van-nav-bar .van-icon {
    color: #0c34ba;
  }

  /deep/ .van-nav-bar__text {
    color: #0c34ba;
  }
  .like-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>