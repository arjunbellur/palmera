import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

// Zod schemas for API validation
const ExperienceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  duration: z.number(),
  maxParticipants: z.number(),
  price: z.number(),
  location: z.string(),
  requirements: z.string().optional(),
  images: z.array(z.string()),
  providerId: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const CreateExperienceSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  duration: z.number(),
  maxParticipants: z.number(),
  price: z.number(),
  location: z.string(),
  requirements: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;
export type CreateExperienceData = z.infer<typeof CreateExperienceSchema>;

// API functions
const fetchExperiences = async (): Promise<Experience[]> => {
  const response = await fetch('/api/experiences');
  if (!response.ok) {
    throw new Error('Failed to fetch experiences');
  }
  const data = await response.json();
  return z.array(ExperienceSchema).parse(data);
};

const createExperience = async (data: CreateExperienceData): Promise<Experience> => {
  const response = await fetch('/api/experiences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create experience');
  }
  const result = await response.json();
  return ExperienceSchema.parse(result);
};

const updateExperience = async ({ id, ...data }: { id: string } & Partial<CreateExperienceData>): Promise<Experience> => {
  const response = await fetch(`/api/experiences/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update experience');
  }
  const result = await response.json();
  return ExperienceSchema.parse(result);
};

// React Query hooks
export const useExperiences = () => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: fetchExperiences,
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
};
