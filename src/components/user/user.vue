<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>

        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span='8'>

                    <el-input placeholder="请输入姓名" v-model="queryInfo.query" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="searchUserList"></el-button>
                    </el-input>

                </el-col>
                <el-col :span='4'>
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data=userlist border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- {{ scope.row.manage_state }} -->
                        <el-switch v-model="scope.row.manage_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope" width="200px">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)">
                        </el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size='mini'
                            @click="deleteUser(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top">
                            <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户信息" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 内容主题区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 内容主题区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {

    data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, callback) => {
            const regEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
            if (regEmail.test(value)) {
                return callback()
            }
            callback('请输入合法的邮箱')
        };
        // 验证手机号的规则
        var checkMobile = (rule, value, callback) => {
            const regMobile = /^1[3456789]\d{9}$/

            if (regMobile.test(value)) {
                return callback()
            }
            callback('请输入合法的手机号')
        };

        return {
            // 获取用户列表的参数对象
            queryInfo: {
                // 搜索框内容
                query: '',
                // 当前的页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 2
            },
            userlist: [],
            total: 0,
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible: false,
            // 控制编辑用户对话框的显示与隐藏
            editDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 查询到的用户信息对象
            editForm: {
                username: '',
                email: '',
                mobile: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                username: [
                    { required: true, message: '请输入长度在 2 到 5 个字符的用户名', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入长度在 3 到 10 个字符的密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            editFormRules: {
                username: [
                    { required: true, message: '请输入长度在 2 到 5 个字符的用户名', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            console.log(this.queryInfo);
            const { data: res } = await this.$http.get('users', { params: this.queryInfo })
            //    console.log(res + '50');
            //    console.log(res );
            if (res.meta.status !== 200) { this.$message.error('error'); }
            else { this.$message.success(res.meta.msg); }

            this.userlist = res.users;
            this.total = res.total;
            console.log(this.userlist);

        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            console.log(newSize);
            this.queryInfo.pagesize = newSize;
            this.getUserList();
        },
        // 监听页码值改变的事件
        handleCurrentChange(newPage) {
            console.log(newPage);
            this.queryInfo.pagenum = newPage;
            console.log(newPage);
            console.log(this.userlist);
            this.getUserList();
        },
        // 获得搜索结果
        async searchUserList() {
            const { data: res } = await this.$http.post("/search", this.queryInfo);
            // console.log(res);
            // console.log(this.userlist);
            this.userlist = res.result;
            // console.log(this.userlist);

        }
        ,
        // 监听switch开关状态的改变
        async userStateChanged(userinfo) {
            console.log(userinfo);
            const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.manage_state}`);
            // console.log(res + '111');
            // if (res.meta.status !== 200) {
            //     userinfo.manage_state = !userinfo.manage_state;
            //     this.$message.error('error');
            // }
            this.$message.success(res);


        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加新用户
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) { return false; }
                else {
                    // 预校验成功
                    const { data: res } = await this.$http.post("/regUser", this.addForm);
                    if (res.status !== 201) { this.$message.error("添加用户失败") }
                    else {
                        this.$message.success("添加用户成功");
                        // 隐藏添加用户的对话框
                        this.addDialogVisible = false;
                        // 重新获取用户列表数据
                        this.getUserList();
                    }

                }
            })
        },
        // 展示编辑用户信息的对话框
        async showEditDialog(id) {
            // console.log(id);
            const { data: res } = await this.$http.get('/bid', { params: { id: id } });

            //   console.log(res);
            this.editForm = res.result[0];
            console.log(this.editForm);
            this.editDialogVisible = true;
        },
        // 监听修改用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 点击修改按钮修改数据库中信息
        editUser() {
            this.$refs.editFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) { return false; }
                else {
                    // 预校验成功
                    const { data: res } = await this.$http.post("/regUser", this.editForm);
                    if (res.status !== 201) { this.$message.error("修改用户失败") }
                    else {
                        this.$message.success("修改用户成功");
                        // 隐藏添加用户的对话框
                        this.addDialogVisible = false;
                        // 重新获取用户列表数据
                        this.getUserList();
                    }

                }
            })
        },
        // 根据id删除对应的用户信息
        async deleteUser(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该该用户信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            // console.log(confirmResult);
            if (confirmResult !== 'confirm') { this.$message.info("已取消删除") }
            else {

                const { data: res } = await this.$http.delete(`dinfo/${id}` )
                if (res.status !== 200) { this.$message.info("已取消删除"); }
                else { this.$message.success("删除成功");}
                this.getUserList();
            }
        }

    }
}
</script>

<style lang="less" scoped></style>