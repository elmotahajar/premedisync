import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'inscription', loadComponent: () => import('./features/auth/inscription/inscription').then(m => m.Inscription) },

  // PAGE D'ACCUEIL (choix espace)
  { path: 'home', canActivate: [authGuard], loadComponent: () => import('./features/home/home').then(m => m.Home) },

  // ESPACE ADMIN
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', canActivate: [authGuard], loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboard) },
  { path: 'admin/etablissement', canActivate: [authGuard], loadComponent: () => import('./features/admin/etablissement/etablissement').then(m => m.Etablissement) },
  { path: 'admin/medecins', canActivate: [authGuard], loadComponent: () => import('./features/admin/medecins/medecins').then(m => m.Medecins) },
  { path: 'admin/secretaires', canActivate: [authGuard], loadComponent: () => import('./features/admin/secretaires/secretaires').then(m => m.Secretaires) },
  { path: 'admin/salles', canActivate: [authGuard], loadComponent: () => import('./features/admin/salles/salles').then(m => m.Salles) },
  { path: 'admin/facturation', canActivate: [authGuard], loadComponent: () => import('./features/admin/facturation/facturation').then(m => m.Facturation) },
  { path: 'admin/audit-logs', canActivate: [authGuard], loadComponent: () => import('./features/admin/audit-logs/audit-logs').then(m => m.AuditLogs) },

  // ESPACE MEDECIN
  { path: 'medecin', redirectTo: 'medecin/dashboard', pathMatch: 'full' },
  { path: 'medecin/dashboard', canActivate: [authGuard], loadComponent: () => import('./features/medecin/dashboard-medecin/dashboard-medecin').then(m => m.DashboardMedecin) },
  { path: 'medecin/planning', canActivate: [authGuard], loadComponent: () => import('./features/medecin/planning-medecin/planning-medecin').then(m => m.PlanningMedecin) },
  { path: 'medecin/prescription', canActivate: [authGuard], loadComponent: () => import('./features/medecin/prescription-medecin/prescription-medecin').then(m => m.PrescriptionMedecin) },
  { path: 'medecin/disponibilites', canActivate: [authGuard], loadComponent: () => import('./features/medecin/disponibilites-medecin/disponibilites-medecin').then(m => m.DisponibilitesMedecin) },
  { path: 'medecin/consultation/:id', canActivate: [authGuard], loadComponent: () => import('./features/medecin/consultation-patient/consultation-patient').then(m => m.ConsultationPatient) },

  // ESPACE SECRETAIRE
  { path: 'secretaire', redirectTo: 'secretaire/dashboard', pathMatch: 'full' },
  { path: 'secretaire/dashboard', canActivate: [authGuard], loadComponent: () => import('./features/secretaire/dashboard-secretaire/dashboard-secretaire').then(m => m.DashboardSecretaire) },
  { path: 'secretaire/rdv', canActivate: [authGuard], loadComponent: () => import('./features/secretaire/gestion-rdv/gestion-rdv').then(m => m.RendezVous) },
  { path: 'secretaire/patients', canActivate: [authGuard], loadComponent: () => import('./features/secretaire/creation-patient/creation-patient').then(m => m.CreationPatient) },
  { path: 'secretaire/facturation', canActivate: [authGuard], loadComponent: () => import('./features/secretaire/facturation/facturation').then(m => m.Facturation) },
  { path: 'secretaire/feuille-soins', canActivate: [authGuard], loadComponent: () => import('./features/secretaire/feuille-soins/feuille-soins').then(m => m.FeuilleSOins) },

  // ESPACE PATIENT
  { path: 'patient', redirectTo: 'home', pathMatch: 'full' },
  { path: 'rdv', canActivate: [authGuard], loadComponent: () => import('./features/rdv/recherche-medecin/recherche-medecin').then(m => m.RechercheMedecin) },
  { path: 'rdv/confirmation', canActivate: [authGuard], loadComponent: () => import('./features/rdv/confirmation/confirmation').then(m => m.Confirmation) },
  { path: 'dossier', canActivate: [authGuard], loadComponent: () => import('./features/dossier/historique/historique').then(m => m.Historique) },
  { path: 'dossier/:id', canActivate: [authGuard], loadComponent: () => import('./features/dossier/detail/detail').then(m => m.Detail) },
  { path: 'ordonnances', canActivate: [authGuard], loadComponent: () => import('./features/ordonnances/liste/liste').then(m => m.Liste) },
  { path: 'patient/dashboard', canActivate: [authGuard], loadComponent: () => import('./features/patient/dashboard-patient/dashboard-patient').then(m => m.DashboardPatient) },
  { path: '**', redirectTo: 'login' }
];