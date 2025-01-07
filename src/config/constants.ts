export const API_CONFIG = {
  GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  GEMINI_KEY: 'AIzaSyBJDn1kU8IaegIZA-AOvgwOvHQk1uoGyp8',
};

export const CACHE_CONFIG = {
  STORY_CACHE_TIME: 1000 * 60 * 5, // 5 minutes
  MAX_CACHED_STORIES: 50,
};

export const ERROR_MESSAGES = {
  GENERATION_FAILED: 'Story generation failed. Please try again.',
  SAVE_FAILED: 'Failed to save story. Please try again.',
  INVALID_PROMPT: 'Please enter a valid story prompt.',
};