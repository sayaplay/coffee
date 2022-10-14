<template>
  <div class="shopbag">
    <van-nav-bar
      title="标题"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
      @click-right="isEdit = !isEdit"
    >
      <template #right>
        <div v-if="shopbagData.length > 0">{{ isEdit ? "完成" : "编辑" }}</div>
      </template>
    </van-nav-bar>

    <div v-if="shopbagData.length == 0">
      <van-empty description="购物袋空空如也，去逛一逛!">
        <van-button round type="danger" class="bottom-button" color="#0C34BA"
          >逛一逛</van-button
        >
      </van-empty>
    </div>
    <div class="shopbag-box" v-else>
      <div class="shopbag-bg"></div>

      <!-- 懒加载事件 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="哎呀，没有数据可加载了!"
        offset="20"
        @load="onLoad"
      >
        <div class="shopbag-product">
          <div
            class="shopbag-item"
            v-for="(item, index) in shopbagData"
            :key="item.sid"
          >
            <div class="cell-item">
              <van-swipe-cell :disabled="!isEdit">
                <div class="clearfix">
                  <div class="fl check-box">
                    <van-checkbox
                      @click="simpleSelect"
                      v-model="item.isChecked"
                      checked-color="#0C34BA"
                    ></van-checkbox>
                  </div>
                  <div class="fl pro-info-box">
                    <div class="pro-img fl">
                      <img class="auto-img" :src="item.small_img" alt="" />
                    </div>
                    <div class="fl pro-info">
                      <div class="pro-info-text">
                        <div class="clearfix names">
                          <div class="fl pro-name">{{ item.name }}</div>
                          <div class="fl pro-rule">{{ item.rule }}</div>
                        </div>
                        <div class="pro-enname">{{ item.enname }}</div>
                      </div>
                      <div class="pro-count-box">
                        <div class="fl pro-price">￥{{ item.price }}</div>
                        <div class="fr step-box">
                          <van-stepper
                            v-model="item.count"
                            @change="changeCount(item)"
                            theme="round"
                            button-size="22"
                            disable-input
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <template #right>
                  <van-button
                    square
                    type="danger"
                    text="删除"
                    color="#ee0a24"
                    @click="removeOne(index, item.sid)"
                  />
                </template>
              </van-swipe-cell>
            </div>
          </div>
        </div>
      </van-list>
      <van-submit-bar
        :price="3050"
        v-if="isEdit"
        button-text="删除选择"
        button-color="#EE0A24"
        @submit="removeSelected"
      >
        <van-checkbox v-model="isAllChecked" @click="allSelect"
          >全选</van-checkbox
        >
      </van-submit-bar>

      <van-submit-bar
        :price="total"
        v-else
        button-text="提交订单"
        button-color="#0C34BA"
        @submit="commit"
      >
        <van-checkbox v-model="isAllChecked" @click="allSelect"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
  </div>
</template>
<script>
import "../assets/less/shopbag.less";
export default {
  name: "Shopbag",
  data() {
    return {
      isEmpty: false,
      Ischeck: false,
      count: 1,
      isAllChecked: false,
      // 是否编辑状态
      isEdit: false,
      // 购物车数据
      shopbagData: [],

      // 触发加载
      loading: true,

      //是否全部加载完成数据
      finished: false,

      //所有购物袋数据
      allShopbagData: [],

      // 每次触底懒加载截取8条数据
      dataCount: 8,

      // 开始截取购物袋数据的位置
      startIndex: 0,

      // 总金额
      total: 0,
    };
  },
  created() {
    this.getShopbagData();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 获取购物袋数据
    getShopbagData() {
      // 获取token
      let tokenString = localStorage.getItem("__tk");
      // 判断token是否存在
      if (!tokenString) {
        // 跳回登录页面
        return this.$router.push({ name: "Login" });
      }
      // 发起收藏请求
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("shipbag result==>", result);
          if (result.data.code == 700) {
            // token检验无效,跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 5000) {
            result.data.result.map((v) => {
              v.isChecked = false;
            });
            this.allShopbagData = result.data.result;

            //根据开始截取位置和截取数据数量设置购物袋显示的数据
            this.shopbagData = this.allShopbagData.slice(
              this.startIndex,
              this.startIndex + this.dataCount
            );

            this.startIndex += this.dataCount;

            //未加载
            this.loading = false;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err==>", err);
        });
    },
    // 懒加载购物袋数据
    onLoad() {
      console.log("触发懒加载");

      console.log("this.allShopbagData ==> ", this.allShopbagData);

      setTimeout(() => {
        //在allShopbagData截取数据
        let data = this.allShopbagData.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );

        // console.log('data ==> ', data);

        this.startIndex += this.dataCount;

        this.shopbagData.push(...data);

        // console.log('this.shopbagData ==> ', this.shopbagData);

        this.isAllChecked = false;

        //如果当前截取数据不足8条数据，下次不可能截取的数据
        if (data.length < this.dataCount) {
          //没有数据可加载时，需要finished修改为true，这样可以不再onload事件
          this.finished = true;
        } else {
          //每次触发onload事件都需要将loading修改为false
          this.loading = false;
        }
      }, 1500);
    },
    // 全选
    allSelect() {
      console.log("触发");
      this.shopbagData.map((v) => {
        v.isChecked = this.isAllChecked;
      });
      this.sum();
    },
    // 单选
    simpleSelect() {
      this.sum();
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (!this.shopbagData[i].isChecked) {
          this.isAllChecked = false;
          return;
        }
      }
      this.isAllChecked = true;
    },

    // 单个删除
    removeOne(index, sid) {
      // 获取token
      let tokenString = localStorage.getItem("__tk");
      if (!tokenString) {
        // 跳回登录页面
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
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([sid]),
        },
      })
        .then((result) => {
          console.log("removeOne result ==>", result);
          if (result.data.code == 700) {
            // token检验无效,跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            // 如果删除成功,则移除页面的商品,重新计算订单总金额
            this.shopbagData.splice(index, 1);
            this.sum();
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("removeOne", err);
        });
    },
    // 删除选择
    removeSelected() {
      let isHas = false;

      for (let i = 0; i < this.shopbagData.length; i++) {
        if (this.shopbagData[i].isChecked) {
          let isHas = true;

          this.shopbagData.splice(i, 1);
          i--;
        }
      }
      this.total = 0;
      if (!isHas) {
        this.$toast("请选择删除的商品");
      }
    },
    // 计算订单金额
    sum() {
      this.total = 0;
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          this.total += v.price * v.count;
        }
      });
      this.total *= 100;
    },
    // 修改数量
    changeCount(item) {
      this.sum();

      // sid:购物袋sid
      // count :商品数量

      // 获取token
      let tokenString = localStorage.getItem("__tk");
      if (!tokenString) {
        // 跳回登录页面
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
        url: "modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("count result ==>", result);
          if (result.data.code == 700) {
            // token检验无效,跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 6000) {
            if (item.Ischeck) {
              this.sum();
            }
          } else {
            this.$toast(result.data.message);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    // 判断是否勾选商品
    isSelectProduct() {
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (this.shopbagData[i].isChecked) {
          return true;
        }
      }
      return false;
    },
    // 提交订单，跳转到订单页面
    commit() {
      let isHas = this.isSelectProduct();
      if (!isHas) {
        this.$toast("请选择购买的商品");
        return;
      }
      let sids = [];
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      // 跳转到结算页面 并且携带参数sid查询
      this.$router.push({name: 'Pay', query: {sids: sids.join('-')}});

    },
  },
};
</script>

<style lang="scss" scoped>
</style>