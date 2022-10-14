import Vue from 'vue'

import App from './App.vue'
import router from './router'

import axios from 'axios';
import VueAxios from 'vue-axios';

// 从vant框架导入Button组件
import {
  Button,
  NavBar,
  Form,
  Field,
  CellGroup,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Empty,
  SwipeCell,
  Cell,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  List,
  AddressEdit,
  AddressList,
  Icon,
  Dialog,
  Tab,
  Tabs,
  Uploader,
} from 'vant';

// 导入rem适配文件
import 'lib-flexible/flexible'
// import { config } from 'vue/types/umd';
// import vueConfig from 'vue.config';

// 注册button组件
Vue
  .use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(CellGroup)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Empty)
  .use(SwipeCell)
  .use(Cell)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(Icon)
  .use(Dialog)
  .use(Tab)
  .use(Tabs)
  .use(Uploader)


// 设置vue原型
Vue.prototype.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA="

// 配置请求基础路劲
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//axios拦截器，在发起请求之前执行
axios.interceptors.request.use(config => {

  //处理post请求参数, 进行参数序列化
  if (config.method == 'post') {

    //序列化post请求参数
    let paramsString = '';
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }

    //重新赋值config.data
    config.data = paramsString.slice(0, -1);

    // console.log('config.data ==> ', config.data);

  }

  //必须返回config
  return config;
})

// 定义全局过滤器
Vue.filter('decimal', (v, n = 2) => {
  return v.toFixed(n);
})


//格式化日期
Vue.filter('formatDate', (v, format) => {

  // console.log('v ==> ', v);
  // console.log('format ==> ', format);

  //创建日期对象
  let date = new Date(v);

  //格式化年份
  let year = date.getFullYear().toString();
  // console.log('year ==> ', year);
  if (/(y+)/.test(format)) {
    //获取匹配组的内容
    var content = RegExp.$1;
    // console.log('content ==> ', content);
    format = format.replace(content, year.slice(year.length - content.length));
  }

  // console.log('format ==> ', format);

  //格式化月份、日份、时、分、秒
  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  // console.log('o ==> ', o);

  for (let key in o) {
    //创建动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    // console.log('reg ==> ', reg);

    if (reg.test(format)) {
      //获取组匹配的内容
      let groupContent = RegExp.$1;
      // console.log('groupContent ==> ', groupContent);

      format = format.replace(groupContent, o[key] >= 10 ? o[key] : groupContent.length == 2 ? '0' + o[key] : o[key]);
      // console.log('format ==> ', format);
    }

  }

  return format;
})


Vue.use(VueAxios, axios)

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
