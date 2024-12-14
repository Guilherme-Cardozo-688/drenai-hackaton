import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, CommonModule } from '@angular/common';
import { Database, ref, onValue } from '@angular/fire/database';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    DatePipe,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  variavel: number[] = [];
  horario: string[] = [];
  temperatura: string[] = [];
  private chart: Chart | undefined;
  private temperChart: Chart | undefined;
  currentTime: Date = new Date();
  horaInicio = '--:--';
  contador = '--:--';

  constructor() {}

  ngOnInit() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.inicializarGraficos();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.temperChart) {
      this.temperChart.destroy();
    }
  }

  private getTemperaturaNumeros(): string[] {
    return this.temperatura.map(temp => temp.split(' ')[0] + '°');
  }

  private inicializarGraficos() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const temper = document.getElementById('temper') as HTMLCanvasElement;
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.horario,
        datasets: [{
          data: this.variavel,
          borderWidth: 1.5,
          borderColor: 'white',
          label: 'Nível de Resíduos'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Turbidez da Água',
            color: 'white',
            font: {
              size: 28,
              family: ' JetBrains Mono', 
            }
            
          }
        },
        scales: {
          y: {
            ticks: {
              color: 'white'
            }
          },
          x: {
            ticks: {
              color: 'white'
            }
          }
        }
      }
    });

    this.temperChart = new Chart(temper, {
      type: 'line',
      data: {
        labels: this.horario,
        datasets: [{
          data: this.getTemperaturaNumeros().map(temp => parseInt(temp)),
          borderWidth: 1.5,
          borderColor: 'white',
          label: 'Temperatura'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Temperatura da Água',
            color: 'white',
            font: {
              size: 28,
              family: ' JetBrains Mono', 
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white',
              callback: function(value) {
                return value + '°';
              }
            }
          },
          x: {
            ticks: {
              color: 'white'
            }
          }
        }
      }
    });
  }
}
