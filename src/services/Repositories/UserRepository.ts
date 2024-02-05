import ApiClient from "@/configs/axiosConfig";
import { ILoginDto, IRegisterDto } from "@/models/Auth/AuthTypes";
import { JWT } from "next-auth/jwt";

class UserRepository {
  async register(data: IRegisterDto) {
    const user = await ApiClient.POST('/auth/register', data)
    return user
  }

  async login(data: ILoginDto) {
    const user = await ApiClient.POST("/auth/login", data);
    return user;
  }

  async refreshToken(token: JWT) {
    const newToken = await ApiClient.setHeaders({
      authorization: `Refresh ${token.refreshToken}`,
    }).POST("/auth/refresh");

    return {
      ...token,
      ...newToken
    }
  }

  async getListUser () {
    const users = await ApiClient.GET('/user')
    return users
  }

  async updateUser(id: string, data: ILoginDto) {
    return await ApiClient.PUT(`/user/${id}`, data)
  }

  async deleteUser(id: string) {
    return await ApiClient.DELETE(`/user/${id}`)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UserRepository();
