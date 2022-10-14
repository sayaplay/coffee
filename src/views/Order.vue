<template>
  <div class="order">
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <Bgbox>
      <div v-if="isHas">
        <van-tabs
          v-model="tabIndex"
          color="0C34BA"
          title-active-color="0C34BA"
          line-height="2px"
          @change="changeTab"
        >
          <van-tab
            v-for="(item, index) in tabData"
            :key="index"
            :title="item.title"
          >
            <div v-if="orderData.length > 0">
              <div class="order-box" v-for="(v, k) in orderData" :key="v.oid">
                <OrderList
                  :info-title-left="v.oid"
                  :count="v.count"
                  :total="v.total | decimal"
                  :date="v.date"
                  :is-right="true"
                  @confirm-receive="confirmReceive(v, k)"
                  :is-receive="v.status == 2"
                  @remove="removeOrder(v.oid, k)"
                >
                  <OrderItem
                    v-for="(value, idex) in v.data"
                    :key="idex"
                    :item="value"
                  ></OrderItem>
                </OrderList>
              </div>
            </div>
            <div v-else>
              <van-empty description="没有订单数据" />
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div v-else><van-empty description="没有订单数据" /></div>
    </Bgbox>
  </div>
</template>

<script>
import Bgbox from "../components/BgBox.vue";
import "../assets/less/order.less";
import OrderList from "../components/OrderList";
import OrderItem from "../components/OrderItem";

export default {
  name: "Order",
  components: {
    Bgbox,
    OrderList,
    OrderItem,
  },
  data() {
    return {
      //激活tab标签的下标
      tabIndex: 0,

      tabData: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],

      //订单商品数据
      orderData: [],

      // 全部没有订单数据
      isHas: true,
    };
  },
  created() {
    this.getOrderDataByStatus();
  },
  methods: {
    // 返回上一级
    back() {
      this.$router.go(-1);
    },

    // 切换订单状态栏
    changeTab(name, title) {
      console.log("==>", name);
      console.log("title==>", title);
      this.getOrderDataByStatus();
    },

    //根据订单状态获取订单数据
    getOrderDataByStatus() {
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
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: this.tabIndex,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("getOrderDataByStatus result ==> ", result);
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 70000) {
            //如果全部没有订单数据，则移除tab
            if (this.tabIndex == 0 && result.data.result.length == 0) {
              this.isHas = false;
              return;
            }

            //按照订单编号oid进行分类

            let orderDatas = [];
            result.data.result.map((v) => {
              //查找orderDatas的订单数据，如果找到，则将该商品存放在当前订单里面，累加当前订单的商品数量和当前订单的总金额
              for (let i = 0; i < orderDatas.length; i++) {
                if (orderDatas[i].oid == v.oid) {
                  orderDatas[i].data.push(v);
                  orderDatas[i].count += v.count;
                  orderDatas[i].total += v.count * v.price;
                  return;
                }
              }

              //如果找不到当前订单数据，则初始化当前订单数据
              let o = {};
              o.oid = v.oid;
              o.count = v.count;
              o.total = v.count * v.price;
              o.status = v.status;
              o.date = v.createdAt;
              o.data = [v];
              orderDatas.push(o);

              // console.log("orderDatas ==> ", orderDatas);
            });

            this.orderData = orderDatas;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    // 确认收货
    confirmReceive(item, index) {
      // console.log("item==>",item);
      // return

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
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: item.oid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("getOrderDataByStatus result ==> ", result);
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 80000) {
            if (this.tabIndex == 1) {
              this.orderData.splice(index, 1);
            }
            item.status = 2;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    // 删除订单
    removeOrder(oid, index) {
      console.log("删除");
      this.orderData.splice(index, 1);
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
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("getOrderDataByStatus result ==> ", result);
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 90000) {
            this.orderData.splice(index, 1);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
  },
};
</script>f

<style lang="less" scoped>
</style>