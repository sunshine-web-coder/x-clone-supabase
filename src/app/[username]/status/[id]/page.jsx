'use client';

import { useFetchPostById } from '@/routes/useFetchPosts';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SinglePostPage() {
  const params = useParams();
  const { data: post, isLoading, error } = useFetchPostById(params.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading post...</p>
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

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" className="mb-6">
        Post
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${post.profiles?.display_name}`} />
              <AvatarFallback>{post.profiles?.display_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{post.profiles?.display_name}</span>
                <span>{post.profiles?.username}</span>
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
