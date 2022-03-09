import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from 'src/app/model/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private _HttpClient: HttpClient) { }

  public listReviews(): Promise<Array<Review>> {
    return this._HttpClient.get<Array<Review>>
      ("http://localhost:1313/vendor/review/list").toPromise();
  }

  public filterByUser(userid: number): Promise<Array<Review>> {
    return this._HttpClient.get<Array<Review>>
    ("http://localhost:1313/vendor/review/filterByUser/" + userid).toPromise();
  }

  public filterByProduct(productid: number): Promise<Array<Review>> {
    return this._HttpClient.get<Array<Review>>
    ("http://localhost:1313/vendor/review/filterByProduct/" + productid).toPromise();
  }
}
