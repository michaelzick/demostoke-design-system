import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DesignSystemProfileForm } from '@/components/profile/DesignSystemProfileForm';

export default function Profile() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your design system profile and preferences
            </p>
          </div>
          
          <DesignSystemProfileForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}