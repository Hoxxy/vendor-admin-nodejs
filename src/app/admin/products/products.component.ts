import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from 'src/app/model/category';
import { Product } from 'src/app/model/product';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class AdminProductsComponent implements OnInit {
  
  listedProducts = new MatTableDataSource<Product>();
  categories = new MatTableDataSource<Category>();
  productCategories: Map<number, string> = new Map<number, string>();
  newCategoryName: string = "";
  pageSizeOptions: number[] = [10, 20, 50, 100];
  displayedColumnsProducts = ["productTitle", "categoryTitle", "stock", "price", "actions"];
  displayedColumnsCategories = ["categoryName", "actions"];
  showProgress: boolean = false;
  isEditingField: boolean;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sortProduct: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorProduct: MatPaginator;

  constructor(
    private _ProductService: ProductService, 
    private _CategoryService: CategoryService
    // private orderProductService: OrderProductService,
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  checkRequiredFields(form: NgForm): boolean {
    var valid: boolean = true;
    Object.keys(form.controls).forEach(id => {
      if (form.controls[id].hasError('required')) valid = false;
    });
    return valid;
  }

  loadCategories(): void {
    this._CategoryService.listCategories().then(response => {
      this.categories.data = response;
      this.categories.data.forEach(category => {
        this.productCategories.set(category.id, category.title);
        console.log(`category: ${category.title}`)
      });
    });
  }

  listAll(): void {
    this._ProductService.count().then(response => {

      var msg: string = "";
      if (response['count'].length === 0) msg = "Products table is empty";
      else msg = "A total of " + response['count'] + " products were found.";

      Swal.fire({
        title: msg,
        icon: "info",
        confirmButtonText: "OK",
        showCancelButton: false
      }).then(() => {
        this.showProgress = true;
        
        
        setTimeout(() => { 
          this._ProductService.listProducts().then(response => {
          
          this.paginator.pageSize = 10;
          this.listedProducts.data = response;
          this.listedProducts.sort = this.sortProduct;
          this.listedProducts.paginator = this.paginatorProduct;
          }, reject => {
            Swal.fire({
              title: "Error",
              text: "Error loading products. Please check if Spring REST service is running.",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "OK"
            });
          });

          
          this.showProgress = false;
        }, 750);
        
      });
    }, reject => {
      Swal.fire({
        title: "Error",
        text: "Error counting products. Please check if Spring REST service is running.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK"
      });
    });

    this.showProgress = false;
  }

  createNewProduct(form: NgForm) {
    
    var newProduct: Product = new Product();

    newProduct.title = form.controls["addProductTitle"].value;
    newProduct.category = { "id": form.controls["addProductCategory"].value["key"], "title": form.controls["addProductCategory"].value["value"] }
    newProduct.price = form.controls["addProductPrice"].value;
    newProduct.stock = form.controls["addProductStock"].value;
    newProduct.description = form.controls["addProductDesc"].value;


    this.showProgress = true;
    setTimeout(() => {
      this._ProductService.createNewProduct(newProduct).then(response => {
        Swal.fire({
          title: "Success",
          text: "New product has been created successfully.",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK"
        }).then(() => window.location.reload());
      }, reject => {
        Swal.fire({
          title: "Error",
          text: "Error creating new product. Please check if Spring REST service is running.",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "OK"
        });
      });
      this.showProgress = false;
    }, 750);
  }

  editProduct(product: Product): void {

    if (product.stockEdit < 0) product.stockEdit = product.stock;
    else product.stock = product.stockEdit;

    if (product.priceEdit < 0) product.priceEdit = product.price;
    else product.price = product.priceEdit;

    product.title = (product.titleEdit === undefined)? product.title : product.titleEdit;
    product.category = (product.categoryEdit === undefined)? product.category : product.categoryEdit;
    product.description = (product.descriptionEdit === undefined)? product.description : product.descriptionEdit;

    delete product.titleEdit;
    delete product.stockEdit;
    delete product.priceEdit;
    delete product.categoryEdit;
    delete product.descriptionEdit;

    this.showProgress = true;
    setTimeout(() => { 
      this._ProductService.updateProduct(product.id, product).then(() => {
        Swal.fire({
          title: "Success",
          text: "Product ID "+product.id+" has been successfully edited.",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK"
        }).then(() => {
            this.listAll();    
          })
      }, reject => {
        Swal.fire({
          title: "Error",
          text: "Error editing product. Please check if Spring REST service is running.",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "OK"
        });
      });
      this.showProgress = false;
    }, 750);
  }

  deleteProduct(productId: number): void {

    this.showProgress = true;
    setTimeout(() => {
      Swal.fire({
        title: "Delete Product",
        text: "Please confirm that you wish to delete this product",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "green",
        cancelButtonText: "No"
      }).then(choice => {
        if (choice.isConfirmed) {
          this._ProductService.deleteProduct(productId).then(() => {
            Swal.fire({
              title: "Success",
              text: "Product has been successfully deleted.",
              icon: "success",
              showCancelButton: false,
              confirmButtonText: "OK"
            }).then(() => {
                window.location.reload();
              })
          }, reject => {
            Swal.fire({
              title: "Error",
              text: "Error deleting product. Please check if Spring REST service is running.",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "OK"
            });
          });
        }
      });

      this.showProgress = false;
    }, 750);
  }

  showProductDescription(product: Product): void {
    Swal.fire({
      title: "Showing product description",
      input: "textarea",
      inputValue: product.description,
      inputAutoTrim: true,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Update",
      allowOutsideClick: false,
      preConfirm: descriptionEdit => {
        if ((descriptionEdit as string).length > 1000)
          Swal.showValidationMessage("Maximum allowed length is 1000 characters. You have entered " + descriptionEdit.length + " characters.");
        else return descriptionEdit as string;
      }
    }).then(response => {

      if (response.isConfirmed) {
        this.showProgress = true;

        if (!product.description.includes(response.value, 0)) { 
          product.description = response.value;

          this._ProductService.updateProduct(product.id, product).then(() => {
            Swal.fire({
              title: "Success!",
              text: "Product description has been successfully updated.",
              icon: "success",
              showCancelButton: false,
              confirmButtonText: "OK"
            });
            this.showProgress = false;
          }, reject => {
            Swal.fire({
              title: "Error",
              text: "Error updating data. Please check if Spring REST service is running.",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "OK"
            });
            this.showProgress = false;
          });
        }
      }
      else this.showProgress = false;
      
    });
  }

  findProduct(): void {
    Swal.fire({
      title: "Product Search",
      text: "Product ID:",
      input: "text",
      inputValue: "",
      inputAutoTrim: true,
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Search",
      allowOutsideClick: false,
    }).then(response => {
      if (response.isConfirmed) {
        this.showProgress = true;
        var productId: number = Number(response.value);

        setTimeout(() => {
          this._ProductService.findProduct(productId).then(response => {
            if (response != null) {
              this.listedProducts.data = [response];
            }
            else {
              Swal.fire({
                title: "Error",
                text: "Product ID " + productId + " not found",
                icon: "error",
                showCancelButton: false,
                confirmButtonText: "OK"
              });
            }
          }, reject => {
            Swal.fire({
              title: "Error",
              text: "Error finding a product. Please check if Spring REST service is running.",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "OK"
            });
          });
          this.showProgress = false;
        }, 1000);
      }
    });
  }

  createNewCategory(): void {
    Swal.fire({
      title: "Enter Category Title",
      input: "text",
      inputValue: "",
      inputAutoTrim: true,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Create",
      allowOutsideClick: false,
      preConfirm: categoryTitle => {
        if ((categoryTitle as string).length > 30)
          Swal.showValidationMessage("Maximum allowed length is 30 characters. You have entered " + categoryTitle.length + " characters.");
        else return categoryTitle as string;
      }
    }).then(response => {

      if (response.isConfirmed) {
        this.showProgress = true;

        this._CategoryService.createNewCategory({ title: response.value }).then(response => {
          this.showProgress = false;
          Swal.fire({
            title: "Success",
            text: "New category has been created successfully.",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK"
          }).then(() => this.loadCategories());
        }, reject => {
          this.showProgress = false;
          Swal.fire({
            title: "Error",
            text: "Error creating new category. Please check if Spring REST service is running.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK"
          });
        });
      }
      else this.showProgress = false;
    });

  }

  editCategory(category: Category): void {
    this.showProgress = true;
    
    setTimeout(() => {
      this._CategoryService.updateCategory(category.id, category).then(response => {
        if (response === null) return;
        Swal.fire({
          title: "Success",
          text: "Category has been edited successfully.",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK"
        });
      }, reject => {
        Swal.fire({
          title: "Error",
          text: "Error editing category. Please check if Spring REST service is running.",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "OK"
        });
      })
      this.showProgress = false;
    }, 600);
  }

  deleteCategory(categoryId: number, categoryName: string): void {
    
    Swal.fire({
      title: "Delete Category",
      text: "Please confirm that you wish to delete this category: "+ categoryName+"\r\nCAUTION: This will delete all products that belong to this category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "green",
      cancelButtonText: "No"
    }).then(choice => {
      if (choice.isConfirmed) {
        this.showProgress = true;

        this._ProductService.getProductsInCategory(categoryId).then(response => {
          response.forEach(product => {
            this._ProductService.deleteProduct(product.id);
          });
        });
      }
  
      setTimeout(() => {
        this._CategoryService.deleteCategory(categoryId).then(() => {
          Swal.fire({
            title: "Success",
            text: "Category and all its products have been successfully deleted.",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK"
          }).then(() => window.location.reload());
        }, reject => {
          Swal.fire({
            title: "Error",
            text: "Error deleting category. Please check if Spring REST service is running.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK"
          });
        });
        this.showProgress = false;
      }, 1000);
    });
  }
}
