export interface Story {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  content: string;
  genre: string;
}

export interface StoryScene {
  title: string;
  content: string;
}

export interface StoryGenerationOptions {
  genre: string;
  setting: string;
  timeOfDay: string;
  mood: string;
}

export type StoryGenre = 'fantasy' | 'scifi' | 'romance' | 'mystery' | 'horror';