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
import { useToast } from '@/lib/toast-context';
import { MdOutlineGifBox } from "react-icons/md";
import IsReply from './IsReply';

const MAX_CONTENT_LENGTH = 280;
const MAX_IMAGES = 4;

export function ComposeTweet({ parentId = null, parentUsername = null, isReply = false, onSuccess = () => {}, initialContent = '' }) {
  const [content, setContent] = useState(initialContent);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { sessionId } = useAuthStore();
  const { addPost, incrementReplyCount } = usePostStore();
  const { addToast } = useToast();

  const handleSubmit = async e => {
    e.preventDefault();

    if (!sessionId) {
      addToast('Authentication Required.', 'error');
      return;
    }

    if (!content.trim() && images.length === 0) {
      addToast('Invalid Post: Please add content or media.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload media files to Supabase Storage
      const mediaUrls = await Promise.all(
        images.map(async image => {
          if (image.type === 'image') {
            const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}-${image.file.name}`;
            const filePath = `${sessionId}/${uniqueFileName}`;

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
        user_id: sessionId,
        content: content.trim(),
        media_urls: mediaUrls,
        created_at: new Date().toISOString(),
        parent_id: parentId
      };

      const { data, error } = await supabase.from('posts').insert([newPost]).select().single();

      if (error) throw error;

      // Update local state
      addPost({ ...newPost, id: data.id });

      // Update reply count if this is a reply
      if (parentId) {
        incrementReplyCount(parentId);
      }

      // Reset form and trigger success callback
      setContent('');
      setImages([]);
      onSuccess();

      // addToast(isReply ? 'Your post was sent' : 'Your post was sent', 'success');
      addToast('Your post was sent', 'success');
    } catch (error) {
      console.error('Error creating post:', error);
      addToast(`Error: Failed to post. Please try again.`, 'error');
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
      addToast(`Too many images: Maximum ${MAX_IMAGES} allowed.`, 'error');
      return;
    }

    setImages(prevImages => [...prevImages, ...files].slice(0, MAX_IMAGES));
    fileInputRef.current.value = ''; // Reset input
  };

  const removeImage = id => {
    setImages(prevImages => prevImages.filter(item => item.id !== id));
  };

  const characterCount = content.length;
  const isOverLimit = characterCount > MAX_CONTENT_LENGTH;

  return (
    <div className="compose-tweet">
      {isReply && parentUsername && (
        <IsReply parentUsername={parentUsername}/>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <UserAvatar />
          <div className="flex-1">
            <div className="relative">
              <AutoGrowingTextarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={isReply ? 'Post your reply' : 'What is happening?!'}
                className={`text-sm placeholder:text-gray-500 mt-2 leading-6 min-h-[30px] max-h-[300px] ${isOverLimit ? 'border-red-500 focus:border-red-500' : ''}`}
                maxHeight={300}
                aria-label={isReply ? 'Reply content' : 'Post content'}
                disabled={isSubmitting}
                autoFocus={isReply}
              />
            </div>

            <ImagePreview images={images} onRemove={removeImage} disabled={isSubmitting} />

            <div className="flex items-center justify-between mt-2">
              <div className="flex text-[var(--white)]">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" disabled={isSubmitting} />
                <Button
                  type="button"
                  className="media-button text-xs flex gap-1 p-0 h-8 w-8 rounded-full hover:bg-blue-500/10 bg-transparent font-normal items-center text-blue-500 disabled:opacity-50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting || images.length >= MAX_IMAGES}
                >
                  <UploadIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  className="text-xs flex gap-1 p-0 h-8 w-8 rounded-full hover:bg-blue-500/10 bg-transparent font-normal items-center text-blue-500 disabled:opacity-50"
                  disabled={isSubmitting || images.length > 0}
                >
                  <MdOutlineGifBox className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  className="text-xs flex gap-1 px-0 h-8 w-8 rounded-full hover:bg-blue-500/10 bg-transparent font-normal items-center text-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2 items-center justify-end">
                {characterCount > 0 && (
                  <span className={`text-[10px] font-semibold ${isOverLimit ? 'text-red-500' : characterCount > MAX_CONTENT_LENGTH * 0.8 ? 'text-yellow-500' : ''}`}>
                    {characterCount}/{MAX_CONTENT_LENGTH}
                  </span>
                )}
                <Button
                  type="submit"
                  className="submit-button bg-[#EFF3F4] text-[var(--black)] min-w-[70px] min-h-[25px] rounded-full px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || isOverLimit || (!content.trim() && images.length === 0)}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : isReply ? 'Reply' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
