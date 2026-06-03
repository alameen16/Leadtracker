import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Deal, DealPayload, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class DealService {
  private apiUrl = `${environment.apiUrl}/deals`;

  constructor(private http: HttpClient) {}

  getDeals(stage?: string): Observable<ApiResponse<Deal[]>> {
    let params = new HttpParams();
    if (stage) params = params.set('stage', stage);
    return this.http.get<ApiResponse<Deal[]>>(this.apiUrl, { params });
  }

  getDealById(id: string): Observable<ApiResponse<Deal>> {
    return this.http.get<ApiResponse<Deal>>(`${this.apiUrl}/${id}`);
  }

  createDeal(payload: DealPayload): Observable<ApiResponse<Deal>> {
    return this.http.post<ApiResponse<Deal>>(this.apiUrl, payload);
  }

  updateDeal(id: string, payload: Partial<DealPayload>): Observable<ApiResponse<Deal>> {
    return this.http.put<ApiResponse<Deal>>(`${this.apiUrl}/${id}`, payload);
  }

  deleteDeal(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
