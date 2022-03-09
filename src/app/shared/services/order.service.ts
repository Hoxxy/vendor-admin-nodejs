import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'src/app/model/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(public _HttpClient: HttpClient) { }

  public listOrders(): Promise<Array<Order>> {
      return this._HttpClient.get<Array<Order>>
        ("http://localhost:1313/vendor/order/list").toPromise();
  }

  public createNewOrder(order: Order): Promise<Order> {
      return this._HttpClient.post<Order>
        ("http://localhost:1313/vendor/order/insert", order).toPromise();
  }

  public deleteOrder(order_id: number): Promise<any> {
      return this._HttpClient.delete<any>
        ("http://localhost:1313/vendor/order/delete/" + order_id).toPromise();
  }
}
