import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appMoodMessage]'
})
export class MoodMessageDirective {
  @Input() mood:string = '';

  moodMessages: any={
    'happy': 'wow, tell me the story. I will also get happy for you',
    'sad':'no, worries this will pass also.',
    'angry':'Anger is valid, but don’t let it control you.',
    'calm':'you are like a dhoni.',
    'exicted':'keep your excitement high till the work done.'
}

  constructor() { }

  getMoodMessage(): any{
    if(this.mood && this.moodMessages[this.mood]){
      return this.moodMessages[this.mood];

  }
  }
}
