import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseConfig";

const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles:users (display_name, avatar_url, username)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const fetchPostById = async (postId) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles:users (display_name, avatar_url, username)")
    .eq("id", postId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const useFetchPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
};

export const useFetchPostById = (postId) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
  });
};
