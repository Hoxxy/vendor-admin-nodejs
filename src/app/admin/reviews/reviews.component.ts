import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Review } from 'src/app/model/review';
import { ProductService } from 'src/app/shared/services/product.service';
import { ReviewService } from 'src/app/shared/services/review.service';
import { UserService } from 'src/app/shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class AdminReviewsComponent implements OnInit {

  listedReviews = new MatTableDataSource<Review>();
  displayedColumnsReviews = ["displayname", "productTitle", "review", "text"];
  pageSizeOptions: number[] = [10, 20, 50, 100];
  showProgress: boolean = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sortProduct: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorProduct: MatPaginator;

  constructor(
    private _UserService: UserService,
    private _ProductService: ProductService, 
    private _ReviewService: ReviewService
  ) { }

  ngOnInit(): void {
  }

  filterByUser(): void {
    Swal.fire({
      title: "Filter by User",
      text: "User ID:",
      input: "text",
      inputValue: "",
      inputAutoTrim: true,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Search",
      confirmButtonColor: "green",
      cancelButtonText: "Cancel"
    }).then(response => {
      if (response.isConfirmed) {
        var userid = Number(response.value);
        this.showProgress = true;
       
        setTimeout(() => {
          this._ReviewService.filterByUser(userid).then(response => {
            if (response.length > 0)
            {
              response.forEach(review => {
                this._UserService.findUser(review.userId).then(response => {
                  review.displayname = response.firstname + " " + response.lastname;
                }, reject => Promise.reject(reject));
                this._ProductService.findProduct(review.productId).then(response => {
                  review.productname = response.title;
                }, reject => Promise.reject(reject));
              });

              this.paginator.pageSize = 10;
              this.listedReviews.data = response;
              this.listedReviews.sort = this.sort;
              this.listedReviews.paginator = this.paginator;
            }
            else {
              Swal.fire({
                title: "Error",
                text: "User ID " + userid + " is invalid or the User hasn't reviewed any products yet.",
                icon: "error",
                showCancelButton: false,
                confirmButtonText: "OK"
              });
              this.showProgress = false;
            }
          }, reject => {
            Swal.fire({
              title: "Error",
              text: "Error finding a Review. Please check if Spring REST service is running.",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "OK"
            });
          });
          this.showProgress = false;
        }, 750);
      }
    });
  }

  filterByProduct(): void {
    Swal.fire({
      title: "Filter by Product",
      text: "Product ID:",
      input: "text",
      inputValue: "",
      inputAutoTrim: true,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Search",
      confirmButtonColor: "green",
      cancelButtonText: "Cancel"
    }).then(response => {
      if (response.isConfirmed) {
        var productid = Number(response.value);
        this.showProgress = true;
       
        setTimeout(() => {
          this._ReviewService.filterByProduct(productid).then(response => {
            if (response.length > 0)
            {
              response.forEach(review => {
                this._UserService.findUser(review.userId).then(response => {
                  review.displayname = response.firstname + " " + response.lastname;
                }, reject => Promise.reject(reject));
                this._ProductService.findProduct(review.productId).then(response => {
                  review.productname = response.title;
                }, reject => Promise.reject(reject));
              });

              this.paginator.pageSize = 10;
              this.listedReviews.data = response;
              this.listedReviews.sort = this.sort;
              this.listedReviews.paginator = this.paginator;
            }
            else {
              Swal.fire({
                title: "Error",
                text: "Product ID " + productid + " is invalid or the Product hasn't received any reviews yet.",
                icon: "error",
                showCancelButton: false,
                confirmButtonText: "OK"
              });
              this.showProgress = false;
            }
          }, reject => {
            Swal.fire({
              title: "Error",
              text: "Error finding a Review. Please check if Spring REST service is running.",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "OK"
            });
          });
          this.showProgress = false;
        }, 750);
      }
    });
  }

  listReviews() {
    this._ReviewService.listReviews().then(response => {
      response.forEach(review => {
        console.log(review['user_id']);
        this._UserService.findUser(review['user_id']).then(response => {
          review.displayname = response['firstname'] + " " + response['lastname'];
        }, reject => Promise.reject(reject));
        this._ProductService.findProduct(review['product_id']).then(response => {
          review.productname = response['title'];
        }, reject => Promise.reject(reject));
      });
      
      this.showProgress = true;
      setTimeout(() => {
        this.paginator.pageSize = 10;
        this.listedReviews.data = response;
        this.listedReviews.sort = this.sort;
        this.listedReviews.paginator = this.paginator;

        if (this.listedReviews.data.length === 0) {
          Swal.fire({
            title: "Error",
            text: "No reviews were found in the database.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK"
          });
          return;
        }
        this.showProgress = false;
      }, 2000);
    }, reject => {
      Swal.fire({
        title: "Error",
        text: "Error loading product reviews. Please check if Spring REST service is running.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK"
      });
    });
  }

}
