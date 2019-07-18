<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片样式 -->
    <el-card class="box-card">
      <div>
        <!-- 左侧输入框 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              clearable
              v-model="queryInfo.query"
              @clear="getUsersList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
            </el-input>
          </el-col>
          <!-- 右侧按钮 -->
          <el-col :span="5">
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 用户信息 -->
    <el-table :data="userlist" stripe border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_name" label="角色"> </el-table-column>
      <el-table-column label="状态">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="switchChanage(scope.row)"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="getUser(scope.row.id)"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="assignRoles(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 这是添加按钮的页面 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @close="closeDialog1">
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="addRuleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改按钮 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="30%" @close="closeDialog">
      <el-form :model="getuser" :rules="rules" ref="editruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户" prop="username">
          <el-input v-model="getuser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="getuser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="getuser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色页面 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisible"  @close="closeAAA">
      <el-form>
        <div>姓名:{{ this.userPower.username }}</div>
        <br />
        <div>当前角色:{{ this.userPower.role_name }}</div>
        <br />
        <p>
          分配新角色:
          <el-select v-model="changeRole" placeholder="请选择">
            <el-option v-for="item in allRoles" :key="item.id" :label="item.roleName" :value="item.id" ref="xxxx"> </el-option>
          </el-select>
        </p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { async } from "q";
export default {
  data() {
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };
    return {
      //定义用户名,页码数量
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      //用户信息
      userlist: [],
      //总页码书
      total: 0,
      //定义用户添加显示隐藏
      dialogVisible: false,
      //定义修改按钮显示隐藏
      editDialogVisible: false,
      //分配角色
      changeRole: "",
      dialogFormVisible: false,
      ruleForm: {
        username: "",
        password: "123456",
        email: "1234@qq.com",
        mobile: "18048197775"
      },
      getuser: [],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ]
      },
      //保存分配角色的名字和角色
      userPower: "",
      //保存获取到的角色
      allRoles: ""
    };
  },
  created() {
    //调用接口函数
    this.getUsersList();
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get("users", { params: this.queryInfo });
      // console.log(res);
      if (res.meta.status !== 200) {
        return res.meta.msg;
      }
      //成功后
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //定义分页
    handleSizeChange(a) {
      // console.log(a);
      this.queryInfo.pagesize = a;
      this.getUsersList();
    },
    handleCurrentChange(b) {
      // console.log(b);
      this.queryInfo.pagenum = b;
      this.getUsersList();
    },
    //定义用户状态开关
    async switchChanage(userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
    },
    //定义用户添加显示隐藏
    // handleClose() {
    //   dialogVisible = !dialogVisible;
    // },
    //定义修改用户显示隐藏
    // editUser(){
    //   editDialogVisible = !editDialogVisible;
    // },
    //定义添加用户对话框重置
    closeDialog1() {
      this.$refs.addRuleForm.resetFields();
    },
    //定义修改按钮删除对话框重置
    closeDialog() {
      this.$refs.editruleForm.resetFields();
    },
    //用户添加确认按钮
    addUser() {
      this.$refs.ruleForm.validate(async valid => {
        // console.log(valid);
        if (!valid) return;
        //调用接口
        const { data: res } = await this.$http.post("users", this.ruleForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.getUsersList();
        this.dialogVisible = false;
      });
    },
    //删除按钮
    deleteUser(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          //用户点击删除调用接口
          const { data: res } = await this.$http.delete("users/" + id);
          if (res.meta.status != 200) return;
          this.getUsersList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //点击的时候查询角色id
    async getUser(id) {
      const { data: res } = await this.$http.get("users/" + id);
      this.getuser = res.data;
      this.editDialogVisible = true;
      // console.log(res);
    },
    //确认修改用户信息
    editUser() {
      //先判断用户输入是否合法
      this.$refs.editruleForm.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put("users/" + this.getuser.id, {
          email: this.getuser.email,
          mobile: this.getuser.mobile
        });
        if (res.meta.status !== 200) {
          return res.meta.msg;
        }
        this.getUsersList();
        this.editDialogVisible = false;
      });
    },
    //分配角色按钮
    async assignRoles(userinfo) {
      this.dialogFormVisible = true;
      this.userPower = userinfo;
      //调用接口
      const { data: res } = await this.$http.get("roles");
      this.allRoles = res.data;
    },
    //点击确定分配角色
    async confirmUser() {
      this.dialogFormVisible = false;
      //调用接口
      const {data:res} = await this.$http.put(`users/${this.userPower.id}/role`,{rid:this.changeRole})
      if(res.meta.status !== 200){return this.$message.error(res.meta.msg)}
    this.getUsersList();
    },
    //分配角色关闭事件
    closeAAA(){
      this.changeRole='';
    }
  }
};
</script>

<style scoped lang="less">
.box-card {
  margin-top: 15px;
}
</style>
