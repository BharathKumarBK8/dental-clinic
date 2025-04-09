import { ENVIRONMENT } from "../env";
import { get, remove, update, post } from "./API";

const API_URL = ENVIRONMENT.API_URL;

export const getData = async (url: string): Promise<any> => {
  return await get(API_URL, url);
};
export const postData = async (url: string, data: any): Promise<any> => {
  return await post(API_URL, url, data);
};
export const updateData = async (url: string, data: any): Promise<any> => {
  return await update(API_URL, url, data);
};
export const deleteData = async (url: string): Promise<any> => {
  return await remove(API_URL, url);
};
