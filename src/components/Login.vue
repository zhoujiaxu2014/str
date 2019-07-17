<template>
  <!-- 背景颜色 -->
  <div class="login_B">
    <!-- 登录盒子 -->
    <div class="login_user">
      <!-- 登录头像 -->
      <div class="login_img">
        <img src="../assets/pic.jpg" alt="" />
      </div>
      <!-- 登录 -->
      <el-form class="login_form" :model="form" :rules="form_rules" ref="fuleForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-s-custom" v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="form.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { async } from "q";
export default {
  //定义用户登录
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
      form_rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 10, message: "长度在 5 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //重置
    resetLoginForm: function() {
      this.$refs.fuleForm.resetFields();
    },
    login: function() {
      this.$refs.fuleForm.validate(async valid => {
        // console.log(valid);
        // 判断验证
        if (!valid) {
          return console.log("shibia");
        }
        //发送ajax请求
        const { data: res } = await this.$http.post("login", this.form);
        // console.log(res);
        // console.log(this.form);
        //判断错误的情况
        if (res.meta.status != 200) return this.$message.error("用户和密码错误");
        this.$message.success("登录成功");
        //保存token
        window.sessionStorage.setItem("token", res.data.token);
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style scoped lang="less">
.login_B {
  background-color: #2b4b6b;
  width: 100%;
  height: 100%;
}
.login_user {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login_img {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}

.el-input::before {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 17px;
}
</style>
