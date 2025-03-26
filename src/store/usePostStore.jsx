// store/usePostStore.js
import { create } from 'zustand';

const usePostStore = create((set, get) => ({
  posts: [],
  
  // Add this new action
  incrementReplyCount: (parentId) => set(state => ({
    posts: state.posts.map(post => 
      post.id === parentId 
        ? { ...post, reply_count: (post.reply_count || 0) + 1 } 
        : post
    )
  })),

  // Keep existing actions
  addPost: (newPost) => set(state => ({
    posts: [newPost, ...state.posts]
  })),
  removePost: (postId) => set(state => ({
    posts: state.posts.filter(p => p.id !== postId && p.parent_id !== postId)
  })),
  updatePost: (postId, updates) => set(state => ({
    posts: state.posts.map(post =>
      post.id === postId ? { ...post, ...updates } : post
    )
  })),
  getReplies: (parentId) => 
    get().posts.filter(post => post.parent_id === parentId),
  setPosts: (fetchedPosts) => set({ posts: fetchedPosts })
}));

export default usePostStore;