import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Story } from '../types/story';

interface StoryState {
  stories: Story[];
  loading: boolean;
  error: string | null;
  fetchStories: () => Promise<void>;
  saveStory: (story: Omit<Story, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  loading: false,
  error: null,
  fetchStories: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ stories: data as Story[], error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  saveStory: async (story) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .insert([story])
        .select()
        .single();

      if (error) throw error;
      set({ stories: [data as Story, ...get().stories] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  deleteStory: async (id) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set({ stories: get().stories.filter(story => story.id !== id) });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));