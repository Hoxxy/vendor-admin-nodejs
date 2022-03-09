import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Category } from "src/app/model/category";

@Injectable()
export class CategoryService {
    constructor(public _HttpClient: HttpClient) { }

    public listCategories(): Promise<Array<Category>> {
        return this._HttpClient.get<Array<Category>>
          ("http://localhost:1313/vendor/category/list").toPromise();
    }

    public findCategory(categoryId: number): Promise<Category> {
        return this._HttpClient.get<Category>
          ("http://localhost:1313/vendor/category/find/"+categoryId).toPromise();
    }

    public createNewCategory(newCategory: Category): Promise<Category> {
        return this._HttpClient.post<Category>
          ("http://localhost:1313/vendor/category/insert", newCategory).toPromise();
    }

    public deleteCategory(categoryId: number): Promise<any> {
        return this._HttpClient.delete<any>
          ("http://localhost:1313/vendor/category/delete/" + categoryId).toPromise();
    }

    public updateCategory(categoryId: number, newCategoryData: Category): Promise<Category> {
        return this._HttpClient.patch<Category>
          ("http://localhost:1313/vendor/category/update/" + categoryId, newCategoryData).toPromise();
    }
}