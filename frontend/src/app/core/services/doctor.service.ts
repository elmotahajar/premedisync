import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/admin/personnel';

  getAll(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        const personnel = Array.isArray(response) ? response : response?.personnel || [];
        return personnel
          .filter((person: any) => person.role === 'medecin')
          .map((person: any) => ({
            id: person.id,
            firstName: person.prenom || person.firstName || '',
            lastName: person.nom || person.lastName || '',
            specialty: person.specialite || person.specialty || ''
          }));
      })
    );
  }
}
