import React from 'react';
import { ChevronRight, Trash2 } from 'lucide-react';
import { useStoryStore } from '../stores/storyStore';
import { toast } from 'react-hot-toast';
import type { Story } from '../types/story';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const deleteStory = useStoryStore((state) => state.deleteStory);

  const handleDelete = async () => {
    try {
      await deleteStory(story.id);
      toast.success('Story deleted');
    } catch (error) {
      toast.error('Failed to delete story');
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-red-600">{story.title}</h3>
        <span className="text-sm text-gray-500">
          {new Date(story.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-300 line-clamp-3">{story.content}</p>
      <div className="flex justify-between items-center mt-4">
        <button className="text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1">
          Read more <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}