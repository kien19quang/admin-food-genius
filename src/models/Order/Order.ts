import { IRestaurant } from "../Restaurant/RestaurantModel";
import { IUser } from "../User/UserModel";

export interface IOrder {
  _id: string
  price: number;
  isPaid: boolean;
  isShipped: boolean;
  restaurant: IRestaurant;
  customer: IUser
}