import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  socialSecurityNumber?: string;
  status: 'actif' | 'inactif';
  createdAt: string;
}

@Component({
  selector: 'app-patients-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patients-crud.html',
  styleUrls: ['./patients-crud.css']
})
export class PatientsCrudComponent implements OnInit {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);

  patients = signal<Patient[]>([
    { id: 1, firstName: 'Jean', lastName: 'Dupont', email: 'jean@example.com', phone: '0612345678', dateOfBirth: '1980-01-15', gender: 'M', address: '12 Rue A', socialSecurityNumber: '1234567890123', status: 'actif', createdAt: '2026-05-01' },
    { id: 2, firstName: 'Marie', lastName: 'Bernard', email: 'marie@example.com', phone: '0622334455', dateOfBirth: '1990-04-22', gender: 'F', address: '55 Avenue B', socialSecurityNumber: '2234567890123', status: 'inactif', createdAt: '2026-04-19' }
  ]);

  search = signal('');
  statusFilter = signal<'tous' | 'actif' | 'inactif'>('tous');
  dateFilter = signal('');
  toast = signal('');
  loading = signal(false);
  showModal = signal(false);
  viewMode = signal(false);
  editId: number | null = null;
  page = signal(1);
  pageSize = 10;
  selected = signal<number[]>([]);

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    dateOfBirth: ['', Validators.required],
    gender: ['M', Validators.required],
    address: [''],
    socialSecurityNumber: [''],
    status: ['actif', Validators.required],
    password: ['']
  });

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading.set(true);
    this.patientService.getAll().subscribe({
      next: (data: any) => {
        const items = Array.isArray(data) ? data : data?.items || data?.patients;
        if (Array.isArray(items) && items.length) {
          this.patients.set(items);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filteredPatients(): Patient[] {
    let items = this.patients();
    const search = this.search().toLowerCase();
    if (search) {
      items = items.filter(patient =>
        `${patient.firstName} ${patient.lastName} ${patient.email} ${patient.phone}`.toLowerCase().includes(search)
      );
    }
    if (this.statusFilter() !== 'tous') {
      items = items.filter(patient => patient.status === this.statusFilter());
    }
    if (this.dateFilter()) {
      items = items.filter(patient => patient.createdAt >= this.dateFilter());
    }
    return items;
  }

  paginatedPatients(): Patient[] {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredPatients().slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredPatients().length / this.pageSize));
  }

  openCreate(): void {
    this.editId = null;
    this.viewMode.set(false);
    this.form.reset({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: 'M', address: '', socialSecurityNumber: '', status: 'actif', password: '' });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.form.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  openView(patient: Patient): void {
    this.editId = patient.id;
    this.viewMode.set(true);
    this.form.reset({ ...patient, password: '' });
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  openEdit(patient: Patient): void {
    this.editId = patient.id;
    this.viewMode.set(false);
    this.form.reset({ ...patient, password: '' });
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  save(): void {
    console.log('submit clicked', this.form.value, this.form.valid);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      phone: this.form.value.phone,
      dateOfBirth: this.form.value.dateOfBirth,
      gender: this.form.value.gender,
      address: this.form.value.address,
      socialSecurityNumber: this.form.value.socialSecurityNumber,
      status: this.form.value.status
    };
    this.loading.set(true);

    if (this.editId) {
      this.patientService.update(this.editId, payload).subscribe({
        next: () => {
          this.patients.update(list => list.map(patient => patient.id === this.editId ? { ...patient, ...payload } as Patient : patient));
          this.finishAction('Patient mis à jour');
        },
        error: (error: any) => {
          this.patients.update(list => list.map(patient => patient.id === this.editId ? { ...patient, ...payload } as Patient : patient));
          this.finishAction(error?.error?.message || 'Patient mis à jour localement');
        }
      });
    } else {
      this.patientService.create(payload).subscribe({
        next: (_res: any) => {
          this.loadPatients();
          this.finishAction('Patient ajouté avec succès');
        },
        error: (error: any) => {
          this.finishAction(error?.error?.message || 'Erreur lors de l’ajout du patient');
        }
      });
    }
  }

  deletePatient(patient: Patient): void {
    if (!confirm('Voulez-vous vraiment supprimer ce patient ?')) {
      return;
    }

    this.patientService.delete(patient.id).subscribe({
      next: () => {
        this.patients.update(list => list.filter(item => item.id !== patient.id));
        this.toast.set('Patient supprimé');
        setTimeout(() => this.toast.set(''), 2000);
      },
      error: () => {
        this.patients.update(list => list.filter(item => item.id !== patient.id));
        this.toast.set('Patient supprimé localement');
        setTimeout(() => this.toast.set(''), 2000);
      }
    });
  }

  toggleSelectAll(checked: boolean): void {
    this.selected.set(checked ? this.paginatedPatients().map(patient => patient.id) : []);
  }

  toggleSelected(id: number, checked: boolean): void {
    this.selected.update(values => checked ? [...new Set([...values, id])] : values.filter(value => value !== id));
  }

  bulkDelete(): void {
    if (!this.selected().length) return;
    if (!confirm('Voulez-vous vraiment supprimer les patients sélectionnés ?')) return;
    const ids = new Set(this.selected());
    this.patients.update(list => list.filter(patient => !ids.has(patient.id)));
    this.selected.set([]);
    this.toast.set('Suppression en lot effectuée');
    setTimeout(() => this.toast.set(''), 2000);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  getError(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  prevPage(): void {
    this.page.update(value => Math.max(1, value - 1));
  }

  nextPage(): void {
    this.page.update(value => Math.min(this.totalPages(), value + 1));
  }

  private finishAction(message: string): void {
    this.loading.set(false);
    this.showModal.set(false);
    this.toast.set(message);
    this.form.reset();
    setTimeout(() => this.toast.set(''), 2200);
  }
}
