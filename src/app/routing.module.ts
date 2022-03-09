import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminOrdersComponent } from "./admin/orders/orders.component";
import { AdminProductsComponent } from "./admin/products/products.component";
import { AdminReviewsComponent } from "./admin/reviews/reviews.component";
import { AdminUsersComponent } from "./admin/users/users.component";
import { ProductComponent } from "./pages/product/product.component";
import { ShopComponent } from "./pages/shop/shop.component";

const routes: Routes = [
    { path: 'shop', component: ShopComponent },
    { path: 'product/:id', component: ProductComponent },
    { path: 'admin/users', component: AdminUsersComponent },
    { path: 'admin/products', component: AdminProductsComponent },
    { path: 'admin/reviews', component: AdminReviewsComponent },
    { path: 'admin/orders', component: AdminOrdersComponent }
];

@NgModule ({
    imports: [ RouterModule.forRoot(routes) ],

    exports: [ RouterModule ]
})

export class RoutingModule {}