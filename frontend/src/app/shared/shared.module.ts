import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast';
import { ConfirmationDialogComponent } from './components/confirm-dialog/confirm-dialog';
import { SkeletonComponent } from './components/skeleton/skeleton';
import { StatusBadgeComponent } from './components/status-badge/status-badge';

@NgModule({
  imports: [
    CommonModule,
    ToastComponent,
    ConfirmationDialogComponent,
    SkeletonComponent,
    StatusBadgeComponent
  ],
  exports: [
    ToastComponent,
    ConfirmationDialogComponent,
    SkeletonComponent,
    StatusBadgeComponent
  ]
})
export class SharedModule {}
