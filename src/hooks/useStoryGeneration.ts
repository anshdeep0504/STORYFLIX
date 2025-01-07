import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api';
import { storyCache } from '../lib/cache';
import { ERROR_MESSAGES } from '../config/constants';
import { toast } from 'react-hot-toast';
import type { StoryScene } from '../types/story';

export function useStoryGeneration() {
  const [loading, setLoading] = useState(false);
  const [scenes, setScenes] = useState<StoryScene[]>([]);

  const generateStory = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error(ERROR_MESSAGES.INVALID_PROMPT);
      return;
    }

    setLoading(true);
    setScenes([]);

    try {
      // Check cache first
      const cacheKey = prompt.toLowerCase().trim();
      const cachedResponse = storyCache.get(cacheKey);

      let aiResponse;
      if (cachedResponse) {
        aiResponse = cachedResponse;
      } else {
        aiResponse = await apiClient.generateStory({ prompt });
        storyCache.set(cacheKey, aiResponse);
      }

      // Parse scenes
      const sceneRegex = /SCENE \d+: ([^\n]+)\n([\s\S]+?)(?=SCENE \d+:|$)/g;
      const parsedScenes: StoryScene[] = [];
      let match;

      while ((match = sceneRegex.exec(aiResponse)) !== null) {
        parsedScenes.push({
          title: match[1].trim(),
          content: match[2].trim()
        });
      }

      setScenes(parsedScenes);
      toast.success('Story generated successfully!');
    } catch (error) {
      toast.error(ERROR_MESSAGES.GENERATION_FAILED);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    scenes,
    generateStory
  };
}