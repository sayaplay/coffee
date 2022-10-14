import Vue from 'vue'
import { Toast } from "vant";
Vue.use(Toast)

class ValidForm {

  constructor() { }

  valid(o) {
    // o:表单数据，object
    // console.log('o====>', o);
    // console.log('验证表单');

    for (let key in o) {
      if (!o[key].reg.test(o[key].value)) {
        console.log(o[key].errorMsg);

        // 提示错误信息
        Toast(o[key].errorMsg);
        // 表单验证不通过
        return false
      }
    }
    // 验证表单通过
    return true
  }
}
// 导出
export const validForm = new ValidForm();