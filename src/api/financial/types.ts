export interface PageType {
  endTime?: Date;
  pageNum: number;
  pageSize: number;
  startTime?: Date;
  [property: string]: any;
}

export interface ExtendedPageType extends PageType {
  extraProperty1?: string;
  extraProperty2?: number;
}

export interface AddVIP {
  /**
   * 过期时间
   */
  expire_date: Date;
  /**
   * 会员类型，SVIP   VIP
   */
  type: string;
  /**
   * 用户ID
   */
  user_id: number;
  [property: string]: any;
}