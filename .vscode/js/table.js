// 新增数据函数
function addRow() {
  var table = document.getElementById("table");
  // console.log(table);
  //   获取插入的位置
  var length = table.rows.length;
  // console.log(length);

  //   插入行节点
  var newRow = table.insertRow(length);
  // console.log(newRow);
  // newRow.innerHTML = "123456";

  //   插入列节点对象
  var nameCol = newRow.insertCell(0);
  var phoneCol = newRow.insertCell(1);
  var actionCol = newRow.insertCell(2);

  //   修改节点文本内容
  nameCol.innerHTML = "未命名";
  phoneCol.innerHTML = "无联系方式";
  actionCol.innerHTML =
    '<button onclick="editRow(this)">编辑</button><button onclick="deleteRow(this)">删除</button>';
}

// 删除数据函数
function deleteRow(button) {
  // console.log(button);
  // 获取节点后删除 button->td->tr (删除一行)
  var row = button.parentNode.parentNode;
  console.log(row);
  // 通过row(tr)的父节点来删除。（自己不能删除自己）
  row.parentNode.removeChild(row);
}

// 编辑数据函数
function editRow(button) {
  // console.log(button);
  var row = button.parentNode.parentNode;
  var name = row.cells[0];
  var phone = row.cells[1];
  // prompt : 弹窗
  var inputName = prompt("请输入名字 : ");
  var inputPhone = prompt("请输入联系方式 : ");

  name.innerHTML = inputName;
  phone.innerHTML = inputPhone;

  // 可以添加判断，内容为空时
}
