import { Category } from "./category";

export class Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: Category
    stock: number;
    ///////////////////
    titleEdit?: string;
    priceEdit?: number;
    descriptionEdit?: string;
    categoryEdit?: Category;
    stockEdit?: number;
}