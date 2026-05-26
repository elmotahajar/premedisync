import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { PatientService } from '../../../core/services/patient.service';
import { DoctorService } from '../../../core/services/doctor.service';

interface Appointment {
  id: number;
  patientId?: number;
  doctorId?: number;
  patientName: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  motif: string;
  duration: number;
  status: 'confirmé' | 'en attente' | 'annulé';
}

@Component({
  selector: 'app-rdv-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rdv-crud.html',
  styleUrls: ['./rdv-crud.css']
})
export class RdvCrudComponent implements OnInit {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);

  appointments = signal<Appointment[]>([
    { id: 1, patientId: 1, doctorId: 1, patientName: 'Jean Dupont', doctorName: 'Dr Martin', date: '2026-05-25', timeSlot: '09:00', motif: 'Consultation', duration: 30, status: 'confirmé' },
    { id: 2, patientId: 2, doctorId: 2, patientName: 'Marie Bernard', doctorName: 'Dr Chen', date: '2026-05-26', timeSlot: '10:30', motif: 'Contrôle', duration: 15, status: 'en attente' }
  ]);

  loading = signal(false);
  toast = signal('');
  showModal = signal(false);
  editId: number | null = null;
  page = signal(1);
  pageSize = 10;
  search = signal('');
  doctorFilter = signal('');
  statusFilter = signal<'tous' | 'confirmé' | 'en attente' | 'annulé'>('tous');
  dateStart = signal('');
  dateEnd = signal('');

  doctors: Array<{ id: number; firstName: string; lastName: string; specialty?: string }> = [];
  patients: Array<{ id: number; firstName: string; lastName: string }> = [];
  slots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];

  form = this.fb.group({
    patientId: ['', Validators.required],
    doctorId: ['', Validators.required],
    date: ['', Validators.required],
    timeSlot: ['', Validators.required],
    motif: ['', Validators.required],
    duration: [30, Validators.required],
    status: ['confirmé', Validators.required]
  });

  ngOnInit(): void {
    this.loadAppointments();
    this.loadPatients();
    this.loadDoctors();
  }

  loadPatients(): void {
    this.patientService.getAll().subscribe({
      next: (data: any) => {
        const items = Array.isArray(data) ? data : data?.items || data?.patients || [];
        this.patients = items.map((item: any) => ({
          id: item.id,
          firstName: item.firstName || item.prenom || '',
          lastName: item.lastName || item.nom || ''
        }));
      }
    });
  }

  loadDoctors(): void {
    this.doctorService.getAll().subscribe({
      next: (items) => {
        this.doctors = items;
      }
    });
  }

  loadAppointments(): void {
    this.loading.set(true);
    this.appointmentService.getAll().subscribe({
      next: (data) => {
        const items = Array.isArray(data) ? data : data?.items || data?.appointments;
        if (Array.isArray(items) && items.length) {
          this.appointments.set(items.map((item: any) => ({
            id: item.id,
            patientId: item.patientId ?? item.id_patient,
            doctorId: item.medecinId ?? item.doctorId,
            patientName: item.patientName || item.patientNom || String(item.patientId ?? item.id_patient ?? ''),
            doctorName: item.doctorName || item.medecinNom || (item.medecinId ?? item.doctorId ? `Dr ${item.medecinId ?? item.doctorId}` : ''),
            date: item.date,
            timeSlot: item.timeSlot ?? item.heure ?? '',
            motif: item.motif,
            duration: item.duration ?? item.duree ?? 30,
            status: item.status ?? item.statut ?? 'confirmé'
          })));
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filteredAppointments(): Appointment[] {
    let items = this.appointments();
    const search = this.search().toLowerCase();
    if (search) {
      items = items.filter(item => `${item.patientName} ${item.doctorName} ${item.motif}`.toLowerCase().includes(search));
    }
    if (this.doctorFilter()) {
      items = items.filter(item => item.doctorName === this.doctorFilter());
    }
    if (this.statusFilter() !== 'tous') {
      items = items.filter(item => item.status === this.statusFilter());
    }
    if (this.dateStart()) {
      items = items.filter(item => item.date >= this.dateStart());
    }
    if (this.dateEnd()) {
      items = items.filter(item => item.date <= this.dateEnd());
    }
    return items;
  }

  paginatedAppointments(): Appointment[] {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredAppointments().slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAppointments().length / this.pageSize));
  }

  openCreate(): void {
    this.editId = null;
    this.form.reset({ patientId: '', doctorId: '', date: '', timeSlot: '', motif: '', duration: 30, status: 'confirmé' });
    this.showModal.set(true);
  }

  openEdit(appointment: Appointment): void {
    this.editId = appointment.id;
    this.form.reset({
      patientId: String(appointment.patientId ?? ''),
      doctorId: String(appointment.doctorId ?? ''),
      date: appointment.date ?? '',
      timeSlot: appointment.timeSlot ?? '',
      motif: appointment.motif ?? '',
      duration: appointment.duration ?? 30,
      status: appointment.status ?? 'confirmé'
    });
    this.showModal.set(true);
  }

  openView(appointment: Appointment): void {
    this.openEdit(appointment);
    this.form.disable();
  }

  closeModal(): void {
    this.form.enable();
    this.showModal.set(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const status = (value.status ?? 'confirmé') as Appointment['status'];
    const payload = {
      patientId: Number(value.patientId),
      medecinId: Number(value.doctorId),
      date: value.date ?? '',
      heure: value.timeSlot ?? '',
      motif: value.motif ?? '',
      duration: Number(value.duration ?? 30),
      statut: status
    };
    const patient = this.patients.find(item => item.id === Number(value.patientId));
    const doctor = this.doctors.find(item => item.id === Number(value.doctorId));
    const localAppointment: Appointment = {
      id: this.editId || Math.max(...this.appointments().map(item => item.id), 0) + 1,
      patientId: Number(value.patientId),
      doctorId: Number(value.doctorId),
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : String(value.patientId),
      doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : String(value.doctorId),
      date: value.date ?? '',
      timeSlot: value.timeSlot ?? '',
      motif: value.motif ?? '',
      duration: Number(value.duration ?? 30),
      status
    };

    if (this.editId) {
      this.appointmentService.update(this.editId, payload).subscribe({
        next: () => this.applyLocalUpdate(localAppointment, 'Rendez-vous mis à jour'),
        error: (error) => this.applyLocalUpdate(localAppointment, error?.error?.message || 'Rendez-vous mis à jour localement')
      });
    } else {
      this.appointmentService.create(payload).subscribe({
        next: (res) => this.applyLocalCreate(res?.id, localAppointment, 'Rendez-vous ajouté avec succès'),
        error: (error) => this.applyLocalCreate(undefined, localAppointment, error?.error?.message || 'Erreur lors de l’ajout du rendez-vous')
      });
    }
  }

  deleteAppointment(appointment: Appointment): void {
    if (!confirm('Voulez-vous vraiment supprimer ce rendez-vous ?')) return;
    this.appointmentService.delete(appointment.id).subscribe({
      next: () => this.removeLocal(appointment.id, 'Rendez-vous supprimé'),
      error: () => this.removeLocal(appointment.id, 'Rendez-vous supprimé localement')
    });
  }

  prevPage(): void {
    this.page.update(value => Math.max(1, value - 1));
  }

  nextPage(): void {
    this.page.update(value => Math.min(this.totalPages(), value + 1));
  }

  private applyLocalUpdate(payload: Appointment, message: string): void {
    this.appointments.update(list => list.map(item => item.id === this.editId ? { ...item, ...payload, id: item.id } : item));
    this.finish(message);
  }

  private applyLocalCreate(id: number | undefined, payload: Appointment, message: string): void {
    this.appointments.update(list => [{ ...payload, id: id || payload.id }, ...list]);
    this.finish(message);
  }

  private removeLocal(id: number, message: string): void {
    this.appointments.update(list => list.filter(item => item.id !== id));
    this.finish(message);
  }

  private finish(message: string): void {
    this.toast.set(message);
    this.showModal.set(false);
    this.form.enable();
    setTimeout(() => this.toast.set(''), 2200);
  }
}
