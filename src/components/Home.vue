<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconFirst[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path + ''"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <i :class="iconFirst[subItem.id]"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  //调用获取侧栏数据
  created() {
    //调用函数,获取侧栏数据
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  data() {
    return {
      //定义数组来保存获取到的值
      menulist: [],
      isCollapse: false,
      iconFirst: {
        "125": "el-icon-user-solid",
        "103": "el-icon-edit",
        "101": "el-icon-s-shop",
        "102": "el-icon-s-claim",
        "145": "el-icon-s-data",
        "125": "el-icon-umbrella",
        "111": "el-icon-brush",
        "112": "el-icon-monitor",
        "121": "el-icon-toilet-paper",
        "104": "el-icon-smoking",
        "115": "el-icon-coin",
        "107": "el-icon-link",
        "146": "el-icon-cpu",
        "110": "el-icon-watermelon"

      }
    };
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message.warning("退出成功");
    },
    //获取菜单列表
    async getMenuList() {
      //调用接口
      const { data: res } = await this.$http.get("menus");
      //    console.log(this.activePath);

      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
      this.getMenuList();
    }
  }
};
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
