import ApiClient from "@/configs/axiosConfig";
import { RestaurantDto } from "@/models/Restaurant/RestaurantModel";
import axios from "axios";

class RestaurantRepository {
  async getListRestaurant () {
    const restaurants = await ApiClient.GET('/restaurant')
    return restaurants
  }

  async createRestaurant(data: RestaurantDto) {
    return await ApiClient.POST('/restaurant', data)
  }

  async updateRestaurant(id: string, data: RestaurantDto) {
    return await ApiClient.PUT(`/restaurant/${id}`, data)
  }

  async deleteRestaurant(id: string) {
    return await ApiClient.DELETE(`/restaurant/${id}`)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new RestaurantRepository();
