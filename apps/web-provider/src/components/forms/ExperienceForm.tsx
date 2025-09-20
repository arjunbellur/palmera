import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, FormTextField, FormSelect, Card } from '@palmera/ui';

const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  duration: z.number().min(1, 'Duration must be at least 1 hour'),
  maxParticipants: z.number().min(1, 'Must allow at least 1 participant'),
  price: z.number().min(0, 'Price cannot be negative'),
  location: z.string().min(1, 'Location is required'),
  requirements: z.string().optional(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

const categories = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'culinary', label: 'Culinary' },
  { value: 'nature', label: 'Nature' },
  { value: 'wellness', label: 'Wellness' },
];

export const ExperienceForm: React.FC = () => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      duration: 2,
      maxParticipants: 10,
      price: 0,
    },
  });

  const onSubmit = async (data: ExperienceFormData) => {
    console.log('Experience data:', data);
    // Handle form submission
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-midnight-900 mb-6">Create New Experience</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormTextField
          name="title"
          label="Experience Title"
          placeholder="Enter a compelling title"
          error={errors.title?.message}
        />

        <FormTextField
          name="description"
          label="Description"
          type="textarea"
          placeholder="Describe your experience in detail..."
          error={errors.description?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            name="category"
            label="Category"
            options={categories}
            placeholder="Select category"
            error={errors.category?.message}
          />
          
          <FormTextField
            name="duration"
            label="Duration (hours)"
            type="number"
            min={1}
            max={24}
            error={errors.duration?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormTextField
            name="maxParticipants"
            label="Max Participants"
            type="number"
            min={1}
            max={100}
            error={errors.maxParticipants?.message}
          />
          
          <FormTextField
            name="price"
            label="Price (USD)"
            type="number"
            min={0}
            step="0.01"
            error={errors.price?.message}
          />
        </div>

        <FormTextField
          name="location"
          label="Location"
          placeholder="Where does this experience take place?"
          error={errors.location?.message}
        />

        <FormTextField
          name="requirements"
          label="Requirements"
          type="textarea"
          placeholder="Any special requirements or what to bring..."
          error={errors.requirements?.message}
        />

        <Button
          onPress={() => handleSubmit(onSubmit)()}
          style={{ width: '100%', opacity: isSubmitting ? 0.6 : 1 }}
        >
          {isSubmitting ? 'Creating...' : 'Create Experience'}
        </Button>
      </form>
    </Card>
  );
};
