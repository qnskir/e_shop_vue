<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">

            </div>
            <el-form ref="loginFormRef" :model="form" :rules="rules" class="login_form">
                <el-form-item prop="username">
                    <el-input v-model="form.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" prefix-icon="el-icon-lock" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">提交</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script >
export default {
    data() {
        return {
            form: {
                username: 'zs',
                password: '123456'

            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        resetLoginForm() {
            // console.log(this);
            this.$refs.loginFormRef.resetFields();
        },
        login() {
            this.$refs.loginFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) return;
                console.log(this.form.username);

                const { data: res } = await this.$http.post("/login", this.form);
                console.log(res);

                if (res.status == 200) {
                    this.$message.success('登陆成功');
                //   把token保存到sessionStorage                
                window.sessionStorage.setItem('token', res.token);
                //   编程式导航跳转到后台页面
                this.$router.push("/Home")
                
                
                }
                else if (res.status == 200) { this.$message.error('密码错误'); }
                else if (res.status == 0) { this.$message.error('用户名不存在'); }


            })
        }
    }

}
</script>



<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    // 根据中心自身的一半
    transform: translate(-50%, -50%);
    background-color: white;

    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}

.btns {
    display: flex;
    justify-content: flex-end;
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>