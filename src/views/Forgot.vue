<template>
  <div class="login">
    <van-nav-bar
      left-text="返回"
      right-text="先逛一逛"
      @click-right="goState('Home')"
    >
      <template #left>
        <div class="nav-left">
          <div class="logo"></div>
          <div class="logo-text">Luckin Coffee</div>
        </div>
      </template>
    </van-nav-bar>

    <div class="user-box">
      <div class="user-title">
        <div class="welcome">找回密码！</div>
        <div class="sub-title">Fold password</div>
      </div>
    </div>

    <van-form v-show="!isNext">
      <van-field
        v-model="userInfo.email"
        name="邮箱"
        label="邮箱"
        placeholder="邮箱"
        autocomplete="off"
      />

      <van-field
        v-model="userInfo.code"
        :type="isRegisPassword ? 'password' : 'text'"
        name="验证码"
        label="验证码"
        placeholder="验证码"
        autocomplete="off"
        maxlength="6"
      >
        <template #button>
          <van-button
            size="small"
            color="#0c34BA"
            @click="getValidCode"
            :disabled="isSend"
            >{{ text }}</van-button
          >
        </template>
      </van-field>

      <div class="forgot">
        <span @click="goState('Login')">已有账号，立即登录</span>
      </div>
      <div class="commit-btn">
        <van-button round block color="#0c34BA" @click="next">
          下一步
        </van-button>
      </div>
    </van-form>

    <van-form v-show="isNext">
      <van-field
        v-model="userInfo.phone"
        name="手机号"
        label="手机号"
        placeholder="手机号"
        autocomplete="off"
      />

      <van-field
        v-model="userInfo.password"
        :type="isRegisPassword ? 'password' : 'text'"
        name="密码"
        label="密码"
        placeholder="密码"
        autocomplete="off"
        @click-right-icon="toggleRegisterPasswordType"
        :right-icon="isRegisPassword ? 'closed-eye' : 'eye-o'"
      >
      </van-field>
      <div class="forgot">
        <span @click="goState('Login')">已有账号，立即登录</span>
      </div>
      <div class="commit-btn">
        <van-button round block color="#0c34BA" @click="commit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template> 

<script>
// 导入外部样式表
import "../assets/less/login.less";

// 导入验证表单
import { validForm } from "../assets/js/validForm";

export default {
  name: "Login",
  data() {
    return {
      // 用户登录信息
      userInfo: {
        phone: "",
        password: "",
        email: "",
        code: "",
      },
      // 是否发送验证码
      isSend: false,
      // 文字
      text: "发送验证码",

      //切换注册密码框的类型
      isRegisPassword: true,
      // 是否下一步
      isNext: false,
    };
  },
  methods: {
    //  切换注册框
    toggleRegisterBox() {
      this.isShow = true;
    },

    // 切换注册密码框类型
    toggleRegisterPasswordType() {
      this.isRegisPassword = !this.isRegisPassword;
    },

    // 下一步
    next() {
      // 构造表单验证信息
      let o = {
        phone: {
          value: this.userInfo.email,
          errorMsg: "邮箱格式不正确",
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
        password: {
          value: this.userInfo.password,
          errorMsg: "验证码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };
      // 前端验证登录
      let isPass = validForm.valid(o);

      if (isPass) {
        console.log("下一步");
      }
      this.axios({
        // 请求方式
        method: "POST",
        // 请求路径
        url: "/checkValidCode",

        // post请求参数
        data: {
          appkey: this.appkey,
          validCode: this.userInfo.code,
        },
      })
        .then((result) => {
          // 关闭加载提示
          this.$toast(result.data.msg);
          console.log("result===>", result);
          if (result.data.code == "K001") {
            this.isNext = true;
          }
        })
        .catch((err) => {
          this.$toast.clear();

          console.log("err====>", err);
        });
    },

    // 获取邮箱验证码
    getValidCode() {
      console.log("aa");

      // 构造表单验证信息
      let o = {
        phone: {
          value: this.userInfo.email,
          errorMsg: "邮箱格式不正确",
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
      };

      // 前端验证登录
      let isPass = validForm.valid(o);
      if (!isPass) {
        return;
      }

      let time = 60;

      this.isSend = true;
      this.text = `${time}秒后重新发送`;

      let timer = setInterval(() => {
        if (timer <= 0) {
          clearInterval(timer);
          timer = null;
          timer = 2;
          this.isSend = false;
        } else {
          time--;
          this.text = `${time}秒后重新发送`;
        }
      }, 1000);

      this.axios({
        // 请求方式
        method: "POST",
        // 请求路径
        url: "/emailValidCode",

        // post请求参数
        data: {
          appkey: this.appkey,
          email: this.userInfo.email,
        },
      })
        .then((result) => {
          // 关闭加载提示
          this.$toast(result.data.msg);
          console.log("result===>", result);
        })
        .catch((err) => {
          this.$toast.clear();

          console.log("err====>", err);
        });
    },

    // 提交
    commit() {
      // 构造表单验证信息
      let o = {
        phone: {
          value: this.userInfo.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userInfo.password,
          errorMsg: "密码格式化不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };
      // 前端验证登录
      let isPass = validForm.valid(o);
      if (isPass) {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        // 发起注册请求
        this.axios({
          // 请求方式
          method: "POST",
          // 请求路径
          url: "/retrievePassword",

          // post请求参数
          data: {
            appkey: this.appkey,
            phone: this.userInfo.phone,
            password: this.userInfo.password,
          },
        })
          .then((result) => {
            // 关闭加载提示
            this.$toast.clear();
            console.log("result===>", result);
            if(result.data.code == "L001"){
              setInterval(()=>{
                this.goState('Login')
              },800)
            }
          })
          .catch((err) => {
            console.log("err====>", err);
          });
      }
    },

    // 跳转到页面
    goState(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="less" scoped>
</style>