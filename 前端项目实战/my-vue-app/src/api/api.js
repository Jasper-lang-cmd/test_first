/**
 * 整个项目 api 的管理
 */

import { Mock } from "mockjs";
import request from "./request";
import { fa } from "element-plus/es/locale/index.mjs";

// 请求首页左侧的表格的数据
export default {
  getTableData() {
    return request({
      url: "/home/getTableData",
      method: "get",
      mock: true,
    });
  },
  getCountData() {
    return request({
      url: "/home/getCountData",
      method: "get",
      // mock: true,
    });
  },
  getChartData() {
    return request({
      url: "/home/getChartData",
      method: "get",
      // mock: true,
    });
  },
  getUserData(data) {
    return request({
      url: "/home/getUserData",
      method: "get",
      data,
    });
  },
  deleteUser(data) {
    return request({
      url: "/user/deleteUser",
      method: "get",
      data,
    });
  },
  addUser(data) {
    return request({
      url: "/user/addUser",
      method: "post",
      data,
    });
  },
  editUser(data) {
    return request({
      url: "/user/editUser",
      method: "post",
      data,
    });
  },
  getMenu(params) {
    return request({
      url: "/permission/getMenu",
      method: "post",
      data: params,
    });
  },
};
