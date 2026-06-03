import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lead, LeadPayload, LeadsResponse, Activity, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private apiUrl = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) {}

  getLeads(filters?: {
    status?: string;
    source?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<LeadsResponse>> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.source) params = params.set('source', filters.source);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());
    return this.http.get<ApiResponse<LeadsResponse>>(this.apiUrl, { params });
  }

  getLeadById(id: string): Observable<ApiResponse<Lead>> {
    return this.http.get<ApiResponse<Lead>>(`${this.apiUrl}/${id}`);
  }

  createLead(payload: LeadPayload): Observable<ApiResponse<Lead>> {
    return this.http.post<ApiResponse<Lead>>(this.apiUrl, payload);
  }

  updateLead(id: string, payload: Partial<LeadPayload>): Observable<ApiResponse<Lead>> {
    return this.http.put<ApiResponse<Lead>>(`${this.apiUrl}/${id}`, payload);
  }

  deleteLead(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: string): Observable<ApiResponse<Lead>> {
    return this.http.patch<ApiResponse<Lead>>(`${this.apiUrl}/${id}/status`, { status });
  }

  addActivity(id: string, activity: Partial<Activity>): Observable<ApiResponse<Lead>> {
    return this.http.post<ApiResponse<Lead>>(`${this.apiUrl}/${id}/activities`, activity);
  }
}
