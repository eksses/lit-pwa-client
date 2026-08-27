import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { useReaderStore } from '../store/useReaderStore';
import {
  Literature,
  LiteratureListResponse,
  Category,
  Language,
  Comment,
  CreateLiteratureInput,
} from '../types';

export interface UseLiteratureListParams {
  category?: Category;
  language?: Language;
  author_id?: string;
  sort?: 'trending' | 'latest' | 'top';
  page?: number;
  limit?: number;
}

export function useLiteratureList(params?: UseLiteratureListParams) {
  return useQuery({
    queryKey: ['literature', 'list', params],
    queryFn: async () => {
      const response = await api.get<LiteratureListResponse>('/literature', { params });
      return response.data;
    },
  });
}
export function useLiteratureDetail(slugOrId: string) {
  return useQuery({
    queryKey: ['literature', 'detail', slugOrId],
    queryFn: async () => {
      try {
        const response = await api.get<{ literature: Literature }>(`/literature/${slugOrId}`);
        const item = response.data.literature;
        if (item) {
          // Auto-cache opened story into reader store for background offline reading
          const readerState = useReaderStore.getState();
          const exists = readerState.savedItems.some((s) => s.id === item.id || s.slug === item.slug);
          if (!exists) {
            readerState.toggleSaveOffline(item);
          }
        }
        return item;
      } catch (err) {
        // Serve from offline cache if network is unavailable
        const local = useReaderStore.getState().savedItems.find((s) => s.slug === slugOrId || s.id === slugOrId);
        if (local) return local;
        throw err;
      }
    },
    enabled: Boolean(slugOrId),
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<{ is_liked: boolean; likes_count: number }>(`/literature/${id}/like`);
      return response.data;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['literature'] });
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      const previousDetailQueries = queryClient.getQueriesData<Literature>({ queryKey: ['literature', 'detail'] });
      const previousListQueries = queryClient.getQueriesData<LiteratureListResponse>({ queryKey: ['literature', 'list'] });
      const previousFeedQueries = queryClient.getQueriesData<LiteratureListResponse>({ queryKey: ['feed'] });

      queryClient.setQueriesData<Literature>(
        { queryKey: ['literature', 'detail'] },
        (old) => {
          if (!old) return old;
          const isTarget = old.id === id || old.slug === id;
          if (!isTarget) return old;
          const newIsLiked = !old.is_liked;
          return {
            ...old,
            is_liked: newIsLiked,
            likesCount: newIsLiked ? old.likesCount + 1 : Math.max(0, old.likesCount - 1),
          };
        }
      );

      queryClient.setQueriesData<LiteratureListResponse>(
        { queryKey: ['literature', 'list'] },
        (old) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            items: old.items.map((item) => {
              if (item.id === id || item.slug === id) {
                const newIsLiked = !item.is_liked;
                return {
                  ...item,
                  is_liked: newIsLiked,
                  likesCount: newIsLiked ? item.likesCount + 1 : Math.max(0, item.likesCount - 1),
                };
              }
              return item;
            }),
          };
        }
      );

      queryClient.setQueriesData<LiteratureListResponse>(
        { queryKey: ['feed'] },
        (old) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            items: old.items.map((item) => {
              if (item.id === id || item.slug === id) {
                const newIsLiked = !item.is_liked;
                return {
                  ...item,
                  is_liked: newIsLiked,
                  likesCount: newIsLiked ? item.likesCount + 1 : Math.max(0, item.likesCount - 1),
                };
              }
              return item;
            }),
          };
        }
      );

      return { previousDetailQueries, previousListQueries, previousFeedQueries };
    },
    onError: (_err, _id, context) => {
      if (context?.previousDetailQueries) {
        context.previousDetailQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousListQueries) {
        context.previousListQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousFeedQueries) {
        context.previousFeedQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['literature'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      literatureId,
      content,
      guestName,
    }: {
      literatureId: string;
      content: string;
      guestName?: string;
    }) => {
      const response = await api.post<{ comment: Comment; message: string }>(`/literature/${literatureId}/comment`, {
        content,
        guest_name: guestName,
        guestName,
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['literature', 'detail', variables.literatureId] });
      queryClient.invalidateQueries({ queryKey: ['literature', 'list'] });
    },
  });
}

export function useCreateLiterature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLiteratureInput) => {
      const response = await api.post<{ literature: Literature; message: string }>('/literature', input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['literature', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useFeed(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['feed', params],
    queryFn: async () => {
      const response = await api.get<LiteratureListResponse>('/feed', { params });
      return response.data;
    },
  });
}
