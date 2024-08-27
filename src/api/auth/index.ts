import request, { BaseResponse } from "@/utils/request";
import { LoginParems } from "./types";

export function loginParam(data: any): Promise<BaseResponse> {
  return request({
    url: "/auth/eth_signData",
    method: "post",
    data: data,
  });
}
export function loginApi(data: any): Promise<BaseResponse> {
  return request({
    url: "/auth/eth_signIn",
    method: "post",
    data: data,
  });
}


export function Login(data: LoginParems): Promise<BaseResponse> {
  return request({
    url: "backadmin/login",
    method: "post",
    data: data,
  });
}
