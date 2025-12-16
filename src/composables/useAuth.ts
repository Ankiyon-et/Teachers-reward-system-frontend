import { ref } from 'vue';

export const userRoleId = ref<number>(
  Number(localStorage.getItem('role_id')) || 0
);

export const userToken = ref(localStorage.getItem('token') || '');

export const setUserRoleId = (role: number) => {
  userRoleId.value = role;
  localStorage.setItem('role_id', role.toString()); // or sessionStorage if you prefer
};

export function setUserToken(token: string) {
  userToken.value = token;
  localStorage.setItem("token", token);
}

// || sessionStorage.getItem('role_id')