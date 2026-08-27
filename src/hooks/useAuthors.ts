import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { AuthorProfile } from '../types';

export function useAuthorProfile(authorIdOrUsername: string) {
  return useQuery({
    queryKey: ['authors', 'profile', authorIdOrUsername],
    queryFn: async () => {
      const response = await api.get<{ author: AuthorProfile }>(`/authors/${authorIdOrUsername}`);
      return response.data.author;
    },
    enabled: Boolean(authorIdOrUsername),
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (authorIdOrUsername: string) => {
      const response = await api.post<{ is_following: boolean; followers_count: number }>(`/authors/${authorIdOrUsername}/follow`);
      return response.data;
    },
    onMutate: async (authorIdOrUsername: string) => {
      await queryClient.cancelQueries({ queryKey: ['authors', 'profile', authorIdOrUsername] });

      const previousProfile = queryClient.getQueryData<AuthorProfile>(['authors', 'profile', authorIdOrUsername]);

      if (previousProfile) {
        const newIsFollowing = !previousProfile.is_following;
        queryClient.setQueryData<AuthorProfile>(
          ['authors', 'profile', authorIdOrUsername],
          {
            ...previousProfile,
            is_following: newIsFollowing,
            followersCount: newIsFollowing
              ? previousProfile.followersCount + 1
              : Math.max(0, previousProfile.followersCount - 1),
          }
        );
      }

      return { previousProfile };
    },
    onError: (_err, authorIdOrUsername, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['authors', 'profile', authorIdOrUsername], context.previousProfile);
      }
    },
    onSettled: (_data, _err, authorIdOrUsername) => {
      queryClient.invalidateQueries({ queryKey: ['authors', 'profile', authorIdOrUsername] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
