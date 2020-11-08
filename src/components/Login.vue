<template>
  <div class="login_container">
    dengl
    <div class="login_box">
      <!-- logo -->
      <div class="login_logo">
        <img src="../assets/logo.png" />
      </div>
      <!--登录的表单 :model="ruleForm" 绑定数据  双向绑定好啊!-->
      <el-form
        class="loginFrom"
        :model="ruleForm"
        :rules="loginRules"
        ref="ruleFormRef"
      >
        <el-form-item prop="username" class="usernameInput">
          <!-- v-model="ruleForm.user"  -->
          <el-input
            type="username"
            prefix-icon="el-icon-user"
            v-model="ruleForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" class="passwordInput">
          <el-input
            type="password"
            autocomplete="off"
            prefix-icon="el-icon-lock"
            v-model="ruleForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="ruleFormRef('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置.resetFields()
    ruleFormRef () {
      this.$refs.ruleFormRef.resetFields()
    },
    login () {
      this.$refs.ruleFormRef.validate(async valid => {
        // 请求api之前的一个前端验证
        if (!valid) {
          return
        }
        console.log(this.ruleForm)
        const result = await this.$http.post('/login', this.ruleForm)
        console.log(result)
        const resultStatus = result.data.meta.status
        const msg = result.data.meta.msg
        console.log(resultStatus)

        // 一定要注意api返回的数据的数据类型
        if (resultStatus !== 200) {
          return this.$message.error(msg)
        } else {
          // window.sessionStorage.setItem  存储数据，关闭会话销毁  注意与localStorage 的区别
          window.sessionStorage.setItem('token', result.data.data.token)
          this.$message.success(msg)
          return this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: blue;
  height: 100%;
}
.login_box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .login_logo {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    background-color: #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }
  .loginFrom {
    padding: 0 20px;
    .btns {
      position: absolute;
      bottom: 0;
      right: 5.5%;
    }
    .usernameInput {
      position: absolute;
      top: 40%;
      width: 90%;
    }
    .passwordInput {
      position: absolute;
      top: 60%;
      width: 90%;
    }
  }
}
</style>
