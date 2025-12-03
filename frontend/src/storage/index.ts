import Cookies from "universal-cookie";
import { ActiveUserDataType } from "../types";
import { LOCAL_STORAGE_APP_KEY } from "../config";

const cookies = new Cookies();

export const storeActiveUser = (
  props: ActiveUserDataType,
  defaultPath?: boolean
) => {
  const activeUser: ActiveUserDataType = props;
  cookies.set(LOCAL_STORAGE_APP_KEY, JSON.stringify(activeUser), {
    path: "/",
    secure: true,
    sameSite: "strict",
  });
  if (!defaultPath) {
    window.history.pushState({}, "", "/");
  }
};

export const removeActiveUser = () => {
  cookies.remove(LOCAL_STORAGE_APP_KEY);
  window.history.pushState({}, "", "/");
};

export const getActiveUser = (): ActiveUserDataType | null => {
  const userData = cookies.get(LOCAL_STORAGE_APP_KEY);
  if (userData) {
    const parsedData: ActiveUserDataType = userData;
    return {
      id: parsedData.id,
      name: parsedData.name,
      email: parsedData.email,
      role: parsedData.role,
      token: parsedData.token,
    };
  }
  return null;
};
