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
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <!-- 一层循环 -->
              <el-row
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id"
                :class="['tabBorder', i1 === 0 ? 'tabBorderT' : '', 'zhou']"
              >
                <el-col :span="6">
                  <el-tag closable @close="colsePower(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二层循环 -->
                <el-col :span="18">
                  <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'tabBorderT', 'zhou']">
                    <!-- 二级 -->
                    <el-col :span="6">
                      <el-tag type="success" closable @close="colsePower(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级 -->
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        v-for="(item3, i3) in item2.children"
                        :key="item3.id"
                        closable
                        @close="colsePower(scope.row, item3.id)"
                      >
                        {{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"> </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column label="操作" width="400px">
            <template slot-scope="scope">
              <el-button type="primary" effect="dark" class="el-icon-s-tools"> 编辑操作</el-button>
              <el-button type="danger" effect="dark" class="el-icon-delete"> 删除</el-button>
              <el-button type="warning" effect="dark" class="el-icon-thumb" @click="powerAllocation(scope.row)">
                分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 权限分配对话框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="closeDia">
          <!-- 树结构 -->
          <el-tree
            :data="treePower"
            :props="treeProps"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="checkedPower"
            default-expand-all
            ref="geteveryID"
          >
          </el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addPower">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { async } from "q";
export default {
  //钩子
  created() {
    //获取用户权限列表
    this.getUserPower();
  },
  data() {
    return {
      //保存获取到的用户信息
      userPower: [],
      dialogVisible: false,
      //这是树结构值
      treePower: [],
      treeProps: {
        children: "children",
        label: "authName"
      },
      //勾选的权限id
      checkedPower: [],
      //点击得到该项的角色id
      userPoserID: ""
    };
  },
  methods: {
    //获取用户权限列表
    async getUserPower() {
      const { data: res } = await this.$http.get("roles");
      this.userPower = res.data;
      // console.log(res);
    },
    //点击权限关闭
    colsePower(itemID, powerID) {
      this.$confirm("此操作将删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          //删除成功,调用接口
          const { data: res } = await this.$http.delete(`roles/${itemID.id}/rights/${powerID}`);
          //避免关闭
          itemID.children = res.data;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //分配权限
    async powerAllocation(row) {
      const { data: res } = await this.$http.get("rights/tree");
      // console.log(res);
      this.dialogVisible = true;
      this.treePower = res.data;
      this.getPowerID(row, this.checkedPower);
      //保存点击项的角色id,供其他功能使用
      this.userPoserID = row.id;
    },
    //获取到三级权限的id
    getPowerID(node, arr) {
      if (!node.children) {
        // 如果没有children属性了,那么说明这个就已经是子节点了
        return arr.push(node.id);
      }
      //循环节点的子节点,再循环子节点的子子节点,当没有子节点就会执行上一步
      node.children.forEach(item => {
        //再次调用该函数,循环子节点的子节点
        this.getPowerID(item, arr);
      });
    },
    //关闭对话框,重置数组
    closeDia() {
      this.checkedPower = [];
    },
    //增加权限
    async addPower() {
      //获取到接口需要的值
      //需要角色id和权限id列表
      //角色列表通过 之前的点击事件,把点击的id存到data中
      //权限id
      const keys = [...this.$refs.geteveryID.getCheckedKeys(), ...this.$refs.geteveryID.getHalfCheckedKeys()];
      this.dialogVisible = false;
      //得到的数组,把他分割了
      const keysS = keys.join(",");
      // console.log(keysS);
      //调用接口
      const { data: res } = await this.$http.post(`roles/${this.userPoserID}/rights`, { rids: keysS });
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getUserPower();
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
.el-tag {
  margin: 10px;
}
.tabBorder {
  border-bottom: 1px solid #ccc;
}
.tabBorderT {
  border-top: 1px solid #ccc;
}
.zhou {
  display: flex;
  align-items: center;
}
</style>
