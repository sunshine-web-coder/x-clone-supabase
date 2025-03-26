import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseConfig";

// Fetch only main posts (no replies)
const fetchMainPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles:users (id, display_name, avatar_url, username)")
    .is("parent_id", null) // Only get posts without parent (main posts)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// Fetch a single post with its replies
const fetchPostWithReplies = async (postId) => {
  // Fetch main post
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*, profiles:users (id, display_name, avatar_url, username)")
    .eq("id", postId)
    .single();

  if (postError) throw new Error(postError.message);

  // Fetch replies separately
  const { data: replies, error: repliesError } = await supabase
    .from("posts")
    .select("*, profiles:users (id, display_name, avatar_url, username)")
    .eq("parent_id", postId)
    .order("created_at", { ascending: true });

  if (repliesError) throw new Error(repliesError.message);

  return { 
    post, 
    replies 
  };
};

export const useFetchMainPosts = () => {
  return useQuery({
    queryKey: ["main-posts"],
    queryFn: fetchMainPosts,
  });
};

export const useFetchPostWithReplies = (postId) => {
  return useQuery({
    queryKey: ["post-with-replies", postId],
    queryFn: () => fetchPostWithReplies(postId),
    enabled: !!postId,
  });
};