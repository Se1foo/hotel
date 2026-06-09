import { useQuery } from '@tanstack/react-query';
import type { Deal, Destination } from '../types';

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

import axiosApi from './axios';
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
