"use client"

import { usePostById } from '@/routes/postsService';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function SinglePost({ postId, username }) {
  const { data: post, isLoading, error } = usePostById(postId);
  const router = useRouter();

  if (isLoading) return <p>Loading post...</p>;

  if (error) return <p>{error.message}</p>;

  if (!post) {
    return <p>Post not found.</p>;
  }
  return (
    <div>
      <p>By: {username}</p>
      <p>{post.content}</p>
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  );
}
