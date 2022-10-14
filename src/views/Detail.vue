<template>
  <div class="detail">
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <div>
      <div>
        <img class="auto-img" :src="productDetail.large_img" alt="" />
      </div>
      <div class="pro-info-box">
        <div class="pro-info">
          <div class="clearfix pro-box">
            <div class="fl">
              <div class="pro-name">{{ productDetail.name }}</div>
              <div class="pro-enname">{{ productDetail.enname }}</div>
            </div>
            <div class="fr pro-price">￥{{ productDetail.price }}</div>
          </div>

          <div>
            <!-- 商品规格 -->
            <div class="rule-box">
              <div
                class="rule-items clearfix"
                v-for="(item, index) in productDetail.rules"
                :key="index"
              >
                <div class="fl rule-title">{{ item.title }}</div>
                <div class="fl">
                  <div
                    class="fl r-item"
                    :class="{
                      active: item.ruleIndex == i,
                      'large-text': v.title.length >= 4,
                    }"
                    v-for="(v, i) in item.rule"
                    :key="i"
                    @click="toggleRule(item, i)"
                  >
                    {{ v.title }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 修改商品数量 -->
            <div class="clearfix c-box">
              <div class="fl select-count">选择数量</div>
              <div class="fr count-box">
                <van-stepper
                  v-model="product.count"
                  theme="round"
                  button-size="22"
                  disable-input
                />
              </div>
            </div>

            <!-- 商品描述 -->
            <div class="desc-box">
              <div class="pro-desc">商品描述</div>
              <div class="desc-text">
                <div
                  class="text-item"
                  v-for="(item, index) in productDetail.desc"
                  :key="index"
                >
                  {{ index + 1 }}、{{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-goods-action>
      <van-goods-action-icon
        :to="{ name: 'Shopbag' }"
        icon="bag"
        text="购物袋"
        :badge="bagCount == 0 ? '' : bagCount"
        :color="bagCount > 0 ? '#0C34BA' : '#646566'"
      />
      <van-goods-action-icon
        icon="like"
        :text="isLike ? '已收藏' : '未收藏'"
        :color="isLike ? '#0C34BA' : '#646566'"
        @click="toggleLikeProduct"
      />
      <van-goods-action-button
        text="加入购物车"
        color="#6A91EC"
        @click="addShopbag()"
      />
      <van-goods-action-button text="立即购买" color="#0C34BA" @click="buy(true)"/>
    </van-goods-action>
  </div>
</template>

<script>
import "../assets/less/detail.less";
export default {
  name: "Detail",
  data() {
    return {
      //商品pid
      pid: "",

      //商品信息
      product: {
        count: 1,
      },

      //购物袋的数量
      bagCount: 0,

      //商品详情数据
      productDetail: {},

      //是否已经收藏商品
      isLike: false,
    };
  },

  created() {
    //截取pid
    this.pid = this.$route.params.pid;
    console.log("this.pid ==> ", this.pid);

    //查询用户是否已经收藏该商品
    this.findLike();

    //获取商品详情数据
    this.getProductDetail();

    // 查询用户的购物袋记录数量
    this.shopBagCount();
  },

  methods: {
    //获取商品详情数据
    getProductDetail() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //发起注册请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/productDetail",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((result) => {
          this.$toast.clear();

          console.log("result ==> ", result);
          if (result.data.code == 600) {
            let data = result.data.result[0];

            data.desc = data.desc.split(/\n/);

            let rules = [];

            let ruleData = ["tem", "sugar", "milk", "cream"];
            ruleData.map((v) => {
              let r = {};
              r.title = data[v + "_desc"];

              //激活下标
              r.ruleIndex = 0;

              //激活下标
              r.ruleIndex = 0;

              //每项规格
              r.rule = [];

              //获取规格字符串
              let ruleString = data[v].split("/");
              ruleString.map((value) => {
                if (value != "") {
                  r.rule.push({ title: value });
                }
              });
              if (r.rule.length > 0) {
                rules.push(r);
              }
            });

            data.rules = rules;

            this.productDetail = data;

            console.log("this.productDetail ==> ", this.productDetail);
          }
        })
        .catch((err) => {
          this.$toast.clear();

          console.log("err ==> ", err);
        });
    },

    //返回上一级
    back() {
      this.$router.go(-1);
    },

    //切换规格
    toggleRule(item, i) {
      if (item.ruleIndex == i) {
        return;
      }
      item.ruleIndex = i;
    },
    // 查询用户是否收藏商品
    findLike() {
      // 获取token
      let tokenString = localStorage.getItem("__tk");
      // console.log(tokenString);
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });

      // 发起查询商品请求
      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          console.log("findLike result===>", result);
          if (result.data.code == 1000) {
            if (result.data.result.length > 0) {
              // 商品收藏成功
              this.isLike = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("findLike err===>", err);
        });
    },
    // 收藏商品
    toggleLikeProduct() {
      // 获取token
      let tokenString = localStorage.getItem("__tk");
      console.log(tokenString);
      // 判断token是否存在
      if (!tokenString) {
        // 跳回登录页面
        return this.$router.push({ name: "Login" });
      }
      let url = this.isLike ? "/notlike" : "/like";
      // 发起收藏请求
      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("result==>", result);
          if (result.data.code == 700) {
            // token检验无效,跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 800) {
            // 收藏商品成功
            this.isLike = true;
          } else if (result.data.code == 900) {
            // 取消商品收藏
            this.isLike = false;
          }
        })
        .catch((err) => {
          this.$toast.clear(result.data.msg);
          console.log("err==>", err);
        });
    },
    // 查询购物车数量
    shopBagCount() {
      let tokenString = localStorage.getItem("__tk");
      if (!tokenString) {
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("result===>", result);
          if (result.data.code == 8000) {
            this.bagCount = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err===>", err);
        });
    },

    // 加入购物车
    addShopbag(isBuy) {
      //   // 判断是否登录，如果没有 就跳到登录页面
      let tokenString = localStorage.getItem("__tk");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      //请求参数
      let data = {
        pid: this.pid,
        count: this.product.count,
        appkey: this.appkey,
        tokenString,
      };
      let rs = [];
      // 遍历productDetail.rules数组获取选择商品的谷歌
      this.productDetail.rules.map((v) => {
        rs.push(v.rule[v.ruleIndex].title);
      });
      // 数组分割成字符串
      data.rule = rs.join("/");
      // console.log("data==>", data);

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      console.log(data, "提交的数据");
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data,
      })
        .then((result) => {
          this.$toast.clear();
          console.log("result===>", result);
          if (result.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 3000) {
            if (!isBuy) {
              // 加入购物袋
              if (result.data.status == 1) {
                this.bagCount++;
              }
            } else {
              // 立即购买
this.$router.push({name:'Pay',query:{sids:result.data.sid}})
}
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("===>", err);
        });
    },
    // 立即购买（后台判断购物车。如果存在该商品就累加数量，然后跳转到订单结算界面，否则先将该商品加入到购物袋，再跳转到订单结算页面）
    buy(isBuy) {
      this.addShopbag(isBuy)
    },
  },
};
</script>
