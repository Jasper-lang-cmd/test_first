<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <!-- 
            在 Element UI 的 <el-form> 组件中，inline 属性用于控制表单的布局是否为内联布局。
         当 inline 为 true 时，表单项将水平排列在同一行上（如果空间允许），而不是默认的垂直排列。
    -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input
          placeholder="请输入用户名"
          v-model="formInline.keyWord"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="table">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :width="item.width ? item.width : 125"
        :prop="item.prop"
        :label="item.label"
      />
      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #="scope">
          <!-- 
              @click="handleEdit(scope.row)"：这是一个事件监听器，当按钮被点击时，会调用handleEdit方法，
            并将当前行的数据（scope.row）作为参数传递。scope.row通常是在使用Element UI的表格组件（如<el-table>）时，
            通过作用域插槽（scoped slot）或show-overflow-tooltip属性等方式访问到的当前行数据。     
          -->
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 带有背景色的分页 -->
    <el-pagination
      class="pager"
      background
      layout="prev, pager, next"
      size="small"
      :total="config.total"
      @current-change="handleChange"
    />
  </div>
  <!-- 对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
    <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
    <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const tableData = ref([]);
// proxy（组件的代理对象，用于访问组件的响应式状态和方法）
const { proxy } = getCurrentInstance();
const getUserData = async () => {
  let data = await proxy.$api.getUserData(config);
  console.log(data);
  tableData.value = data.list.map((item) => ({
    ...item,
    sexLabel: item.sex === "1" ? "男" : "女",
  }));
  config.total = data.count;
};
const formInline = reactive({
  keyWord: "",
});
const tableLabel = reactive([
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "sexLabel",
    label: "性别",
  },
  {
    prop: "birth",
    label: "出生日期",
    width: 200,
  },
  {
    prop: "addr",
    label: "地址",
    width: 400,
  },
]);
const config = reactive({
  name: "",
  total: 0,
  page: 1,
});
// 搜索
const handleSearch = () => {
  config.name = formInline.keyWord;
  getUserData();
};
// 分页
const handleChange = (page) => {
  config.page = page;
  getUserData();
};
// 删除
const handleDelete = (val) => {
  // proxy.$api;
  // ElMessageBox.confirm 方法用于显示一个带有确认和取消按钮的对话框，常用于执行某些操作前的确认提示。
  ElMessageBox.confirm("你确定要删除吗？").then(async () => {
    await proxy.$api.deleteUser({ id: val.id });
    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
    });
    getUserData();
  });
};
// 新增和编辑共用一个窗口，所以通过设置action区分
const action = ref("add");
// 控制对话框是否显示
const dialogVisible = ref(false);
const formUser = reactive({
  sex: "1",
});
// 表单校验规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr: [{ required: true, message: "地址是必填项" }],
});
const handleClose = () => {
  // 获取表单，重置表单
  proxy.$refs["userForm"].resetFields();
  dialogVisible.value = false;
};
const handleCancel = () => {
  proxy.$refs["userForm"].resetFields();
  dialogVisible.value = false;
};
// 新增
const handleAdd = () => {
  dialogVisible.value = true;
  action.value = "add";
};
const timeFormat = (time) => {
  var time = new Date(time);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  function add(m) {
    return m < 10 ? "0" + m : m;
  }
  return year + "-" + add(month) + "-" + add(date);
};
const onSubmit = () => {
  // 先要校验
  proxy.$refs["userForm"].validate(async (vaild) => {
    if (vaild) {
      formUser.birth = /^\d{4}-\d{2}-\d{2}$/.test(formUser.birth)
        ? formUser.birth
        : timeFormat(formUser.birth);
      let res = null;
      if (action.value === "add") {
        console.log(formUser);
        res = await proxy.$api.addUser(formUser);
      } else {
        res = await proxy.$api.editUser(formUser);
      }
      if (res) {
        dialogVisible.value = false;
        proxy.$refs["userForm"].resetFields();
        getUserData();
      }
    } else {
      ElMessage({
        showClose: true,
        message: "请输入正确的内容",
        type: "error",
      });
    }
  });
};
// 编辑
const handleEdit = (val) => {
  action.value = "edit";
  dialogVisible.value = true;
  // 使用 nextTick 来确保在DOM更新之后执行代码。这是因为在Vue中，当你修改数据后，Vue会异步地更新DOM。
  // nextTick 允许你在DOM更新完成后立即执行代码。(在DOM更新后填充表单数据)
  nextTick(() => {
    Object.assign(formUser, { ...val, sex: "" + val.sex });
  });
};
onMounted(() => {
  getUserData();
});
</script>
<style scoped lang="less">
.user-header {
  display: flex;
  justify-content: space-between;
}

.table {
  position: relative;
  height: 520px;

  .pager {
    position: absolute;
    right: 10px;
    bottom: 30px;
  }

  .el-table {
    width: 100%;
    height: 500px;
  }
}

.select-clearn {
  display: flex;
}
</style>
