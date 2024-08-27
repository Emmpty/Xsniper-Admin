import request, { BaseResponse } from "@/utils/request";
import { AddVIP, PageType } from "./types";

// 订单列表
export function FetchOrderList(data: PageType): Promise<BaseResponse> {
  return request({
    url: "/backadmin/financial_order_list",
    method: "post",
    data: data,
  });
}

// 添加会员
export function AddVip(data?: AddVIP): Promise<BaseResponse> {
  return request({
    url: "/backadmin/financial_addmember",
    method: "post",
    data: data,
  });
}

// 提现申请列表
export function FetchWithdrawList(data?: PageType): Promise<BaseResponse> {
  return request({
    url: "/backadmin/financial_withdraw_list",
    method: "post",
    data: data,
  });
}
// 通过拒绝提现
export function ProcessingWithdrawal(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/financial_withdraw_approval",
    method: "post",
    data: data,
  });
}

// 折扣码列表
export function FetchDiscountCodeList(data?: PageType): Promise<BaseResponse> {
  return request({
    url: "/backadmin/discount_code_list",
    method: "post",
    data: data,
  });
}
// 创建编辑折扣码
export function CreatDiscountCode(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/discount_code_add",
    method: "post",
    data: data,
  });
}

// 兑换码列表
export function FetchCashcodeList(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/cashcode_list",
    method: "post",
    data: data,
  });
}
// 获取兑换码类型
export function FetchRedeemCodeType(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/cashcode_list_drop_down_list",
    method: "get",
    params: data,
  });
}
// 创建兑换码
export function CreatRedeemCode(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/cashcode_add_cash_code",
    method: "post",
    data: data,
  });
}
// 删除兑换码
export function DeleteRedeemCode(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/cashcode_delete_cash_code",
    method: "post",
    data: data,
  });
}


