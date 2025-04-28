import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {API_URL, API_ENDPOINTS} from '../api.const'; // Adjust the import path as necessary
import { HttpClient } from '@angular/common/http';

interface MoodEntry {
  date: Date;
  mood: string;
  thoughts: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  // ✅ SIGNAL for current mood (you can use for other places)
  currentMoodSignal = signal<string>('No Mood Selected');

  // ✅ BehaviorSubject for mood entries (FULL mood list for chart)
  private moodEntriesSubject = new BehaviorSubject<MoodEntry[]>([]);
  moodEntries$ = this.moodEntriesSubject.asObservable();



  constructor() {
    this.loadMoodEntriesFromStorage();
  }

  // getUsers(): Observable<any>{
  //   return this.http.get(`${API_URL}${API_ENDPOINTS.GET_USER_MOOD}`);
  // }

  // ✅ Add new mood entry and update LocalStorage + BehaviorSubject
  addMoodEntry(entry: MoodEntry): Promise<void> {
    return new Promise((resolve) => {
      const existingEntries = this.getMoodEntriesFromStorage();
      existingEntries.push(entry);

      localStorage.setItem('mood-entries', JSON.stringify(existingEntries));

      // Update BehaviorSubject
      this.moodEntriesSubject.next(existingEntries);

      // Update Signal (optional, for latest mood)
      this.currentMoodSignal.set(entry.mood);

      resolve();
    });
  }

  // ✅ Get mood entries as Observable (for charts, etc.)
  getMoodEntriesObservable(): Observable<MoodEntry[]> {
    return this.moodEntries$;
  }

  // ✅ Get mood entries once (normal array, not reactive)
  private getMoodEntriesFromStorage(): MoodEntry[] {
    const stored = localStorage.getItem('mood-entries');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((entry: any) => ({
        date: new Date(entry.date),
        mood: entry.mood,
        thoughts: entry.thoughts
      }));
    }
    return [];
  }

  // ✅ Load entries into BehaviorSubject at app startup
  private loadMoodEntriesFromStorage(): void {
    const entries = this.getMoodEntriesFromStorage();
    this.moodEntriesSubject.next(entries);
  }

  // ✅ Fetch today's mood asynchronously using Promise
  getTodayMood(): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = this.getMoodEntriesFromStorage();
        const todayEntry = entries.find(entry => {
          const entryDate = new Date(entry.date).toISOString().split('T')[0];
          return entryDate === today;
        });
        resolve(todayEntry?.mood || 'No Mood Saved');
      }, 1000); // 1 second delay
    });
  }
}
