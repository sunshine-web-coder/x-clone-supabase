'use client';

import { useFetchPostWithReplies } from '@/routes/useFetchPosts'; // Updated import
import { useParams } from 'next/navigation';
import SinglePostCard from '@/components/single-post-card';
import GoBack from '@/components/GoBack';
import PostCard from '@/components/PostCard';
import { Loader2 } from 'lucide-react';

export default function SinglePostPage() {
  const params = useParams();
  const { data, isLoading, error } = useFetchPostWithReplies(params.id); // Updated hook

  if (isLoading) {
    return (
      <div className="flex justify-center mt-5">
        <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const { post, replies } = data || {};

  return (
    <div className="container mx-auto">
      <GoBack title="Post" />
      {/* Main Post Card */}
      {post && <SinglePostCard id={post.id} content={post.content} media_urls={post.media_urls} created_at={post.created_at} profiles={post.profiles} />}

      {/* Display Replies */}
      {replies && replies.length > 0 ? (
        <div className="">
          {replies.map(reply => (
            <PostCard key={reply.id} id={reply.id} content={reply.content} media_urls={reply.media_urls} created_at={reply.created_at} profiles={reply.profiles} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500 text-center">No replies yet.</p>
      )}
    </div>
  );
}
