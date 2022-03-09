import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RoutingModule } from './routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuantityControlComponent } from './components/quantity-control/quantity.component';
import { StarRatingModule } from 'angular-star-rating';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './shared/services/product.service';
import { CategoryService } from './shared/services/category.service';
import { UserService } from './shared/services/user.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AdminUsersComponent } from './admin/users/users.component';
import { AdminProductsComponent } from './admin/products/products.component';
import { AdminReviewsComponent } from './admin/reviews/reviews.component';
import { AdminOrdersComponent } from './admin/orders/orders.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductComponent } from './pages/product/product.component';
import { OrderProductService } from './shared/services/orderproduct.service';
import { OrderService } from './shared/services/order.service';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    QuantityControlComponent,
    AdminUsersComponent,
    AdminProductsComponent,
    AdminReviewsComponent,
    AdminOrdersComponent,
    ShopComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StarRatingModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    SweetAlert2Module.forRoot()
  ],
  exports: [
    QuantityControlComponent
  ],
  providers: [ProductService, CategoryService, UserService, OrderService, OrderProductService],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
