<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/goods'}">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 步骤 -->
      <el-steps :active="activeTab-0" align-center>
        <el-step title="基本信息" description></el-step>
        <el-step title="商品参数" description></el-step>
        <el-step title="商品属性" description></el-step>
        <el-step title="商品图片" description></el-step>
        <el-step title="商品内容" description></el-step>
        <el-step title="完成" description></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-tabs
        :tab-position="tabPosition"
        style="margin:15px 0;"
        v-model="activeTab"
        :before-leave="chanerTab"
        ref="tabsRef"
        @tab-click="tabClick"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form :model="addRuleForm" :rules="addRules" ref="ruleFormRef" label-width="100px">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addRuleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="addRuleForm.price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="heavy">
              <el-input v-model="addRuleForm.heavy"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="math">
              <el-input v-model="addRuleForm.math"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addRuleForm.classify"
                :options="classifyOptions"
                @change="handleChange"
                :props="props"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <!-- 商品标题 -->
          <el-form>
            <el-form-item :label="item.attr_name" v-for="item in priceList" :key="item.attr_id">
              <!-- 商品标签 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label=" cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form>
            <el-form-item :label="item.attr_name" v-for="item in heavyList" :key="item.attr_id">
              <!-- 商品属性 -->
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">定时任务补偿</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 控制标签页方向
      tabPosition: "left",
      //选择位置
      activeTab: "",
      //规则
      addRules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入价格名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        heavy: [
          { required: true, message: "请输入重量名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        math: [
          { required: true, message: "请输入数量名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      //用户输入的信息
      addRuleForm: {
        //   名称
        name: "",
        // 价格
        price: "",
        //重量
        heavy: "",
        //数量
        math: "",
        //分类
        classify: ""
      },
      //商品分类的数据
      classifyOptions: [],
      //定义商品分类的三级联动
      props: {
        label: "cat_name",
        children: "children",
        value: "cat_id"
      },
      //储存用户选择三级的长度
      idLength: 0,
      //三级列的id
      id: "",
      //商品参数数据
      priceList: [],
      //商品属性数据
      heavyList: [],
      //商品标签选择项
      checkList: []
    };
  },
  created() {
    this.getClassify();
  },
  methods: {
    //商品基本信息的点击事件
    handleChange(row) {
      this.idLength = row.length;
      // console.log(row)
      this.id = row[2];

      //判断用户选择是否三级选
      if (row.length != 3) {
        this.addRuleForm.classify = [];
        return this.$message.error("请选择三级分类哦,亲");
      }
      //   this.$refs.ruleFormRef.validate(valid => {
      //     if (!valid) {
      //       return (this.tabDbd = true);
      //     }
      //   });
    },
    //获取商品分类数据
    async getClassify() {
      const { data: res } = await this.$http.get("categories");
      //  console.log(res);
      this.classifyOptions = res.data;
      // console.log(res.data);
    },
    //   标签切换验证
    chanerTab(activeName, oldActiveName) {
      // console.log(this.idLength);
      if (this.idLength !== 3 && oldActiveName === "0") {
        return false;
      }
    },
    // 标签点击事件
    async tabClick() {
      //   console.log(this.activeTab);
      //   console.log(typeof(this.activeTab));

      if (this.activeTab === "1") {
        //调用接口
        const { data: res } = await this.$http.get(
          `categories/${this.id}/attributes`,
          { params: { sel: "many" } }
        );
        res.data.forEach(item => {
          item.attr_vals.length === 0
            ? (item.attr_vals = [])
            : (item.attr_vals = item.attr_vals.split(","));
        });
        this.priceList = res.data;
      } else if (
        //商品属性页面
        this.activeTab === "2"
      ) {
        const { data: res } = await this.$http.get(
          `categories/${this.id}/attributes`,
          { params: { sel: "only" } }
        );
        console.log(res);
        this.heavyList = res.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
