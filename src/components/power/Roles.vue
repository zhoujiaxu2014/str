<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片样式 -->
    <el-card class="box-card">
      <div>
        <el-button type="danger" effect="dark" class="el-icon-user-solid addUser"> 添加角色</el-button>

        <!-- table表单 -->
        <el-table :data="userPower" style="width: 100% " stripe border>
          <el-table-column type="index"> </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column label="操作">
            <el-button type="primary" effect="dark" class="el-icon-s-tools"> 编辑操作</el-button>
            <el-button type="danger" effect="dark" class="el-icon-delete"> 删除</el-button>
            <el-button type="warning" effect="dark" class="el-icon-thumb"> 分配权限</el-button>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  //钩子
  created() {
    //获取用户权限列表
    this.getUserPower();
  },
  data() {
    return {
      //保存获取到的用户信息
      userPower: []
    };
  },
  methods: {
    //获取用户权限列表
    async getUserPower() {
      const { data: res } = await this.$http.get("roles");
      this.userPower = res.data;
      console.log(res);
    }
  }
};
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
}

.addUser {
  margin: 0 0 10px 0;
  cursor: pointer;
}
</style>
