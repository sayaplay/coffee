<template>
  <div class="my">
    <div  
      class="my-bg"
      :style="{ backgroundImage: `url('${userInfo.userBg}')` }"
    >
      <van-uploader :after-read="afterRead" class="upload-box" />
    </div>
    <div class="my-info" >
      <div class="clearfix">
        <div class="my-img fl">
          <img class="auto-img" :src="userInfo.userImg" alt="" />
        </div>
        <div class="my-info-box fl">
          <div class="user-name">{{ userInfo.nickName }}</div>
          <div class="user-desc">
            {{
              userInfo.desc == "" ? "这家伙很懒,什么都没有留下" : userInfo.desc
            }}
          </div>
        </div>
      </div>
      <div class="list-box">
        <van-cell
          :title="item.title"
          is-link
          v-for="(item, index) in listData"
          :key="index"
           @click="goPage(item.name)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/my.less";
export default {
  name: "My",
  data() {
    return {
      listData: [
        {
          title: "个人资料",
          name: "Account",
        },
        {
          title: "我的订单",
          name: "Order",
        },
        {
          title: "我的收藏",
          name: "Like",
        },
        {
          title: "收货地址",
          name: "Address",
        },
        {
          title: "安全中心",
          name: "Secure",
        },
      ],
      userInfo: {
        userBg:''
      },
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
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
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("getUserInfo result ==> ", result);
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("getUserInfo err ==> ", err);
        });
    },

    //上传背景
    afterRead(file) {
      console.log(file);

      // 允许文件类型
      let type = ["gif", "png", "jpg", "jpeg"];

      // 允许最大文件大小 1MB
      let size = 1;

      // 判断文件类型
      let fileType = file.file.type.split("/")[1];
      if (type.indexOf(fileType) === -1) {
        this.$toast(`文件类型只支持${type.join(",")}`);
        return;
      }

      // 判断文件大小 1024B = 1kb 1024KB = 1MB
      let fileSize = file.file.size / 1024 / 1024;
      console.log(fileSize);
      if (fileSize > size) {
        this.$toast(`文件最大不能超过${size}MB`);
        return;
      }

      // 处理base64的标记data:Image/jepg;base64
      let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, "");
      // console.log(base64);

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
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: fileType,
          serverBase64Img: base64,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("getUserInfo result ==> ", result);
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "I001") {
            this.userInfo.userBg = result.data.userBg;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("getUserInfo err ==> ", err);
        });
    },
    goPage(name){
      this.$router.push({name})
    }
  },
};
</script>

<style lang="less" scoped>
</style>