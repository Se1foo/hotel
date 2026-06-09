import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Deal, Destination } from '../types';
import axiosApi from './axios';

export const fetchDeals = async (): Promise<Deal[]> => {
  const response = await fetch('/api/deals');
  if (!response.ok) {
    throw new Error('Failed to fetch deals');
  }
  return response.json();
};

export const fetchDestinations = async (): Promise<Destination[]> => {
  const response = await fetch('/api/explore');
  if (!response.ok) {
    throw new Error('Failed to fetch destinations');
  }
  return response.json();
};

export const useDeals = () => {
  return useQuery({
    queryKey: ['deals'],
    queryFn: fetchDeals,
  });
};

export const useDestinations = () => {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: fetchDestinations,
  });
};

export const fetchDestinationById = async (id: string): Promise<Destination> => {
  const response = await fetch(`/api/explore/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch destination');
  }
  return response.json();
};

export const useDestination = (id?: string) => {
  return useQuery({
    queryKey: ['destination', id],
    queryFn: () => fetchDestinationById(id!),
    enabled: !!id,
    retry: false,
  });
};

export const rateDestination = async ({ id, rating }: { id: string, rating: number }): Promise<Destination> => {
  const response = await axiosApi.post(`/explore/${id}/rate`, { rating });
  return response.data;
};

export const useRateDestination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rateDestination,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['destination', data.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
    },
  });
};


import type { Trip } from '../types';

export const fetchTrips = async (): Promise<Trip[]> => {
  const response = await axiosApi.get('/trips');
  return response.data;
};

export const useTrips = (isAuthenticated: boolean) => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: fetchTrips,
    enabled: isAuthenticated, // Only fetch if user is logged in
  });
};
