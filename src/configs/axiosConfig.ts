import { message } from "antd";
import axios, { AxiosInstance } from "axios";
import { getSession } from "next-auth/react";
class BaseApi {
  axiosInstance: AxiosInstance;
  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || process.env.BACKEND_URL,
      headers: {
        "Content-Type": "application/json"
      },
    });

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session?.accessToken}`;
        }

        return config;
      },
      (error) => {
        message.error('Lỗi không xác định');
        console.log(error);

        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use((response) => {
      return response;
    });
  }

  setHeaders = (headers: any) => {
    this.axiosInstance.defaults.headers = {
      ...this.axiosInstance.defaults.headers,
      ...headers
    }

    return this
  }

  async GET<T = any>(url: string, params?: any): Promise<T> {
    return this.axiosInstance
      .get(url, { params })
      .then(response => response.data)
      .catch(error => {throw error})
  } 

  async POST<T = any>(url: string, data?: any): Promise<T> {
    return this.axiosInstance
      .post(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  async PUT<T = any>(url: string, data: any): Promise<T> {
    return this.axiosInstance
      .put(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  async DELETE<T = any>(url: string): Promise<T> {
    return this.axiosInstance
      .delete(url)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }
}

export { BaseApi }
const ApiClient = new BaseApi()

export default ApiClient