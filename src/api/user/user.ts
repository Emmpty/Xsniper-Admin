import request, { BaseResponse } from "@/utils/request";

export interface loginRequestParams {
  password: string;
  phone: string;
}

// export interface loginRequestData {
//   password: 'string';
//   type: 'string'; // 默认为1，判断用户是pc端还是APP端登录
//   phone: 'string';
// }

// 登录
export function loginRequest(params: loginRequestParams): Promise<BaseResponse> {
  return request({
    url: "/user/loginWithCode",
    method: "post",
    data: {
      ...params,
    },
  });
}

export function addUser(params: any): Promise<BaseResponse> {
  return request({
    url: "/user/add",
    method: "post",
    data: {
      ...params,
    },
  });
}

export function updateNick(params: any): Promise<BaseResponse> {
  return request({
    url: "/user/updateNick",
    method: "post",
    data: {
      ...params,
    },
  });
}

export function enableUser(): Promise<BaseResponse> {
  return request({
    url: "/user/statusOn",
    method: "post",

  });
}

export function disabledUser(): Promise<BaseResponse> {
  return request({
    url: "/user/statusOff",
    method: "post",

  });
}

export function queryUser(params: any): Promise<BaseResponse> {
  return request({
    url: "/user/query",
    method: "post",
    data: {
      ...params,
    },
  });
}

export function userList(params: any): Promise<BaseResponse> {
  return request({
    url: "/user/queryForPage",
    method: "post",
    data: {
      ...params,
    },
  });
}

// 退出登录
export function logout(): Promise<BaseResponse> {
  return request({
    url: "/sys/user/logout",
    method: "get",
  });
}

//用户详情信息
export function getUserDetailInfo(params: any): Promise<BaseResponse> {
  return request({
    url: `/user/info`,
    method: "post",
    data: {
      ...params,
    },
  });
}

// 首页数据
export function getHomeDetail(): Promise<BaseResponse> {
  return request({
    url: "/sys/home",
    method: "get",
  });
}

// 修改密码
export function passwordUpdate(data: any): Promise<BaseResponse> {
  return request({
    url: "/sys/user/pwd",
    method: "put",
    data,
  });
}

export function getQRString(params: any): Promise<BaseResponse> {
  return request({
    url: "/user/getQRString",
    method: "post",
    data: {
      ...params,
    },
  });
}
