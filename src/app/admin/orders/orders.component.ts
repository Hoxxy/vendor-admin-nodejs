import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Order } from 'src/app/model/order';
import { Product } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';
import Swal from 'sweetalert2';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrderProductService } from 'src/app/shared/services/orderproduct.service';
import { OrderProduct } from 'src/app/model/orderproduct';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminOrdersComponent implements OnInit {

  showProgress: boolean = false;

  displayedColumns: string[] = ['id', 'displayname', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  expandedElement: Order | null;


  listedOrders = new MatTableDataSource<Order>();
  listedOrderProdructs = new MatTableDataSource<Product>();
  
  // displayedColumns: Array<string> = ["nameSurname", "shippingMethod", "status", "actions"];
  displayedColumnsOP: Array<string> = ["productName", "productCategory", "orderedQuantity", "totalCost"];
  pageSizeOptionsSet: Set<number> = new Set<number>();
  pageSizeOptions: Array<number>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _UserService: UserService, 
    private _ProductService: ProductService,
    private _OrderService: OrderService, 
    private _OrderProductService: OrderProductService
  ) { }

  ngOnInit(): void {
    
  }

  checkFormValidity(form: NgForm): boolean {
    var isFormValid: boolean = true;

    Object.keys(form.controls).forEach(id => {
      if(form.controls[id].hasError('required')) isFormValid = false;
    });
    return isFormValid;
  }

  listOrders(): void {

    this.showProgress = true;
    setTimeout(() => {
      this._OrderService.listOrders().then(response => {
        this.paginator.pageSize = 10;
        this.listedOrders.data = response;
        this.listedOrders.sort = this.sort;
        this.listedOrders.paginator = this.paginator;

        response.forEach(order => {
          console.log(order);
          this._UserService.findUser(order['userid']).then(response => {
            order.displayname = response['firstname'] + " " + response['lastname'];
            order.phone = response['phone'];
            order.city = response['city'];
            order.postcode = response['postcode'];
            order.address1 = response['address1'];

            order.productInfo = [];
            order.productQty = [];
          });

          this._OrderProductService.listAllByOrder(order['id']).then(response => {
            
            response.forEach(orderProduct => {
              this._ProductService.findProduct(orderProduct.product_id).then(response => {
                order.productInfo.push(response);
                order.productQty.push(orderProduct.quantity);
              })
            })            
          })
        })
      })
      this.showProgress = false;
    }, 750);
  }

  createNewOrder(form: NgForm): void {
    var newOrder: Order = new Order();
    newOrder.userid = form.controls["userid"] === null ? "" : form.controls["userid"].value;
    newOrder.date = form.controls["date"] === null ? "" : form.controls["date"].value;
    newOrder.status = form.controls["status"] === null ? "" : form.controls["status"].value;

    this._OrderService.createNewOrder(newOrder).then(response => {
      Swal.fire({
        title: "Success",
        text: "A new order has been successfully created.",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "OK"
      }).then(() => window.location.reload());
    }, reject => {
      Swal.fire({
        title: "Error",
        text: "Error creating a new order. Please check if Spring REST service is running.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK"
      });
    });
  }

  addProductToOrder(order_id: number): void {

    var orderProduct: OrderProduct = new OrderProduct();

    orderProduct.order_id = order_id;

    Swal.fire({
      title: "Product ID",
      input: "number",
      inputAutoTrim: true,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Add"
    }).then(response => {
      if (response.isConfirmed && response.value > 0) {

        orderProduct.product_id = response.value;

        Swal.fire({
          title: "Quantity",
          input: "number",
          inputAutoTrim: true,
          showCancelButton: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Add"
        }).then(response => {
          if (response.isConfirmed && response.value > 0) {
            orderProduct.quantity = response.value;

              this._OrderProductService.insert(orderProduct).then(() => {
                Swal.fire({
                  title: "Success!",
                  text: "Product has been added to this order.",
                  icon: "success",
                  showCancelButton: false,
                  confirmButtonText: "OK"
                }).then(() => window.location.reload());
              }, reject => {
                Swal.fire({
                  title: "Error",
                  text: "Error adding product to order. Please check if Spring REST service is running.",
                  icon: "error",
                  showCancelButton: false,
                  confirmButtonText: "OK"
                });
              });
            }
          })
        }
    });
  }

  deleteOrder(order_id: number): void {
    Swal.fire({
      title: "Confirm Order Delete",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
      confirmButtonColor: "red"
    }).then(choice => {
      if (choice.isConfirmed) {
        this._OrderService.deleteOrder(order_id).then(response => {
          this._OrderProductService.deleteByOrder(order_id).then(response => {
            Swal.fire({
              title: "Success",
              icon: "success",
              text: "Order has been successfully deleted.",
              showCancelButton: false,
              confirmButtonText: "OK"
            }).then(() =>{
              window.location.reload();
            })
          })
        });
      }
    });
  }

  deleteOrderProduct(order_id: number, product_id: number): void {
    Swal.fire({
      title: "Confirm Ordered Product Delete",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
      confirmButtonColor: "red"
    }).then(choice => {
      if (choice.isConfirmed) {
        this._OrderProductService.deleteById(order_id, product_id).then(response => {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Product has been successfully removed from the order.",
            showCancelButton: false,
            confirmButtonText: "OK"
          }).then(() =>{
            window.location.reload();
          })
        });
      }
    });
  }
}