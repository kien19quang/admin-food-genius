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
  dishes: IDish[]
}

export interface RestaurantDto {
  name: string;
  description: string;
  image: string;
  lng: number;
  lat: number;
  address: string;
  categoriesIds?: string[]
}

export interface IDish {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface DishDto {
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantId: string;
}

export interface IFeatured {
  _id: string;
  title: string;
  description: string;
  restaurants: IRestaurant[];
  isVisible: boolean;
  order: number;
}

export interface FeaturedDto {
  title: string;
  description: string;
  isVisible: boolean;
  restaurantIds: string[]
}