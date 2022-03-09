import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class AdminUsersComponent implements OnInit {

  listedAccounts = new MatTableDataSource<User>();
  displayedColumns: Array<string> = ["firstname","lastname","email","password","phone","city","postcode","address1","actions"];
  pageSizeOptions: number[] = [10, 20, 50, 100];
  showProgress: boolean = false;
  isEditingField: boolean;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _UserService: UserService) { }

  ngOnInit(): void { }

  createNewUser(form: NgForm): void {
    var newUser: User = new User();
    newUser.firstname = form.controls["firstname"] === null ? "" : form.controls["firstname"].value;
    newUser.lastname = form.controls["lastname"] === null ? "" : form.controls["lastname"].value;
    newUser.email = form.controls["email"] === null ? "" : form.controls["email"].value;
    newUser.password = form.controls["pass1"] === null ? "" : form.controls["pass1"].value;
    newUser.phone = form.controls["phone"] === null ? "" : form.controls["phone"].value;
    newUser.city = form.controls["city"] === null ? "" : form.controls["city"].value;
    newUser.postcode = form.controls["postcode"] === null ? "" : form.controls["postcode"].value;
    newUser.address1 = form.controls["address1"] === null ? "" : form.controls["address1"].value;

    this._UserService.createNewUser(newUser).then(response => {
      Swal.fire({
        title: "Success",
        text: "A new user account has been successfully created.",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "OK"
      }).then(() => window.location.reload());
    }, reject => {
      Swal.fire({
        title: "Error",
        text: "Error creating a new user account. Please check if Spring REST service is running.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK"
      });
    });
  }

  checkPasswords(pass1: NgModel, pass2: NgModel) : void {
    if (pass1.value !== pass2.value) {
      pass2.control.setErrors( { "notSame": true } );
    }
    else {
      pass2.control.setErrors(null);
    }
  }

  checkFormValidity(form: NgForm): boolean {
    var isFormValid: boolean = true;

    Object.keys(form.controls).forEach(id => {
      if(form.controls[id].hasError('required') || form.controls[id].hasError('pattern')) isFormValid = false;
    });
    return isFormValid && !form.controls["pass1"]?.hasError("minlength") && !form.controls["pass2"]?.hasError("matched");
  }


  editUser(user: User): void {

    this.showProgress = true;

    user.firstname = (user.firstnameEdit === undefined)? user.firstname : user.firstnameEdit;
    user.lastname = (user.lastnameEdit === undefined)? user.lastname : user.lastnameEdit;
    user.email = (user.emailEdit === undefined)? user.email : user.emailEdit;
    user.password = (user.passwordEdit === undefined || user.passwordEdit.length < 8)? user.password : user.passwordEdit;
    user.phone = (user.phoneEdit === undefined)? user.phone : user.phoneEdit;
    user.city = (user.cityEdit === undefined)? user.city : user.cityEdit;
    user.postcode = (user.postcodeEdit === undefined)? user.postcode : user.postcodeEdit;
    user.address1 = (user.address1Edit === undefined)? user.address1 : user.address1Edit;

    delete user.firstnameEdit;
    delete user.lastnameEdit;
    delete user.emailEdit;
    delete user.passwordEdit;
    delete user.phoneEdit;
    delete user.cityEdit;
    delete user.postcodeEdit;
    delete user.address1Edit;


    this._UserService.updateUser(user.id, user).then(response => {

      this.showProgress = false;
      
      if (response !== null) {
        Swal.fire({
          title: "Success",
          text: "User ID "+user.id+" has been successfully edited.",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK"
        }).then(() => this.listAll());
      }
    }, reject => {
      Swal.fire({
        title: "Error",
        text: "Error editing user. Please check if Spring REST service is running.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK"
      });

    });
  }

  deleteUser(id: number, displayName: string): void {

    Swal.fire({
      title: "Deleting user #" + id,
      text: "Please confirm that you wish to delete the user "+displayName,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "green",
      cancelButtonText: "No"
    }).then(choice => {
      if (choice.isConfirmed) {
        this.showProgress = true;

        this._UserService.deleteUser(id).then(() => {
          Swal.fire({
            title: "User "+displayName + "(#"+id+") has been successfully deleted from the database.",
            text: "All the reviews posted by this user have been deleted.",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "OK"
          }).then(() => {
            this.listAll();
          });
        }, reject => {
          Swal.fire({
            title: "Error",
            text: "Error deleting user. Please check if Spring REST service is running.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "OK"
          });
        });
      }
    });    

    this.showProgress = false;
  }

  find(): void {
    Swal.fire({
      title: "User Search",
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
          this._UserService.findUser(userid).then(response => {
            if (response != null) {
              console.log(response);
              this.listedAccounts.data = [response];
              this.showProgress = false;
            }
            else {
              Swal.fire({
                title: "Error",
                text: "User ID " + userid + " not found",
                icon: "error",
                showCancelButton: false,
                confirmButtonText: "OK"
              });
              this.showProgress = false;
            }
          }, reject => {
            Swal.fire({
              title: "Error",
              text: "Error finding a User. Please check if Spring REST service is running.",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "OK"
            });
            this.showProgress = false;
          });
        }, 1000);
      }
    });
  }

  listAll(): void {
    this.showProgress = true;

    this._UserService.listUsers().then(response => {

      this.paginator.pageSize = 10;

      this.listedAccounts.data = response;
      this.listedAccounts.sort = this.sort;
      this.listedAccounts.paginator = this.paginator;

      this.showProgress = false;

      if (this.listedAccounts.data.length === 0) {
        Swal.fire({
          title: "Users table is empty.",
          icon: "info",
          showCancelButton: false,
          confirmButtonText: "OK"
        });
        return;
      }
    }, reject => {
      Swal.fire({
        title: "Error",
        text: "Error loading data. Please check if Spring REST service is running.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK"
      });
    });
  }
}