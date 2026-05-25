import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/admin/invoices';

  getAllInvoices(filters?: any, page?: number): Observable<any> {
    return this.http.get(this.apiUrl, { params: { ...filters, page: page ?? 1 } as any });
  }

  getInvoiceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updatePaymentStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  getFinancialSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }

  generateInvoicePDF(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}
