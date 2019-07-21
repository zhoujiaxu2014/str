<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card class="box-card">
      <!-- 提示文本 -->
      <el-alert show-icon title="只允许设置第三级分类相关属性" type="warning"></el-alert>
      <!-- 级联选择器 -->
      <div style="margin:15px 0">
        选择商品分类:
        <el-cascader
          v-model="cateListID"
          :options="cateList"
          :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
          @change="changeCateList"
        ></el-cascader>
      </div>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态属性 -->
        <el-tab-pane label="动态参数" name="many" :disabled="disabledBtn">
          <el-table :data="dongTai" style="width: 100%" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" class="el-icon-edit">编 辑</el-button>
                <el-button type="danger" class="el-icon-share">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态参数" name="only" :disabled="disabledBtn">
          <el-table :data="jingTai" style="width: 100%" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" class="el-icon-edit">编 辑</el-button>
                <el-button type="danger" class="el-icon-share">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取到的商品分类保存在着
      cateList: [],
      //保存的id值
      cateListID: "",
      //标签页的选中的名称
      activeName: "many",
      //动静态参数
      dongTai: [],
      jingTai: []
    };
  },
  //定义一个计算属性
  computed: {
    //   禁用按钮
    disabledBtn() {
      if (this.cateListID.length != 3) {
        return true;
      } else {
        return false;
      }
    },
    // 获取选择三类id
    getCateListID() {
      if (this.cateListID.length === 3) {
        return this.cateListID[2];
      }
      return null;
    }
  },
  created() {
    this.getCategories();
  },
  methods: {
    //获取到商品分类
    async getCategories() {
      const { data: res } = await this.$http.get("categories");
      //把获取到的值存
      this.cateList = res.data;
    },
    //获取到三级分类的内容
    changeCateList() {
      if (this.cateListID.length != 3) {
        this.cateListID = [];
        return this.$message.error("请选择第三级分类");
      }
      this.getDJactive();
    },
    //标签页被选中触发的事件
    handleClick() {
      this.getDJactive();
    },
    //定义获取动静态数据在多处调用
    async getDJactive() {
      //获取动态/静态参数
      const { data: res } = await this.$http.get(
        `categories/${this.getCateListID}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (this.activeName === "many") {
        this.dongTai = res.data;
      } else {
        this.jingTai = res.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
