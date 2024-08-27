import { Login } from "@/api/auth";
import { getUserDetailInfo } from "@/api/user/user";
import { resetRouter } from "@/router";
import { store } from "@/store";

import { LoginParems } from "@/api/auth/types";
import { UserInfo } from "@/api/user/types";
import { useEthStore } from "@/store/modules/eth";



export const useUserStore = defineStore("user", () => {

  const user = ref({
    roles: ['ROOT'],
    perms: [],
    token: '',
    address: '',

  });
  const userInfo = ref({})
  const currentActivePanelId = ref()
  /**
   * 登录
   *
   * @param {LoginParems}
   * @returns
   */
  async function login(loginParams: LoginParems) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const loginRes = await Login(loginParams)
        if (loginRes.code == 200) {
          localStorage.setItem("token", loginRes.Authorization); // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
          localStorage.setItem("userInfo", JSON.stringify({ ...loginRes.result, }))
          userInfo.value = { ...loginRes.result, }
          user.value.token = loginRes.Authorization
          resolve();
        } else {
          reject()
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      getUserDetailInfo({})
        .then((res) => {
          const { code, result } = res
          if (code != 200) {
            return reject('获取用户信息失败')
          }

          userInfo.value = { ...userInfo.value, ...result.user }
          Object.assign(user, { ...result });
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      // logoutApi()
      //   .then(() => {
      const ethStore = useEthStore()
      ethStore.MMSDK && ethStore.MMSDK.disconnect();
      window.okxwallet && window.okxwallet.request({ method: 'eth_requestAccounts' });
      localStorage.setItem("token", "");
      localStorage.setItem("userInfo", "")
      location.reload(); // 清空路由
      resolve();
      // })
      // .catch((error) => {
      //   reject(error);
      // });
    });
  }

  // remove token
  function resetToken() {
    console.log("resetToken");
    return new Promise<void>((resolve) => {
      localStorage.setItem("token", "");
      resetRouter();
      resolve();
    });
  }

  const changePanelId = (value: string | number) => {
    currentActivePanelId.value = value
  }

  return {
    user,
    userInfo,
    currentActivePanelId,
    login,
    getUserInfo,
    logout,
    resetToken,
    changePanelId
  };
}, {
  persist: true,
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
