import { inject, Injectable, signal, Signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  currentUser = signal<User | null>(null);

  login(model: any) {
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'login', model, {
      params,
    });
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model);
  }

  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'account/user-info');
  }

  loadUserInfo() {
    return this.getUserInfo().subscribe({
      next: (user) => this.currentUser.set(user),
      error: (error) => console.error('Failed to load user info:', error),
    });
  }

  logout() {
    return this.http.post(this.baseUrl + 'account/logout', {});
  }

  updateAddress(address: Address) {
    return this.http.post(this.baseUrl + 'account/address', address);
  }
}
