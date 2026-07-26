import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import api from './axios';
import type { Deal, Destination, Trip } from '../types';

/**
 * All data access goes through the configured axios instance so auth headers and
 * the 401-refresh interceptor apply uniformly. The previous version mixed bare
 * `fetch('/api/...')` for public reads with axios for authenticated ones, so half
 * the app silently bypassed token refresh.
 */

/** Pulls a human-readable message out of an axios error, whatever its shape. */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: string; message?: string; details?: { message: string }[] }
      | undefined;
    // Field-level validation detail is more useful than the generic wrapper.
    if (data?.details?.length) return data.details[0].message;
    return data?.error ?? data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}

export const queryKeys = {
  deals: ['deals'] as const,
  destinations: ['destinations'] as const,
  destination: (id: string) => ['destination', id] as const,
  trips: ['trips'] as const,
  favoriteIds: ['favorites', 'ids'] as const,
  favorites: ['favorites', 'list'] as const,
};

/* -------------------------------------------------------------------------- */
/* Destinations                                                               */
/* -------------------------------------------------------------------------- */

export function useDestinations() {
  return useQuery({
    queryKey: queryKeys.destinations,
    queryFn: async (): Promise<Destination[]> => {
      const { data } = await api.get<Destination[]>('/explore');
      return data;
    },
  });
}

export function useDestination(id?: string) {
  return useQuery({
    queryKey: queryKeys.destination(id ?? ''),
    queryFn: async (): Promise<Destination> => {
      const { data } = await api.get<Destination>(`/explore/${id}`);
      return data;
    },
    enabled: Boolean(id),
    retry: false,
  });
}

export function useDeals() {
  return useQuery({
    queryKey: queryKeys.deals,
    queryFn: async (): Promise<Deal[]> => {
      const { data } = await api.get<Deal[]>('/deals');
      return data;
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Reviews                                                                    */
/* -------------------------------------------------------------------------- */

export interface SubmitReviewInput {
  id: string;
  rating: number;
  comment?: string;
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, rating, comment }: SubmitReviewInput): Promise<Destination> => {
      const { data } = await api.put<Destination>(`/explore/${id}/reviews`, { rating, comment });
      return data;
    },
    onSuccess: (destination) => {
      // Write the response straight into the cache — the server returns the
      // recomputed average, so no refetch is needed for the detail view.
      queryClient.setQueryData(queryKeys.destination(String(destination.id)), destination);
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations });
      queryClient.invalidateQueries({ queryKey: queryKeys.deals });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Destination> => {
      const { data } = await api.delete<Destination>(`/explore/${id}/reviews`);
      return data;
    },
    onSuccess: (destination) => {
      queryClient.setQueryData(queryKeys.destination(String(destination.id)), destination);
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Favourites                                                                 */
/* -------------------------------------------------------------------------- */

export function useFavoriteIds(enabled = true) {
  return useQuery({
    queryKey: queryKeys.favoriteIds,
    queryFn: async (): Promise<number[]> => {
      const { data } = await api.get<{ ids: number[] }>('/favorites/ids');
      return data.ids;
    },
    enabled,
  });
}

export function useFavorites(enabled = true) {
  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: async (): Promise<Destination[]> => {
      const { data } = await api.get<Destination[]>('/favorites');
      return data;
    },
    enabled,
  });
}

/**
 * Toggles a saved stay with an optimistic cache update, so the heart fills the
 * instant it's tapped rather than after a network round trip.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      saved,
    }: {
      id: number;
      /** The state to move *to*. */
      saved: boolean;
    }): Promise<number[]> => {
      const { data } = saved
        ? await api.put<{ ids: number[] }>(`/favorites/${id}`)
        : await api.delete<{ ids: number[] }>(`/favorites/${id}`);
      return data.ids;
    },

    onMutate: async ({ id, saved }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favoriteIds });
      const previous = queryClient.getQueryData<number[]>(queryKeys.favoriteIds) ?? [];

      queryClient.setQueryData<number[]>(
        queryKeys.favoriteIds,
        saved ? [...previous, id] : previous.filter((favoriteId) => favoriteId !== id),
      );

      // Returned as context so onError can roll the cache back.
      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.favoriteIds, context.previous);
      }
    },

    onSuccess: (ids) => {
      queryClient.setQueryData(queryKeys.favoriteIds, ids);
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Trips                                                                      */
/* -------------------------------------------------------------------------- */

export interface CreateTripInput {
  destinationId: number;
  /** ISO 8601. */
  checkIn: string;
  checkOut: string;
  guests: number;
}

export function useTrips(enabled = true) {
  return useQuery({
    queryKey: queryKeys.trips,
    queryFn: async (): Promise<Trip[]> => {
      const { data } = await api.get<Trip[]>('/trips');
      return data;
    },
    enabled,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTripInput): Promise<Trip> => {
      const { data } = await api.post<Trip>('/trips', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips });
    },
  });
}

export function useCancelTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripId: string): Promise<Trip> => {
      const { data } = await api.delete<Trip>(`/trips/${tripId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Auth-adjacent                                                              */
/* -------------------------------------------------------------------------- */

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string): Promise<string> => {
      const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email });
      return data.message;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const { data } = await api.post<{ message: string }>('/auth/reset-password', {
        token,
        password,
      });
      return data.message;
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

/** Backed by a real endpoint — the form used to fake success with a setTimeout. */
export function useSendContactMessage() {
  return useMutation({
    mutationFn: async (input: ContactInput): Promise<void> => {
      await api.post('/contact', input);
    },
  });
}
