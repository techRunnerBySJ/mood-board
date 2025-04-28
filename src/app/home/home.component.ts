import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MoodMessageDirective } from '../shared/directives/mood-message.directive';
import { MoodEmojiPipe } from '../shared/pipes/mood-emoji.pipe';
import { FormsModule } from '@angular/forms';

import { Chart, ChartConfiguration } from 'chart.js/auto';
import { MoodService } from '../shared/services/mood.service';

interface MoodEntry {
  date: Date;
  mood: string;
  thoughts: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [CommonModule, ReactiveFormsModule, MoodEmojiPipe, FormsModule]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('moodChartCanvas') chartCanvas!: ElementRef;
  
  moods = ['happy', 'sad', 'angry', 'calm', 'excited'];
  selectedMood: string = '';
  userName: string = 'Coding Hero';
  showSelectedMood: boolean = false;
  moodMessage: string = '';
  isMoodMessage: boolean = false;
  moodForm: FormGroup;
  moodChart: Chart | null = null;
  moodEntries: MoodEntry[] = [];


  constructor(
    private fb: FormBuilder,
    private moodService: MoodService
  ) {
    this.moodForm = this.fb.group({
      date: [new Date(), Validators.required],
      mood: ['', Validators.required],
      thoughts: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    console.log(this.userName);
    this.loadMoodEntries();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.chartCanvas) {
        this.initializeChart();
      }
    }, 0);
  }
  

  loadMoodEntries() {
    this.moodService.getMoodEntriesObservable().subscribe(entries => {
      this.moodEntries = entries;
      if (this.moodChart) {
        this.updateChart();
      }
    });
  }

  selectMood(mood: string): void {
    this.showSelectedMood = true;
    this.selectedMood = mood;
    const moodMessageDirective = new MoodMessageDirective();
    moodMessageDirective.mood = this.selectedMood;
    this.moodMessage = moodMessageDirective.getMoodMessage();
    if(this.moodMessage){
      this.isMoodMessage = true;
    }
    console.log(this.selectedMood);
  }

  onSubmit() {
    if (this.moodForm.valid) {
      const entry: MoodEntry = {
        date: new Date(this.moodForm.value.date),
        mood: this.moodForm.value.mood,
        thoughts: this.moodForm.value.thoughts
      };

      this.moodService.addMoodEntry(entry).then(() => {
        this.moodForm.reset({
          date: new Date(),
          mood: '',
          thoughts: ''
        });
      });
    }
  }

  private initializeChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    console.log(ctx);
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Mood Trend',
          data: [],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false,
          pointRadius: 5,
          pointBackgroundColor: 'rgb(75, 192, 192)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                const moodMap = {
                  1: 'Angry',
                  2: 'Sad',
                  3: 'Calm',
                  4: 'Excited',
                  5: 'Happy'
                };
                return moodMap[value as keyof typeof moodMap] || value;
              }
            }
          }
        }
      }
    };

    this.moodChart = new Chart(ctx, config);
    this.updateChart();
  }

  private updateChart() {
    if (this.moodChart) {
      const moodValues = {
        'happy': 5,
        'excited': 4,
        'calm': 3,
        'sad': 2,
        'angry': 1
      };
  
      const sortedEntries = [...this.moodEntries].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  
      const labels = sortedEntries.map(entry => new Date(entry.date).toLocaleDateString());
      const data = sortedEntries.map(entry => moodValues[entry.mood as keyof typeof moodValues]);
  
      console.log('Chart Labels:', labels);
      console.log('Chart Data:', data);
  
      this.moodChart.data.labels = labels;
      this.moodChart.data.datasets[0].data = data;
      this.moodChart.update();
    }
  }
  

  getMoodColor(mood: string): string {
    const colors = {
      'happy': '#4CAF50',
      'sad': '#2196F3',
      'angry': '#F44336',
      'calm': '#9C27B0',
      'excited': '#FF9800'
    };
    return colors[mood as keyof typeof colors] || '#000000';
  }
  submit(){

  }
}