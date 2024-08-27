import request, { BaseResponse } from "@/utils/request";

// 用户列表
export function FetchUserList(data: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/user_list",
    method: "post",
    data: data,
  });
}
// 用户详情
export function FetchUserDetails(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/user_info",
    method: "post",
    data: data,
  });
}

// 用户关注列表
export function FetchUserFocusList(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/user_focus",
    method: "post",
    data: data,
  });
}
// 用户分组列表
export function FetchUserGroupList(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/user_group",
    method: "post",
    data: data,
  });
}
// 用户邀请列表
export function FetchUserInviteList(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/user_invite_page",
    method: "post",
    data: data,
  });
}
// 用户关键词列表
export function FetchUserKeywordList(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/user_keyword_page",
    method: "post",
    data: data,
  });
}
// 修改用户推送设置
export function AmendUserPushSetting(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/user_focus_save",
    method: "post",
    data: data,
  });
}
// 解封、禁用账号
export function EnableOrdisableUser(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/user_account_disabled",
    method: "post",
    data: data,
  });
}


