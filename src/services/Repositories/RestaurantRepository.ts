import ApiClient from "@/configs/axiosConfig";
import { DishDto, FeaturedDto, RestaurantDto } from "@/models/Restaurant/RestaurantModel";
import axios from "axios";

class RestaurantRepository {
  async getListRestaurant () {
    const restaurants = await ApiClient.GET('/restaurant')
    return restaurants
  }

  async getDetailRestaurant(id: string) {
    const restaurant = await ApiClient.GET(`/restaurant/${id}`)
    return restaurant
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

  async createDish(data: DishDto) {
    return await ApiClient.POST('/restaurant/dish', data)
  }

  async updateDish(id: string, data: DishDto) {
    return await ApiClient.PUT(`/restaurant/dish/${id}`, data)
  }

  async deleteDish(id: string) {
    return await ApiClient.DELETE(`/restaurant/dish/${id}`)
  }

  async getFeatured() {
    return await ApiClient.GET('/restaurant/featured')
  }

  async createFeatured(data: FeaturedDto) {
    return await ApiClient.POST('/restaurant/featured', data)
  }

  async updateFeatured(id: string, data: FeaturedDto) {
    return await ApiClient.PUT(`/restaurant/featured/${id}`, data)
  }

  async deleteFeatured(id: string) {
    return await ApiClient.DELETE(`/restaurant/featured/${id}`)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new RestaurantRepository();
