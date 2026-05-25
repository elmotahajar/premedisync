import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'inscription', loadComponent: () => import('./features/auth/inscription/inscription').then(m => m.Inscription) },

  // PAGE D'ACCUEIL (choix espace)
  { path: 'home', canActivate: [authGuard], loadComponent: () => import('./features/home/home').then(m => m.Home) },

  // ESPACE ADMIN
  { 
    path: 'admin', 
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', loadComponent: () => import('./features/admin/dashboard/accueil').then(m => m.DashboardComponent) },
      { path: 'patients', loadComponent: () => import('./features/admin/patients-crud/patients-crud').then(m => m.PatientsCrudComponent) },
      { path: 'doctors', redirectTo: 'medecins', pathMatch: 'full' },
      { path: 'medecins', loadComponent: () => import('./features/admin/medecins/medecins').then(m => m.Medecins) },
      { path: 'secretaries', redirectTo: 'secretaires', pathMatch: 'full' },
      { path: 'secretaires', loadComponent: () => import('./features/admin/secretaires/secretaires').then(m => m.Secretaires) },
      { path: 'appointments', loadComponent: () => import('./features/admin/rdv-crud/rdv-crud').then(m => m.RdvCrudComponent) },
      { path: 'rdv', loadComponent: () => import('./features/admin/rdv-crud/rdv-crud').then(m => m.RdvCrudComponent) },
      { path: 'salles', loadComponent: () => import('./features/admin/salles/salles').then(m => m.Salles) },
      { path: 'etablissement', loadComponent: () => import('./features/admin/etablissement/etablissement').then(m => m.Etablissement) },
      { path: 'billing', loadComponent: () => import('./features/admin/facturation/facturation').then(m => m.Facturation) },
      { path: 'facturation', loadComponent: () => import('./features/admin/facturation/facturation').then(m => m.Facturation) },
      { path: 'logs', loadComponent: () => import('./features/admin/audit-logs/audit-logs').then(m => m.AuditLogs) },
      { path: 'audit-logs', loadComponent: () => import('./features/admin/audit-logs/audit-logs').then(m => m.AuditLogs) },
      { path: 'settings', loadComponent: () => import('./features/admin/settings/settings').then(m => m.SettingsComponent) },
      { path: 'dashboard', redirectTo: 'accueil', pathMatch: 'full' }
    ]
  },

  // ESPACE MEDECIN
  {
    path: 'medecin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/medecin/medecin-layout/medecin-layout').then(m => m.MedecinLayoutComponent),
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', loadComponent: () => import('./features/medecin/accueil/medecin-accueil').then(m => m.MedecinAccueilComponent) },
      { path: 'planning', loadComponent: () => import('./features/medecin/planning-medecin/planning-medecin').then(m => m.PlanningMedecin) },
      { path: 'patients', loadComponent: () => import('./features/medecin/patients/patients').then(m => m.MedecinPatientsComponent) },
      { path: 'consultations', loadComponent: () => import('./features/medecin/consultations/consultations').then(m => m.MedecinConsultationsComponent) },
      { path: 'prescriptions', loadComponent: () => import('./features/medecin/prescription-medecin/prescription-medecin').then(m => m.PrescriptionMedecin) },
      { path: 'prescription', redirectTo: 'prescriptions', pathMatch: 'full' },
      { path: 'disponibilites', loadComponent: () => import('./features/medecin/disponibilites-medecin/disponibilites-medecin').then(m => m.DisponibilitesMedecin) },
      { path: 'consultation/:id', loadComponent: () => import('./features/medecin/consultation-patient/consultation-patient').then(m => m.ConsultationPatient) },
      { path: 'parametres', loadComponent: () => import('./features/medecin/parametres/parametres').then(m => m.MedecinParametresComponent) },
      { path: 'dashboard', redirectTo: 'accueil', pathMatch: 'full' }
    ]
  },
  { path: 'medecin/dashboard', redirectTo: 'medecin/accueil', pathMatch: 'full' },
  { path: 'medecin/planning', redirectTo: 'medecin/planning', pathMatch: 'full' },

  // ESPACE SECRETAIRE
  {
    path: 'secretaire',
    canActivate: [authGuard],
    loadComponent: () => import('./features/secretaire/secretaire-layout/secretaire-layout').then(m => m.SecretaireLayoutComponent),
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', loadComponent: () => import('./features/secretaire/accueil/secretaire-accueil').then(m => m.SecretaireAccueilComponent) },
      { path: 'rendezvous', loadComponent: () => import('./features/secretaire/gestion-rdv/gestion-rdv').then(m => m.RendezVous) },
      { path: 'patients', loadComponent: () => import('./features/secretaire/creation-patient/creation-patient').then(m => m.CreationPatient) },
      { path: 'facturation', loadComponent: () => import('./features/secretaire/facturation/facturation').then(m => m.Facturation) },
      { path: 'feuille-soins', loadComponent: () => import('./features/secretaire/feuille-soins/feuille-soins').then(m => m.FeuilleSOins) },
      { path: 'parametres', loadComponent: () => import('./features/secretaire/parametres/parametres').then(m => m.SecretaireParametresComponent) },
      { path: 'dashboard', redirectTo: 'accueil', pathMatch: 'full' }
    ]
  },
  { path: 'secretaire/dashboard', redirectTo: 'secretaire/accueil', pathMatch: 'full' },

  // ESPACE PATIENT
  {
    path: 'patient',
    canActivate: [authGuard],
    loadComponent: () => import('./features/patient/patient-layout/patient-layout').then(m => m.PatientLayoutComponent),
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path: 'accueil', loadComponent: () => import('./features/patient/accueil/patient-accueil').then(m => m.PatientAccueilComponent) },
      { path: 'rendezvous', loadComponent: () => import('./features/rdv/mes-rdv/mes-rdv').then(m => m.MesRdv) },
      { path: 'recherche-medecin', loadComponent: () => import('./features/rdv/recherche-medecin/recherche-medecin').then(m => m.RechercheMedecin) },
      { path: 'dossier', loadComponent: () => import('./features/dossier/historique/historique').then(m => m.Historique) },
      { path: 'dossier/:id', loadComponent: () => import('./features/dossier/detail/detail').then(m => m.Detail) },
      { path: 'ordonnances', loadComponent: () => import('./features/ordonnances/liste/liste').then(m => m.Liste) },
      { path: 'avis', loadComponent: () => import('./features/patient/signalement/signalement').then(m => m.Signalement) },
      { path: 'parametres', loadComponent: () => import('./features/patient/profil/profil').then(m => m.Profil) },
      { path: 'dashboard', redirectTo: 'accueil', pathMatch: 'full' }
    ]
  },
  { path: 'patient/dashboard', redirectTo: 'patient/accueil', pathMatch: 'full' },
  { path: 'rdv', redirectTo: 'patient/recherche-medecin', pathMatch: 'full' },
  { path: 'rdv/confirmation', canActivate: [authGuard], loadComponent: () => import('./features/rdv/confirmation/confirmation').then(m => m.Confirmation) },
  { path: 'dossier', redirectTo: 'patient/dossier', pathMatch: 'full' },
  { path: 'dossier/:id', redirectTo: 'patient/dossier/:id', pathMatch: 'full' },
  { path: 'ordonnances', redirectTo: 'patient/ordonnances', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];