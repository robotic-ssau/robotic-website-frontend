import { create } from 'zustand';

interface PostsStoreState {
  /** Размер страницы для списка постов */
  pageSize: number;
  setPageSize: (size: number) => void;
}

export const usePostsStore = create<PostsStoreState>((set) => ({
  pageSize: 10,
  setPageSize: (pageSize) => set({ pageSize }),
}));
