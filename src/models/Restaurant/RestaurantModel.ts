import { ICategory } from "../Category/CategoryModel";

export interface IRestaurant {
  _id: string;
  name: string;
  image: string;
  description: string;
  lng: number;
  lat: number;
  address: string;
  stars: number;
  reviews: number
  updatedAt: Date;
  createdAt: Date;
  categories: ICategory[]
}

export interface RestaurantDto {
  name: string;
  description: string;
  image: string;
  lng: number;
  lat: number;
  address: string;
}