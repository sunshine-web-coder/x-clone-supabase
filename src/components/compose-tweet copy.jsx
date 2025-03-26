'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image as UploadIcon, FileImageIcon as FileGif, Smile, Loader2 } from 'lucide-react';
import { AutoGrowingTextarea } from '@/components/ui/auto-growing-textarea';
import { ImagePreview } from './image-preview';
import UserAvatar from './UserAvatar';
import useAuthStore from '@/store/useAuthStore';
import { supabase } from '@/lib/supabaseConfig';
import usePostStore from '@/store/usePostStore';
import { toast } from '@/hooks/use-toast';

const MAX_CONTENT_LENGTH = 280;
const MAX_IMAGES = 4;

export function ComposeTweet() {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuthStore();
  const addPost = usePostStore(state => state.addPost);
  // const { toast } = useToast()

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to post.',
        variant: 'destructive'
      });
      return;
    }

    if (!content.trim() && images.length === 0) {
      toast({
        title: 'Invalid Post',
        description: 'Please add some content or media to your post.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload media files to Supabase Storage
      const mediaUrls = await Promise.all(
        images.map(async image => {
          if (image.type === 'image') {
            const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}-${image.file.name}`;
            const filePath = `${user.id}/${uniqueFileName}`;

            const { data, error } = await supabase.storage.from('media_uploads').upload(filePath, image.file, {
              cacheControl: '3600',
              upsert: false
            });

            if (error) throw error;

            const { data: publicUrlData } = supabase.storage.from('media_uploads').getPublicUrl(filePath);

            return publicUrlData.publicUrl;
          }
          return image.url; // Return existing URL for GIFs
        })
      );

      const newPost = {
        user_id: user.id,
        content: content.trim(),
        media_urls: mediaUrls,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from('posts').insert([newPost]).select().single();

      if (error) throw error;

      // Add post to local state with the DB-generated ID
      addPost({ ...newPost, id: data.id });

      // Reset form
      setContent('');
      setImages([]);

      toast({
        title: 'Success',
        description: 'Your post has been published!'
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = e => {
    const files = Array.from(e.target.files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: crypto.randomUUID(),
        type: 'image',
        file: file
      }));

    if (files.length + images.length > MAX_IMAGES) {
      toast({
        title: 'Too many images',
        description: `You can only upload up to ${MAX_IMAGES} images.`,
        variant: 'destructive'
      });
      return;
    }

    setImages(prevImages => [...prevImages, ...files].slice(0, MAX_IMAGES));
    fileInputRef.current.value = ''; // Reset input
  };

  const handleGifSelect = selectedGif => {
    const gifImage = {
      id: crypto.randomUUID(),
      type: 'gif',
      url: selectedGif.images.original.url,
      title: selectedGif.title
    };
    setImages([gifImage]); // Replace existing images with GIF
  };

  const removeImage = id => {
    setImages(prevImages => prevImages.filter(item => item.id !== id));
  };

  const characterCount = content.length;
  const isOverLimit = characterCount > MAX_CONTENT_LENGTH;

  return (
    <div className="px-2 border-y border-zinc-700">
      <div className="p-4 py-2 text-[var(--white)]">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <UserAvatar />
            <div className="flex-1">
              <div className="relative">
                <AutoGrowingTextarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="What is happening?!"
                  className={`text-sm placeholder:text-gray-500 mt-2 leading-6 min-h-[30px] max-h-[300px] ${isOverLimit ? 'border-red-500 focus:border-red-500' : ''}`}
                  maxHeight={300}
                  aria-label="Tweet content"
                  disabled={isSubmitting}
                />
              </div>

              <ImagePreview images={images} onRemove={removeImage} disabled={isSubmitting} />

              <div className="flex items-center justify-between mt-2">
                <div className="flex text-[var(--white)] gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" disabled={isSubmitting} />
                  <Button
                    type="button"
                    className="text-xs flex gap-1 px-1 h-8 py-1 bg-transparent font-normal items-center text-[#35ae2a] hover:text-[#35ae2a]/75 hover:bg-transparent disabled:opacity-50"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting || images.length >= MAX_IMAGES}
                  >
                    <UploadIcon className="h-4 w-4" />
                    <span>Media</span>
                  </Button>
                  <Button
                    type="button"
                    className="text-xs flex gap-1 px-2 h-8 py-1 bg-transparent font-normal items-center text-[#35ae2a] hover:text-[#35ae2a]/75 hover:bg-transparent disabled:opacity-50"
                    disabled={isSubmitting || images.length > 0}
                  >
                    <FileGif className="h-4 w-4" />
                    <span>GIF</span>
                  </Button>
                  <Button type="button" className="text-xs flex gap-1 px-2 h-8 py-1 bg-transparent font-normal items-center text-[#35ae2a] hover:text-[#35ae2a]/75 hover:bg-transparent disabled:opacity-50" disabled={isSubmitting}>
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2 items-center justify-end">
                  <span className={`text-[10px] font-semibold ${isOverLimit ? 'text-red-500' : characterCount > MAX_CONTENT_LENGTH * 0.8 ? 'text-yellow-500' : ''}`}>
                    {characterCount}/{MAX_CONTENT_LENGTH}
                  </span>
                  <Button
                    type="submit"
                    className="bg-[#35ae2a] hover:bg-[#35ae2a]/90 text-[var(--white)] min-w-[80px] rounded-full px-4 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || isOverLimit || (!content.trim() && images.length === 0)}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
