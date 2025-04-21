import { Component } from '@angular/core';
import { HeaderComponent } from '../layout/header/header.component';
import { CommonModule } from '@angular/common';
import { MoodMessageDirective } from '../shared/directives/mood-message.directive';
import { MoodEmojiPipe } from '../shared/pipes/mood-emoji.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [CommonModule, MoodEmojiPipe, FormsModule]
})
export class HomeComponent {

  moods = ['happy', 'sad', 'angry', 'calm', 'excited'];
  selectedMood: string = '';
  userName: string = 'Coding Hero';
  showSelectedMood: boolean = false;
  moodMessage: string = '';
  isMoodMessage: boolean = false;

  constructor(){

  }
  ngOnInit(){
    console.log(this.userName);
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

  submit(){

  }
}