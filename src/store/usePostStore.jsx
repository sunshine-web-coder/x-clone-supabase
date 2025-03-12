import { create } from 'zustand';

const usePostStore = create((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  removePost: (postId) =>
    set((state) => ({ posts: state.posts.filter((p) => p.id !== postId) })),
}));

export default usePostStore;