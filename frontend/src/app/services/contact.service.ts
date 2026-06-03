import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Contact, ContactPayload, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  getContacts(search?: string): Observable<ApiResponse<Contact[]>> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<ApiResponse<Contact[]>>(this.apiUrl, { params });
  }

  getContactById(id: string): Observable<ApiResponse<Contact>> {
    return this.http.get<ApiResponse<Contact>>(`${this.apiUrl}/${id}`);
  }

  createContact(payload: ContactPayload): Observable<ApiResponse<Contact>> {
    return this.http.post<ApiResponse<Contact>>(this.apiUrl, payload);
  }

  updateContact(id: string, payload: Partial<ContactPayload>): Observable<ApiResponse<Contact>> {
    return this.http.put<ApiResponse<Contact>>(`${this.apiUrl}/${id}`, payload);
  }

  deleteContact(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
