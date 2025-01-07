import React, { useState } from 'react';
import { Sparkles, Save, Wand2, BookOpen } from 'lucide-react';
import { useStoryStore } from '../stores/storyStore';
import { toast } from 'react-hot-toast';

const GENRES = [
  { id: "fantasy", name: "Fantasy", prompt: "magical realm" },
  { id: "scifi", name: "Sci-Fi", prompt: "futuristic world" },
  { id: "romance", name: "Romance", prompt: "love story" },
  { id: "mystery", name: "Mystery", prompt: "intriguing case" },
  { id: "horror", name: "Horror", prompt: "scary tale" }
] as const;

const STORY_ELEMENTS = {
  setting: [
    "ancient castle",
    "bustling metropolis",
    "remote space station",
    "enchanted forest",
    "underwater city"
  ],
  timeOfDay: [
    "dawn",
    "midnight",
    "golden hour",
    "stormy evening",
    "mysterious twilight"
  ],
  mood: [
    "mysterious",
    "romantic",
    "thrilling",
    "melancholic",
    "whimsical"
  ]
};

interface StoryScene {
  title: string;
  content: string;
}

export function StoryGenerator() {
  const [prompt, setPrompt] = useState("");
  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<typeof GENRES[number]["id"]>("fantasy");
  const [selectedSetting, setSelectedSetting] = useState(STORY_ELEMENTS.setting[0]);
  const [selectedTime, setSelectedTime] = useState(STORY_ELEMENTS.timeOfDay[0]);
  const [selectedMood, setSelectedMood] = useState(STORY_ELEMENTS.mood[0]);
  const saveStory = useStoryStore((state) => state.saveStory);

  async function handleGenerateStory() {
    if (!prompt.trim()) {
      toast.error("Please enter a story prompt!");
      return;
    }

    setLoading(true);
    setScenes([]);

    try {
      const enhancedPrompt = `Generate a ${selectedMood} ${selectedGenre} story that takes place in a ${selectedSetting} during ${selectedTime}. The story should be about: ${prompt}. Divide the story into 3 scenes with titles. Format: SCENE 1: [Title] [Content] SCENE 2: [Title] [Content] SCENE 3: [Title] [Content]`;
      
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBJDn1kU8IaegIZA-AOvgwOvHQk1uoGyp8",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: enhancedPrompt }] }],
          }),
        }
      );

      const data = await res.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Parse scenes from response
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
      toast.error("Failed to generate story. Please try again!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveStory = async () => {
    if (scenes.length === 0) return;
    
    try {
      const fullStory = scenes.map(scene => 
        `${scene.title}\n\n${scene.content}`
      ).join('\n\n');
      
      await saveStory({
        title: prompt,
        content: fullStory,
        genre: selectedGenre
      });
      toast.success('Story saved successfully!');
    } catch (error) {
      toast.error('Failed to save story');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            className={`px-6 py-2 rounded-full ${
              selectedGenre === genre.id
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            } transition-colors`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={selectedSetting}
            onChange={(e) => setSelectedSetting(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            {STORY_ELEMENTS.setting.map(setting => (
              <option key={setting} value={setting}>{setting}</option>
            ))}
          </select>

          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            {STORY_ELEMENTS.timeOfDay.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>

          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            {STORY_ELEMENTS.mood.map(mood => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your story prompt..."
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            onClick={handleGenerateStory}
            disabled={loading}
            className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              "Generating..."
            ) : (
              <>
                Generate <Wand2 className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
            </div>
          ) : scenes.length > 0 ? (
            <div className="space-y-6">
              {scenes.map((scene, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-xl font-semibold text-red-600 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Scene {index + 1}: {scene.title}
                  </h3>
                  <p className="text-gray-300 whitespace-pre-line">{scene.content}</p>
                </div>
              ))}
              <button
                onClick={handleSaveStory}
                className="flex items-center gap-2 text-gray-300 hover:text-red-600 transition-colors"
              >
                <Save className="w-5 h-5" /> Save Story
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Your story will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}