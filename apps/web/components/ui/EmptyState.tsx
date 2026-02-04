'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action,
}) => {
  const ActionButton = action?.href ? (
    <Button asChild>
      <Link href={action.href}>{action.label}</Link>
    </Button>
  ) : action?.onClick ? (
    <Button onClick={action.onClick}>{action.label}</Button>
  ) : null;

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        {Icon && (
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {ActionButton && (
        <CardContent className="flex justify-center">
          {ActionButton}
        </CardContent>
      )}
    </Card>
  );
};

