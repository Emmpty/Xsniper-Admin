import defaultSettings from "@/settings";

// 导入 Element Plus 中英文语言包
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { MetaMaskSDK } from "@metamask/sdk";

// setup
export const useEthStore = defineStore("eth", () => {
  // state
  const MMSDK = new MetaMaskSDK({
    dappMetadata: {
      name: "Example Node.js Dapp",
      url: window.location.href,
    },
    // useDeeplink: true,
    enableAnalytics: true,
    checkInstallationImmediately: false,
    logging: {
      developerMode: true,
    },
    i18nOptions: {
      enabled: true,
    },
  });
  // actions
  async function initEthSDK () {
    return new Promise<any>(async (resolve, reject) => {
      try {
        await MMSDK.init()
        const accounts = await MMSDK.connect();
        console.log('connect request accounts', accounts);
        const ethereum = MMSDK.getProvider();
        resolve(ethereum)
      } catch (error) {
        reject(error)
      }
    })
  }

  async function changeAccounts () {
    window.okxwallet.on('accountsChanged', (accounts: Array<string>) => {
      console.error('>>>>>>>>>>>>>>accountsChanged', accounts);
    });

  }
  return {
    MMSDK,
    // ethereum,
    initEthSDK,
  };
});
