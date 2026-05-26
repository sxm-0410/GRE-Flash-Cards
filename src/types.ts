export interface Word {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonym: string;
  antonym: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  masteryState: 'Unseen' | 'Seen' | 'Familiar' | 'Learned' | 'Mastered';
}
