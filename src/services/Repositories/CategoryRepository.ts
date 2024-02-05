import ApiClient from "@/configs/axiosConfig";
import { CategoryDto } from "@/models/Category/CategoryModel";
import axios from "axios";

class CategoryRepository {
  async getListCategory () {
    const categories = await ApiClient.GET('/category')
    return categories
  }

  async createCategory(data: CategoryDto) {
    return await ApiClient.POST('/category', data)
  }

  async updateCategory(id: string, data: CategoryDto) {
    return await ApiClient.PUT(`/category/${id}`, data)
  }

  async deleteCategory(id: string) {
    return await ApiClient.DELETE(`/category/${id}`)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CategoryRepository();
