// Example API hooks using React Query
// Place this file in your frontend src folder (e.g., src/shared/api/mock-hooks.ts)
// @ts-nocheck

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  LoginRequestDTO,
  LoginResponseDTO,
  UserWithProfileDTO,
  PostDTO,
  PostDetailedDTO,
} from '../../../shared/types';
import mockApiClient from './api-client.example';

// ========== Auth Hooks ==========

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginRequestDTO) => {
      const response = await mockApiClient.post<LoginResponseDTO>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await mockApiClient.post('/auth/logout');
    },
    onSuccess: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await mockApiClient.get<UserWithProfileDTO>('/auth/me');
      return response.data;
    },
    retry: false,
  });
}

// ========== User Hooks ==========

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await mockApiClient.get<UserWithProfileDTO[]>('/users');
      return response.data;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await mockApiClient.get<UserWithProfileDTO>(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await mockApiClient.post<UserWithProfileDTO>('/users', userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await mockApiClient.patch<UserWithProfileDTO>(`/users/${id}`, updates);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', data.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await mockApiClient.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// ========== Post Hooks ==========

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await mockApiClient.get<PostDTO[]>('/posts');
      return response.data;
    },
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const response = await mockApiClient.get<PostDetailedDTO>(`/posts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: any) => {
      const response = await mockApiClient.post<PostDetailedDTO>('/posts', postData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await mockApiClient.patch<PostDetailedDTO>(`/posts/${id}`, updates);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', data.id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await mockApiClient.delete(`/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
