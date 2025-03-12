'use client';

import { useGetUserByUsername } from '@/routes/userService';
import { useParams } from 'next/navigation';
import React from 'react';
import PostCard from '../post-card';

export default function UserPosts() {
  // Get the username from the URL parameter
  const { username } = useParams();

  // Use the hook to fetch user data and their posts
  const { data: userWithPosts, isLoading, error } = useGetUserByUsername(username);

  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500">Error loading profile: {error.message}</div>
      </div>
    );
  }

  if (!userWithPosts) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">User not found</div>
      </div>
    );
  }

  const { posts, ...userData } = userWithPosts;

  return (
    <div>
      {posts.length === 0 ? (
        <div className="text-center py-8 rounded-lg shadow-md">
          <p className="text-gray-500">No posts yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard
              key={post.id}
              id={post.id}
              content={post.content}
              media_urls={post.media_urls}
              created_at={post.created_at}
              profiles={userWithPosts} // Pass user data for the avatar, etc.
            />
          ))}
        </div>
      )}
    </div>
  );
}
