// 按需导入并且注册

import Vue from 'vue'
import {Button,Form,FormItem,Input,Container,Header,Aside,Main} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.prototype.$message  = Message