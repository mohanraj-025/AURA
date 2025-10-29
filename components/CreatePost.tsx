import React, { useState, useRef } from 'react';
import { FeedItem } from '../types';

interface CreatePostProps {
  onClose: () => void;
  onCreatePost: (newPost: Omit<FeedItem, 'id' | 'type' | 'author'>) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose, onCreatePost }) => {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (image && title) {
      onCreatePost({
        imageUrl: image,
        title: title,
        description: 'A new look shared with the community.', // Default description
      });
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div 
              className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors"
              onClick={triggerFileSelect}
            >
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-center text-gray-400">
                  <p>Click to upload image</p>
                  <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My look for today"
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button type="button" onClick={onClose} className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!image || !title}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;