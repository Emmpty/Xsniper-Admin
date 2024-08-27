import request, { BaseResponse } from "@/utils/request";

// 推送记录列表
export function pushList(data: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/user_pushlog_page",
    method: "post",
    data: data,
  });
}

