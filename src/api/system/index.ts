import request, { BaseResponse } from "@/utils/request";

export function FetchSystemSetting(data: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/platform_set",
    method: "post",
    data: data,
  });
}

export function FetchAccountPool(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/platform_pool_info",
    method: "get",
    params: data,
  });
}


export function exportAccount(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/platform_export",
    method: "post",
    data: data,
  });
}

export function FetchAnnouncementList(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/announcement_page",
    method: "post",
    data: data,
  });
}

export function uploadFileApi(file: any): Promise<BaseResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/backadmin/announcement_upload",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function SaveAnnouncement(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/announcement_save",
    method: "post",
    data: data,
  });
}

export function FetchRecommend(data?: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/focus_get",
    method: "post",
    data: data,
  });
}

export function ImportRecommend(data: any): Promise<BaseResponse> {
  return request({
    url: "/backadmin/focus_add",
    method: "post",
    data: data,
  });
}

export function ImportRecommendByExcel(data: any): Promise<BaseResponse> {
  return request({
    url: '/backadmin/import_focus',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function FetchFileTemplate(): Promise<BaseResponse> {
  return request({
    url: "/backadmin/focus_template",
    method: "get",
  });
}