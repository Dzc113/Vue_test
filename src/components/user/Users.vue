<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row class="rowCard">
        <el-col class="rowCol" :span="4">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryUsersInfo.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 新增用户按钮 -->
        <el-button
          type="primary"
          class="newUserBtn"
          @click="dialogVisible = true"
          >新增用户</el-button
        >
        <!-- 隐藏的弹窗 -->
        <el-dialog
          title="新增用户"
          :visible.sync="dialogVisible"
          width="30%"
          @close="handleClose"
        >
          <!-- 弹窗的展示文档部分 -->
          <el-form
            ref="addUserFormRef"
            :model="addUserForm"
            label-width="80px"
            :rules="addUserFormRules"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addUserForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="addUserForm.password"
                show-password
              ></el-input> </el-form-item
            ><el-form-item label="邮箱" prop="email">
              <el-input v-model="addUserForm.email"></el-input> </el-form-item
            ><el-form-item label="手机号" prop="phone">
              <el-input v-model="addUserForm.phone"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>
      <!-- 表格 -->
      <el-table :data="tableData" width="100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="mobile" label="手机号"> </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="权限"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="text">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <div class="block">
      <span class="demonstration"></span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[1, 2, 50, 100]"
        :page-size="queryUsersInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 邮箱的自定义验证
    var validatePassEmail = (rules, value, callback) => {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (reg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 手机号的指定会议校验
    var validatePassPhone = (rules, value, callback) => {
      const reg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (reg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 定义get请求的param
      queryUsersInfo: {
        query: '',
        pagenum: 1,
        pagesize: 1
      },
      total: 0,
      tableData: [],
      currentPage4: 1,
      input: '',
      // 控制新增用户隐形弹窗的隐藏（false）
      dialogVisible: false,
      // 添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      // 验证 添加用户的表单数据
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能低于6位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validatePassEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePassPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const result = await this.$http.get('users', {
        params: this.queryUsersInfo
      })
      const usersData = result.data.data.users
      this.tableData = usersData
      this.total = result.data.data.total
      console.log(result)
    },
    handleSizeChange(sizeChange) {
      this.queryUsersInfo.pagesize = sizeChange
      this.getUserList()
      console.log(`每页 ${sizeChange} 条`)
    },
    handleCurrentChange(currentChange) {
      this.queryUsersInfo.pagenum = currentChange
      this.getUserList()
      console.log(`当前页: ${currentChange}`)
    },
    async userStateChange(userInfo) {
      console.log(userInfo)
      const result = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      console.log(result)
      if (result.status === 200) {
        return this.$message.success(result.data.meta.msg)
      } else {
        return this.$message.error('设置状态失败')
      }
    },
    // 关闭弹窗清空数据
    handleClose() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 点击“确定”按钮，新增用户
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        // 请求api之前，前端先进行的一个校验
        if (!valid) {
          return
        }
        console.log(this.addUserForm)
        const result = await this.$http.post('/users', this.addUserForm)
        console.log(result)
        if (result.data.meta.status !== 201) {
          return this.$message.error(result.data.meta.msg)
        } else {
          this.$message.success(result.data.meta.msg)
          // 关闭弹窗
          this.dialogVisible = false
          this.getUserList()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}
.box-card {
  width: 100%;
  height: 800px;
}
.block {
  float: right;
  margin-top: 10px;
}
.newUserBtn {
  position: relative;
  left: -600px;
}
</style>
