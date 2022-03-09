
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private _HttpClient: HttpClient) {}

  public createNewUser(user: User): Promise<User> {
    return this._HttpClient.post<User>
      ("http://localhost:1313/vendor/user/insert", JSON.stringify(user), {headers: this.headers}).toPromise();
  }

  public listUsers(): Promise<Array<User>> {
    return this._HttpClient.get<Array<User>>
      ("http://localhost:1313/vendor/user/list").toPromise();
  }

  public deleteUser(id: number): Promise<any> {
    return this._HttpClient.delete<any>
        ("http://localhost:1313/vendor/user/delete/" + id).toPromise();
  }

  public updateUser(userid: number, newData: User): Promise<User> {
    
    return this._HttpClient.patch<User>
      ("http://localhost:1313/vendor/user/update/" + userid, JSON.stringify(newData), {headers: this.headers}).toPromise();
  }

  public findUser(userid: number): Promise<User> {
    return this._HttpClient.get<User>
      ("http://localhost:1313/vendor/user/find/" + userid).toPromise();
  }

}
