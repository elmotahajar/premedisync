import { Component, inject, OnInit, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';

interface KPICard {
  title: string;
  icon: string;
  value: number;
  trend: number;
  trendLabel: string;
  subtitle?: string;
}

interface RecentActivity {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface ChartData {
  labels: string[];
  values: number[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accueil.html',
  styleUrls: ['./accueil.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private adminService = inject(AdminService);

  loading = signal(true);
  Math = Math; // Expose Math for template
  
  // KPI Cards
  kpiCards: KPICard[] = [
    {
      title: 'Patients',
      icon: '🧑‍⚕️',
      value: 1245,
      trend: 12,
      trendLabel: '+12 this month',
      subtitle: 'Active patients'
    },
    {
      title: 'Médecins',
      icon: '👨‍⚕️',
      value: 28,
      trend: 5,
      trendLabel: 'by specialty',
      subtitle: 'General, Cardio, Dentist'
    },
    {
      title: 'Rendez-vous',
      icon: '📅',
      value: 145,
      trend: 8,
      trendLabel: '+8% vs last week',
      subtitle: '45 today'
    },
    {
      title: 'Revenus',
      icon: '💰',
      value: 24500,
      trend: 15,
      trendLabel: '+15% vs last month',
      subtitle: '€ this month'
    }
  ];

  // Recent Activities
  recentActivities: RecentActivity[] = [
    { id: 1, patientName: 'Jean Dupont', doctorName: 'Dr. Martin', date: '2026-05-25 14:30', status: 'confirmed' },
    { id: 2, patientName: 'Marie Lefebvre', doctorName: 'Dr. Chen', date: '2026-05-25 15:00', status: 'confirmed' },
    { id: 3, patientName: 'Pierre Bernard', doctorName: 'Dr. Garcia', date: '2026-05-25 16:00', status: 'pending' },
    { id: 4, patientName: 'Sophie Laurent', doctorName: 'Dr. Martin', date: '2026-05-24 10:00', status: 'confirmed' },
    { id: 5, patientName: 'Luc Moreau', doctorName: 'Dr. Chen', date: '2026-05-24 14:00', status: 'cancelled' },
    { id: 6, patientName: 'Anne Robert', doctorName: 'Dr. Garcia', date: '2026-05-23 09:00', status: 'confirmed' },
    { id: 7, patientName: 'Marc Petit', doctorName: 'Dr. Martin', date: '2026-05-23 11:00', status: 'confirmed' },
    { id: 8, patientName: 'Claire Dubois', doctorName: 'Dr. Chen', date: '2026-05-23 15:00', status: 'pending' },
    { id: 9, patientName: 'Olivier Lefevre', doctorName: 'Dr. Garcia', date: '2026-05-22 13:00', status: 'confirmed' },
    { id: 10, patientName: 'Isabelle Martin', doctorName: 'Dr. Martin', date: '2026-05-22 16:00', status: 'confirmed' }
  ];

  // Quick Stats
  quickStats = signal([
    { label: 'No-show rate', value: '3.2%', icon: '📊', color: '#10b981' },
    { label: 'Avg consultations/day', value: '42', icon: '📈', color: '#f59e0b' },
    { label: 'Room occupation', value: '87%', icon: '🏥', color: '#0ea5e9' },
    { label: 'Top doctor this month', value: 'Dr. Martin', icon: '⭐', color: '#8b5cf6' }
  ]);

  // Chart Data
  appointmentsPerDay: ChartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    values: [45, 52, 48, 61, 55, 67, 58]
  };

  consultationsByDoctor: ChartData = {
    labels: ['Dr. Martin', 'Dr. Chen', 'Dr. Garcia', 'Dr. Durand', 'Dr. Lefevre'],
    values: [156, 142, 138, 124, 98]
  };

  patientsByStatus: ChartData = {
    labels: ['Active', 'Inactive', 'New'],
    values: [980, 186, 79]
  };

  revenueVsUnpaid: ChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    values: [6200, 5800, 7100, 5400]
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // For now, using mock data. Backend call would go here:
    // this.adminService.getDashboard().subscribe({...})
    
    setTimeout(() => {
      this.loading.set(false);
    }, 800);
  }

  getTrendColor(trend: number): string {
    return trend > 0 ? '#10b981' : '#ef4444';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  }

  // Chart drawing utilities (simple canvas charts)
  drawLineChart(canvasId: string, data: ChartData): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    const maxValue = Math.max(...data.values);
    const minValue = 0;
    const range = maxValue - minValue;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * graphHeight) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Plot line
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < data.values.length; i++) {
      const x = padding + (i * graphWidth) / (data.values.length - 1);
      const y = height - padding - ((data.values[i] - minValue) / range) * graphHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#0ea5e9';
    for (let i = 0; i < data.values.length; i++) {
      const x = padding + (i * graphWidth) / (data.values.length - 1);
      const y = height - padding - ((data.values[i] - minValue) / range) * graphHeight;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < data.labels.length; i++) {
      const x = padding + (i * graphWidth) / (data.labels.length - 1);
      ctx.fillText(data.labels[i], x, height - padding + 20);
    }
  }

  drawBarChart(canvasId: string, data: ChartData): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    const maxValue = Math.max(...data.values);
    const barWidth = graphWidth / (data.values.length * 1.5);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * graphHeight) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw bars
    const colors = ['#0ea5e9', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
    for (let i = 0; i < data.values.length; i++) {
      const x = padding + (i + 0.25) * (barWidth * 1.5);
      const barHeight = (data.values[i] / maxValue) * graphHeight;
      const y = height - padding - barHeight;

      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(x, y, barWidth, barHeight);

      // Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[i], x + barWidth / 2, height - padding + 20);
    }
  }

  drawPieChart(canvasId: string, data: ChartData): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.5;
    const total = data.values.reduce((a, b) => a + b, 0);
    const colors = ['#10b981', '#ef4444', '#0ea5e9'];

    let currentAngle = -Math.PI / 2;
    for (let i = 0; i < data.values.length; i++) {
      const sliceAngle = (data.values[i] / total) * 2 * Math.PI;

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.65);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.65);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      const percentage = ((data.values[i] / total) * 100).toFixed(0);
      ctx.fillText(`${percentage}%`, labelX, labelY);

      currentAngle += sliceAngle;
    }

    // Legend
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    const legendY = height - 50;
    for (let i = 0; i < data.labels.length; i++) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(20, legendY + i * 20, 12, 12);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(data.labels[i], 40, legendY + i * 20 + 10);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.drawLineChart('appointmentsChart', this.appointmentsPerDay);
      this.drawBarChart('consultationsChart', this.consultationsByDoctor);
      this.drawPieChart('patientStatusChart', this.patientsByStatus);
      this.drawBarChart('revenueChart', this.revenueVsUnpaid);
    }, 100);
  }
}
