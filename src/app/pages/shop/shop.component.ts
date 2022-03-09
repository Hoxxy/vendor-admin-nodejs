import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/model/category';
import { Product } from 'src/app/model/product';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  categoryList: Array<Category>;
  productList: Array<Product>;

  constructor(
    private _CategoryService: CategoryService,
    private _ProductService: ProductService
  ) { }

  ngOnInit(): void {
    this._CategoryService.listCategories().then(response => {
      this.categoryList = response;

      this._ProductService.listProducts().then(response => {
        this.productList = response;
      });
    });
  }

}
