export interface ICategory {
  _id: string;
  title: string;
  description: string;
  image: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface CategoryDto {
  title: string;
  description: string;
  image: string
}