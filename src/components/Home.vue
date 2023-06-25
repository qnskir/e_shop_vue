<template>
    <el-container class='home-container'>
        <el-header>
            <div>
                <img src="../assets/logo/1.png" alt="">
                <span>电商后台管理系统</span>

            </div>
            <el-button type="info " @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-col :span="12">
                    <!-- <h5 >导航栏</h5> -->
                    <el-menu background-color="#333744" text-color="#fff" active-text-color="null" 
                             unique-opened  router>
                        <!-- 一级菜单 -->
                        <el-submenu :index="item.id + ' '" v-for="item in menulist" :key="item.id">
                            <!-- 一级菜单的模板区域 -->
                            <template slot="title">
                                <!-- 图标 -->
                                <i :class="ele_icon[item.id]"></i>
                                <!-- 文本 -->
                                <span>{{ item.authName }}</span>
                            </template>

                            <!-- 二级菜单 -->
                            <!--要是用router属性 -->
                            <el-menu-item :index="'./'+ subItem.path" v-for="subItem in item.children" :key="subItem.id">
                                <!--二级菜单的模板区域 -->
                                <template slot="title">
                                    <!-- 图标 -->
                                    <i class="el-icon-menu"></i>
                                    <!-- 文本 -->
                                    <span>{{ subItem.authname }}</span>
                                </template>
                            </el-menu-item>
                        
                        </el-submenu>

                    </el-menu>
                </el-col>
            </el-aside>
            <!-- 右侧内容 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    data() {
        return {
            // 左侧菜单数据
            menulist: [],
            ele_icon: {
                '1': 'el-icon-user ',
                '2': 'el-icon-tickets ',
                '3': 'el-icon-shopping-bag-1 ',
                '4': 'el-icon-shopping-cart-1 ',
                '5': 'el-icon-view '

            }

        };
    },
    //  created()生命周期函数 表示组件实例被创建后立即调用的函数
    created() {
        this.getMenuList();
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login')
        },

        // 获取所有的菜单
        async getMenuList() {
            const { data: res } = await this.$http.get('menus ');
            console.log(res);

            console.log(res.meta.status);
            if (res.meta.status !== 200) { this.$message.error(res.meta.msg); }
            this.menulist = res.array;
            console.log(this.menulist[0].authName);
        }
    }
}
</script>
<style lang="less" scoped>
.home-container {
    height: 100%;

}

.el-header {
    background-color: #373D41;
    width: 100%;
    display: flex;
    justify-content: space-between;

    padding-left: 0;
    align-items: center;

    font-size: 18px;

    >div {
        width: 100%;
        margin-left: 40px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        color: white;

        span {
            margin-left: 15px;
        }
    }

}


.el-aside {
    background-color: #333744;
   
}
ul .el-menu .el-menu--inline{
       border-right:null;
    }
.el-main {
    background-color: #eaedf1;

}




img {
    width: 55px;
    height: 55px;
    // position: absolute;
    // left: 40px;
    border-radius: 50%;

}

.el-col {
    width: 100%;
}
</style>