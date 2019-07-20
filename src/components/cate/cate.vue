<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card class="box-card">
      <el-row>
        <el-button type="primary" @click="addLevel">添加按钮</el-button>
      </el-row>
      <!-- 表格试图 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :show-row-hover="false"
        :show-index="true"
        :expand-type="false"
        :selection-type="false"
        index-text="#"
        :border="true"
        class="treeTable"
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:green"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="grade" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>
        <template slot="ios">
          <el-button type="success" class="el-icon-edit">编 辑</el-button>
          <el-button type="warning" class="el-icon-delete">删 除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userinfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加弹出对话框 -->

    <el-dialog title="提示" :visible.sync="adddialogVisible" width="50%" @close="closeCateList">
      <!-- 添加的项目 -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类名称">
          <!-- 级联选择器 -->
          <el-cascader
            :options="parentCateList"
            :props="zhouzhou"
            parentCateList
            id="zh1"
            v-model="selectKeys"
            clearable
            change-on-select
            @change="changeCateList"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 点击确定 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { type } from "os";
export default {
  data() {
    return {
      // 这是获取商品列表需要的参数1.当前页码之2.每页显示的数据条数
      userinfo: {
        pagenum: 1,
        pagesize: 5
      },
      //添加对话框显示影藏
      adddialogVisible: false,
      //保存获取商品列表传递回来的总条数和数据
      catelist: [],
      total: 0,
      //定义tree-table的的属性
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          //   作用域插槽
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          //   作用域插槽
          label: "排序",
          type: "template",
          template: "grade"
        },
        {
          //   作用域插槽
          label: "操作",
          type: "template",
          template: "ios"
        }
      ],
      //   添加项目的名称
      ruleForm: {
        name: ""
      },
      //验证规则
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },
      //一级二级的分类
      parentCateList: [],
      //级联选择器样式
      zhouzhou: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //   级联选择器选中后,打印出来的id
      selectKeys: "",
      //级联选择器添加需要用到的值
      addCategories: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0
      }
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    //   调用获取商品列表的接口
    async getCategories() {
      const { data: res } = await this.$http.get("categories", {
        params: this.userinfo
      });
      //   console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.erroe("获取商品列表失败");
      }
      // this.$message.success("获取商品列表成功");
      this.catelist = res.data.result;
      this.total = res.data.total;
      //   console.log(this.total);
    },
    //监听当前页改变
    handleCurrentChange(newsize) {
      this.userinfo.pagenum = newsize;
      //刷新页面
      this.getCategories();
    },
    //监听每页显示的条数
    handleSizeChange(pagesize) {
      this.userinfo.pagesize = pagesize;
      this.getCategories();
    },
    //添加商品级别
    addLevel() {
      this.addCategories.cat_pid = 0;
      this.addCategories.cat_level = 0;
      this.adddialogVisible = true;
      this.getParentCateList();
    },
    //获取添加商品数据
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      //   console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.parentCateList = res.data;
      // console.log(this.parentCateList);
    },
    //级联选择器发生改变的时候
    changeCateList() {
      //根据获得到的值进行判断
      if (this.selectKeys.length > 0) {
        //父级分类id
        this.addCategories.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        //二级分类id
        this.addCategories.cat_level = this.selectKeys.length;
        return;
      }
    },
    //点击确定调用接口
     editCateList() {
      //预验证
      this.$refs.ruleForm.validate(async valid =>{
        if(!valid) return
              this.addCategories.cat_name = this.ruleForm.name;
      this.adddialogVisible = false;
      const { data: res } = await this.$http.post("categories", this.addCategories);
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success("成功");
      this.getCategories();
      })
    },
    //关闭后清空内容
    closeCateList() {
      this.$refs.ruleForm.resetFields();
      this.selectKeys = '';
    }
  }
};
</script>

<style lang="less" scoped>
.treeTable {
  margin: 15px !important;
}
#zh1 {
  width: 100%;
}
</style>
