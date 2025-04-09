import { ENVIRONMENT } from "../env";
import { get } from "./API";
const SERVER_URL = ENVIRONMENT.CONFIG_URL;

const HEADER = "header";
export const getHeaderConfig = () => {
  return get(SERVER_URL, HEADER);
};

const LEFT_MENU = "leftmenu";
export const getLeftMenuConfig = () => {
  return get(SERVER_URL, LEFT_MENU);
};

const ROUTE = "routes";
export const getRouteConfig = () => {
  return get(SERVER_URL, ROUTE);
};

export const getConfig = (path: string) => {
  return get(SERVER_URL, path);
};
