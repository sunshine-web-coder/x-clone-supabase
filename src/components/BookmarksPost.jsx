'use client';

import { useFetchBookmarkedPosts } from '@/hooks/useFetchBookmarkedPosts';
import PostCard from './post-card';

export default function BookmarksPost() {
  const { data: bookmarkedPosts, isLoading, isError, error } = useFetchBookmarkedPosts();

  if (isLoading) return <p>Loading bookmarks...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <section className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Bookmarked Posts</h1>
      {bookmarkedPosts?.length > 0 ? (
        <div className="space-y-4">
          {bookmarkedPosts.map(({ post_id, posts }) => {
            const { content, media_urls, created_at, users } = posts || {};
            return (
              <PostCard
                key={post_id}
                id={post_id}
                content={content}
                media_urls={media_urls}
                created_at={created_at}
                profiles={{
                  username: users?.username,
                  display_name: users?.username,
                  avatar_url: users?.avatar_url
                }}
              />
            );
          })}
        </div>
      ) : (
        <p>No bookmarks found.</p>
      )}
    </section>
  );
}
