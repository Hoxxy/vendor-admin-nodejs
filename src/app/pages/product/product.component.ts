import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/model/product';
import { Review } from 'src/app/model/review';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ReviewService } from 'src/app/shared/services/review.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Product;
  reviews: Array<Review>;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _ProductService: ProductService,
    private _ReviewService: ReviewService,
    private _UserService: UserService,
    private _CategoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe(res => {
      this._ProductService.findProduct(res.id).then(response => {

        this.product = response;

        this._ReviewService.filterByProduct(res.id).then(response => {
          this.reviews = response;

          this.reviews.forEach(review => {
            this._UserService.findUser(review.userId).then(response => {
              review.displayname = response.firstname + " " + response.lastname;
            });
          });
        });
      })
    });
  }

}
