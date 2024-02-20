import ApiClient from "@/configs/axiosConfig";

class OrderRepository {
  async getListOrder (restaurantId: string) {
    const listOrder = await ApiClient.GET(`/order?restaurantId=${restaurantId}`)
    return listOrder
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new OrderRepository();
