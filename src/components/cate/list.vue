<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="请输入内容" v-model="userInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="serchList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="goodsList">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="ShopList" stripe style="width: 100%" border>
        <el-table-column prop="goods_name" label="商品名称
        " width="500"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)
        " width="180"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量
        " width="180"></el-table-column>
        <el-table-column prop="add_time" label="创建时间
        " width="180">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作
        " width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteList(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="userInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //添加输入框的内容
      addUserInfo: "",
      //获取数据接口需要的内容
      userInfo: {
        pagenum: 1,
        pagesize: 5,
        query: ""
      },

      total: 0,

      //数据的数据
      ShopList: []
    };
  },
  created() {
    this.getUsersInfo();
  },
  methods: {
    //调用接口获取数据
    async getUsersInfo() {
      const { data: res } = await this.$http.get("goods", {
        params: this.userInfo
      });
      // console.log(res);
      this.ShopList = res.data.goods;
      this.total = res.data.total;
      // console.log(this.ShopList);
      // console.log(this.total);
    },
    //每页条数
    handleSizeChange(val) {
      this.userInfo.pagesize = val;
      this.getUsersInfo();
    },
    //当前页数
    handleCurrentChange(val) {
      this.userInfo.pagenum = val;
      this.getUsersInfo();
    },
    //搜索
    async serchList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.userInfo
      });
      this.ShopList = res.data.goods;
    },
   async deleteList(id) {
      // console.log(id);
      const {data:res} = await this.$http.delete(`goods/${id}`)
    this.getUsersInfo();
      
    },
    //飞翔另一页面
    goodsList(){
      this.$router.push('goods/list')
    }
  }
};
</script>

<style lang="less" scoped>
</style>
