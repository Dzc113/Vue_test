<template>
  <el-container class="homeContainer">
    <el-header
      >Header
      <div class="headerLogo">XX科技</div>
      <el-button class="logOutBtn" type="danger" @click="loginOut"
        >危险按钮</el-button
      >
    </el-header>
    <el-container>
      <el-aside :width='asideWidth'>
        <div class="asideDivBtn">
          <button class="asideBtn" @click="menuOpenClose">|||</button>
        </div>
        <el-row class="tac">
          <el-col>
            <!-- 侧边栏 -->
            <el-menu
              class="homeMenu"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              :collapse="isCollapse"
              :collapse-transition='false'
              :router="true"
            >
              <!-- 一级菜单 -->
              <el-submenu
                :index="item.id + ''"
                v-for="item in menulist"
                :key="item.id"
              >
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-location" :class="iconsObj[item.id]"></i>
                  <!-- 文本 -->
                  <span class="submenuSpan">{{ item.authName }}</span>
                </template>
                <el-menu-item
                  :index="'/' + subItem.path"
                  v-for="subItem in item.children"
                  :key="subItem.id"
                  >{{ subItem.authName }}</el-menu-item
                >
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
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
      // 初始化一个空的左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-menu',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-shop',
        145: 'el-icon-s-flag'
      },
      // 折叠的默认值
      isCollapse: false,
      asideWidth: '200px'
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear()
      this.$router.push('/Login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(JSON.stringify(res) + 'res is')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.menulist = res.data
        console.log(res)
      }
    },
    menuOpenClose() {
      if ((this.isCollapse === false)) {
        this.isCollapse = true
        this.asideWidth = '100px'
      } else {
        this.isCollapse = false
        this.asideWidth = '200px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.homeContainer {
  height: 100%;
  .headerLogo {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    background-color: white;
  }
  .homeMenu {
    width: 200px;
    .submenuSpan {
      position: relative;
      right: 20px;
    }
  }
  .asideDivBtn {
    height: 30px;
    .asideBtn {
      position: relative;
      top: -290%;
    }
  }
  .el-icon-location {
    position: relative;
    right: 20px;
  }
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.logOutBtn {
  float: right;
  margin-top: 10px;
}
</style>
