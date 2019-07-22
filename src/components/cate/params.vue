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
        <!-- 添加按钮 -->
        <el-button
          type="success"
          style="margin:0 0 10px 10px"
          @click="addProperty"
          :disabled="disabledBtn"
        >添加属性</el-button>
        <!-- 动态属性 -->
        <el-tab-pane label="动态参数" name="many" :disabled="disabledBtn">
          <el-table :data="dongTai" style="width: 100%" border stripe>
            <!-- 扩展列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  style="margin:10px"
                  closable
                  @close="closeTab(scope.row,i)"
                >{{item }}</el-tag>
                <!-- 添加扩展列 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  style="width:100px"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  class="el-icon-edit"
                  @click="editStr(scope.row.attr_id)"
                >编 辑</el-button>
                <el-button type="danger" @click="open(scope.row.attr_id)">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态参数" name="only" :disabled="disabledBtn">
          <el-table :data="jingTai" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  style="margin:10px"
                >{{item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  style="width:100px"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  class="el-icon-edit"
                  @click="editStr(scope.row.attr_id)"
                >编 辑</el-button>
                <el-button type="danger" @click="open(scope.row.attr_id)">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加按钮对话框 -->
    <el-dialog
      :title="'添加'+dialogTitle+'属性'"
      :visible.sync="dialogVisible"
      width="50%"
      @close="cloceTab"
    >
      <!-- 表单 -->
      <el-form :rules="addRules" ref="addRuleFormref" label-width="100px" :model="addRuleForm">
        <el-form-item :label="dialogTitle+'属性'" prop="name">
          <el-input v-model="addRuleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 表单end -->
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitToAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑按钮 -->
    <el-dialog
      :title="'修改'+dialogTitle+'属性'"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="cloceTab"
    >
      <!-- 表单 -->
      <el-form :rules="editRules" ref="addRuleFormref" label-width="100px" :model="editRuleForm">
        <el-form-item :label="dialogTitle+'属性'" prop="name">
          <el-input v-model="editRuleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 表单end -->
      <span slot="footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editToAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { async } from "q";
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
      //编辑显示隐藏
      editdialogVisible: false,
      jingTai: [],
      // 对话框的显示隐藏
      dialogVisible: false,
      // 规则
      addRules: {
        name: [
          { required: true, message: "请输入添加属性", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      },
      editRules: {
        name: [
          { required: true, message: "请输入添加属性", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      },
      // 添加的值
      addRuleForm: {
        name: ""
      },
      //修改的值
      editRuleForm: {
        name: ""
      },
      //修改的值保存
      editData: "",
      //分类id
      attrId: "",
      //删除
      deleteVisible: "",
      // 扩展列添加
      inputVisible: false,
      inputValue: ""
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
    },
    //定义添加对话框的标题
    dialogTitle() {
      if (this.activeName === "many") {
        return "动态";
      } else {
        return "静态";
      }
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
        this.dongTai=[];
        this.jingTai=[]
        return this.$message.error("请选择第三级分类");

      }
      this.getDJactive();
      // console.log(this.cateListID);
    },
    //标签页被选中触发的事件
    handleClick() {
      // 刷新
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
      // 有些数据没有会报错
      // console.log(res.data[0].attr_vals);
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        // 这里定义一下添加扩展列的属性,使成为唯一值
        item.inputVisible = false;
        item.inputValue = "";
      });

      if (this.activeName === "many") {
        this.dongTai = res.data;
      } else {
        this.jingTai = res.data;
      }
      console.log(this.dongTai);
    },
    //点击添加属性
    addProperty() {
      this.dialogVisible = true;
    },
    //重置对话框
    cloceTab() {
      this.$refs.addRuleFormref.resetFields();
    },
    //添加属性调用接口
    submitToAdd() {
      //预判断
      this.$refs.addRuleFormref.validate(async valid => {
        if (!valid) return;
        //调用接口
        const { data: res } = await this.$http.post(
          `categories/${
            this.cateListID[this.cateListID.length - 1]
          }/attributes`,
          {
            //参数名称
            attr_name: this.addRuleForm.name,
            //动态还是静态
            attr_sel: this.activeName
          }
        );
        this.dialogVisible = false;
        this.getDJactive();
        if (res.meta.status !== 201) {
          return;
        }
        this.$message.success("添加成功");
      });
    },
    // 修改获取参数
    async editStr(id) {
      this.editdialogVisible = true;
      this.attrId = id;
      //获取到数据
      const { data: res } = await this.$http.get(
        `categories/${this.getCateListID}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName }
        }
      );

      this.editRuleForm.name = res.data.attr_name;
    },
    // 修改确认
    editToAdd() {
      //预判断
      this.$refs.addRuleFormref.validate(async valid => {
        if (!valid) return;
        //调用接口
        const { data: res } = await this.$http.put(
          `categories/${this.getCateListID}/attributes/${this.attrId}`,
          {
            attr_name: this.editRuleForm.name,
            attr_sel: this.activeName
          }
        );

        this.editdialogVisible = false;
        this.getDJactive();
        if (res.meta.status !== 201) {
          return;
        }
        this.$message.success("添加成功");
      });
    },
    // 点击删除
    open(id) {
      this.$confirm("此操作将永久删除该属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.getCateListID}/attributes/${id}`
          );
          console.log(res);
          if (res.meta.status != 200) {
            return;
          }
          // 刷新
          this.getDJactive();

          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //扩展列的input框显示隐藏
    showInput(row) {
      row.inputVisible = true;
      //$nextTick是当页面重新渲染后执行回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //失去焦点的时候或者按下回车键的时候
    handleInputConfirm(row) {
      //判断当输入的是空格的时候
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputVisible = false;
      row.inputValue = "";
      this.fengZhuang(row);
    },
    // 关闭时间
    closeTab(row, i) {
      row.attr_vals.splice(i, 1);
      this.fengZhuang(row);
    },
    //操作vals的方法封装一个函数
    async fengZhuang(row) {
      //调用接口
      const { data: res } = await this.$http.put(
        `categories/${this.getCateListID}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals + ""
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
</style>
