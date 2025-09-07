import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { designSystemProfileService, DesignSystemProfile } from '@/services/designSystemProfileService';
import { Loader2, User, Building, Globe, Github, Dribbble } from 'lucide-react';

const profileSchema = z.object({
  display_name: z.string().min(1, 'Display name is required').max(100),
  bio: z.string().max(500).optional(),
  company: z.string().max(100).optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  dribbble_url: z.string().url().optional().or(z.literal(''))
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function DesignSystemProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<DesignSystemProfile | null>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: '',
      bio: '',
      company: '',
      website_url: '',
      github_url: '',
      dribbble_url: ''
    }
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const currentProfile = await designSystemProfileService.getCurrentProfile();
      if (currentProfile) {
        setProfile(currentProfile);
        form.reset({
          display_name: currentProfile.display_name || '',
          bio: currentProfile.bio || '',
          company: currentProfile.company || '',
          website_url: currentProfile.website_url || '',
          github_url: currentProfile.github_url || '',
          dribbble_url: currentProfile.dribbble_url || ''
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const updates = {
        ...data,
        website_url: data.website_url || null,
        github_url: data.github_url || null,
        dribbble_url: data.dribbble_url || null,
        bio: data.bio || null,
        company: data.company || null
      };

      const success = await designSystemProfileService.updateProfile(updates);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully'
        });
        loadProfile(); // Reload to get updated data
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Design System Profile
        </CardTitle>
        <CardDescription>
          Manage your design system profile information and social links
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name *</Label>
            <Input
              id="display_name"
              {...form.register('display_name')}
              placeholder="Your display name"
            />
            {form.formState.errors.display_name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.display_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...form.register('bio')}
              placeholder="Tell us about yourself and your design philosophy..."
              rows={3}
            />
            {form.formState.errors.bio && (
              <p className="text-sm text-destructive">
                {form.formState.errors.bio.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Company
            </Label>
            <Input
              id="company"
              {...form.register('company')}
              placeholder="Your company or organization"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website URL
            </Label>
            <Input
              id="website_url"
              {...form.register('website_url')}
              placeholder="https://yourwebsite.com"
              type="url"
            />
            {form.formState.errors.website_url && (
              <p className="text-sm text-destructive">
                {form.formState.errors.website_url.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub URL
            </Label>
            <Input
              id="github_url"
              {...form.register('github_url')}
              placeholder="https://github.com/yourusername"
              type="url"
            />
            {form.formState.errors.github_url && (
              <p className="text-sm text-destructive">
                {form.formState.errors.github_url.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dribbble_url" className="flex items-center gap-2">
              <Dribbble className="h-4 w-4" />
              Dribbble URL
            </Label>
            <Input
              id="dribbble_url"
              {...form.register('dribbble_url')}
              placeholder="https://dribbble.com/yourusername"
              type="url"
            />
            {form.formState.errors.dribbble_url && (
              <p className="text-sm text-destructive">
                {form.formState.errors.dribbble_url.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}