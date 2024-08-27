import { FetchRedeemCodeType } from "@/api/financial";
import { store } from "@/store";

export interface VIP {
  label: string;
  prop: string;
  value: number;
}

export const useVipStore = defineStore("vip", () => {
  const dropdownlist = ref<VIP[]>([]);

  // 获取Vip设置
  const FetchVipSetting = async () => {
    try {
      const { code, result } = await FetchRedeemCodeType()
      if (code == 200 && result) {
        dropdownlist.value = result.dropdownlist
      }
    } catch (error) {
      console.error('-----error', error);
    } finally {
    }
  }
  return {
    dropdownlist,
    FetchVipSetting
  };
}, {
  persist: true,
});

// 非setup
export function useVipStoreHook() {
  return useVipStore(store);
}
