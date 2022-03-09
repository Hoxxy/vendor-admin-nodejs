import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Product } from "src/app/model/product";

@Injectable()
export class ProductService {

    constructor(public _HttpClient: HttpClient) { }

    public count(): Promise<number> {
        return this._HttpClient.get<number>
          ("http://localhost:1313/vendor/product/count").toPromise();
    }

    public listProducts(): Promise<Array<Product>> {
        return this._HttpClient.get<Array<Product>>
          ("http://localhost:1313/vendor/product/list").toPromise();
    }

    public updateProduct(productId: number, newData: Product): Promise<Product> {    
        return this._HttpClient.patch<Product>
          ("http://localhost:1313/vendor/product/update/" + productId, newData).toPromise();
    }

    public deleteProduct(productId: number): Promise<any> {
        return this._HttpClient.delete<any>
          ("http://localhost:1313/vendor/product/delete/" + productId).toPromise();
      }

    public createNewProduct(newProduct: Product): Promise<Product> {
        console.log(newProduct.category);
        return this._HttpClient.post<Product>
            ("http://localhost:1313/vendor/product/insert", newProduct).toPromise();
    }

    public getProductsInCategory(categoryId: number): Promise<Array<Product>> {
        return this._HttpClient.get<Array<Product>>
          ("http://localhost:1313/vendor/product/list/" + categoryId).toPromise();
    }

    public findProduct(productId: number): Promise<Product> {
        return this._HttpClient.get<Product>
          ("http://localhost:1313/vendor/product/find/" + productId).toPromise();
    }
}