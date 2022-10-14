<template>
  <div class="address">
    <van-nav-bar
      title="地址列表"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <BgBox>
      <van-address-list
        :switchable="false"
        :list="list"
        default-tag-text="默认"
        @add="add"
        @edit="edit"
      />
    </BgBox>
  </div>
</template>

<script>
import BgBox from "../components/BgBox.vue";
import "../assets/less/address.less";
export default {
  name: "Address",
  data() {
    return {
      chosenAddressId: "",
      list: [],
    };
  },
  components: {
    BgBox,
  },
  created() {
    //获取地址列表数据
    this.getAddressData();
  },
  methods: {
    // 获取数据列表
    getAddressData() {
      let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        // 跳回到登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        methods: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("addressList result ==> ", result);
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 20000) {
            result.data.result.map((v) => {
              // console.log(v);
              // v.isDefault = Boolean(v.isDefault);
              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
            });
            this.list = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("addressList err ==> ", err);
        });
    },
    // 新增地址
    add() {
      this.$router.push({ name: "NewAddress" });
    },
    // 编辑地址
    edit(item) {
      // item.aid:地址唯一标识
      this.$router.push({ name: "NewAddress", query: { aid: item.aid } });
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.address {
  padding-top: 46px;

  /deep/ .van-nav-bar .van-icon {
    color: #0c34ba;
  }

  /deep/ .van-nav-bar__text {
    color: #0c34ba;
  }

  /deep/ .van-tag--danger {
    background-color: #0c34ba;
  }

  /deep/ .van-address-item .van-radio__icon--checked .van-icon {
    background-color: #0c34ba;
    border-color: #0c34ba;
  }

  /deep/ .van-address-list {
    padding: 0;
  }

  /deep/ .van-address-item {
    border-bottom: 1px solid #e8e8e8;
    &:last-child {
      border-bottom: none;
    }
  }

  /deep/ .van-button--danger {
    background-color: #0c34ba;
    border-color: #0c34ba;
  }
}
</style>