import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'src/app/model/order';
import { OrderProduct } from 'src/app/model/orderproduct';
import { Product } from 'src/app/model/product';

@Injectable({
  providedIn: 'root'
})
export class OrderProductService {
    
    private headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(public _HttpClient: HttpClient) { }

    public insert(orderProduct: OrderProduct): Promise<OrderProduct> {
      return this._HttpClient.post<OrderProduct>
        ("http://localhost:1313/vendor/order_product/insert", JSON.stringify(orderProduct), {headers: this.headers}).toPromise();
    }

    public listAllByOrder(order_id: number): Promise<Array<OrderProduct>> {
        return this._HttpClient.get<Array<OrderProduct>>
        ("http://localhost:1313/vendor/order_product/listByOrder/" + order_id).toPromise();
    }

    public deleteByOrder(order_id: number): Promise<any> {
        return this._HttpClient.delete<any>
        ("http://localhost:1313/vendor/order_product/deleteByOrder/" + order_id).toPromise();
    }
    public deleteById(order_id: number, product_id: number): Promise<any> {
        return this._HttpClient.delete<any>
        ("http://localhost:1313/vendor/order_product/delete/" + order_id + "/" + product_id).toPromise();
    }
}
