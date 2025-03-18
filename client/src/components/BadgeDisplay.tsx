import { useState } from 'react';
import { Badge as BadgeType } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Award, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type BadgeItemProps = {
  badge: any;
  userId: number;
  editable?: boolean;
  onToggleDisplay?: (badgeId: number, display: boolean) => void;
};

const BadgeItem = ({ badge, userId, editable = false, onToggleDisplay }: BadgeItemProps) => {
  const getBadgeVariant = (level: number) => {
    switch (level) {
      case 1: return 'outline';
      case 2: return 'secondary';
      case 3: return 'default';
      default: return 'outline';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">{badge.badge.icon}</span> {badge.badge.name}
            <Badge variant={getBadgeVariant(badge.badge.level)}>
              {['Bronze', 'Silver', 'Gold'][badge.badge.level - 1]}
            </Badge>
          </CardTitle>
          {editable && (
            <div className="flex items-center space-x-2">
              <Switch 
                id={`display-badge-${badge.badge.id}`}
                checked={badge.displayOnProfile}
                onCheckedChange={(checked) => {
                  if (onToggleDisplay) {
                    onToggleDisplay(badge.badge.id, checked);
                  }
                }}
              />
              <Label htmlFor={`display-badge-${badge.badge.id}`} className="text-xs">Display</Label>
            </div>
          )}
        </div>
        <CardDescription className="text-sm">
          {badge.badge.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <div className="text-xs text-muted-foreground">
          <p>Category: {badge.badge.category}</p>
          <p>Earned on: {new Date(badge.earnedAt).toLocaleDateString()}</p>
          <p>+{badge.badge.reputationPoints} reputation points</p>
        </div>
      </CardContent>
    </Card>
  );
};

type BadgeDisplayProps = {
  userId: number;
  editable?: boolean;
};

export default function BadgeDisplay({ userId, editable = false }: BadgeDisplayProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  
  const {
    data: badges,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`/api/users/${userId}/badges`],
    enabled: !!userId,
  });

  const toggleDisplayMutation = useMutation({
    mutationFn: async ({ badgeId, display }: { badgeId: number; display: boolean }) => {
      await apiRequest('PUT', `/api/users/${userId}/badges/${badgeId}/display`, { display });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/badges`] });
      toast({
        title: 'Badge updated',
        description: 'Your badge display preferences have been updated',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating badge',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleToggleDisplay = (badgeId: number, display: boolean) => {
    toggleDisplayMutation.mutate({ badgeId, display });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-destructive">
        <p>Error loading badges</p>
      </div>
    );
  }

  if (!badges || badges.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <Award className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
        <h3 className="text-lg font-medium">No Badges Yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Participate in discussions and contribute to the community to earn badges!
        </p>
      </div>
    );
  }

  // Group badges by category for easier filtering
  const badgesByCategory: Record<string, any[]> = {};
  badges.forEach((badge: any) => {
    const category = badge.badge.category;
    if (!badgesByCategory[category]) {
      badgesByCategory[category] = [];
    }
    badgesByCategory[category].push(badge);
  });

  // Get displayed badges - used for primary view
  const displayedBadges = badges.filter((badge: any) => badge.displayOnProfile);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="displayed">Displayed</TabsTrigger>
          <TabsTrigger value="all">All Badges</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>
        
        <TabsContent value="displayed" className="pt-4">
          {displayedBadges.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              <p>No badges selected for display</p>
              {editable && (
                <p className="text-sm mt-2">
                  Toggle the display switch on badges you want to showcase on your profile
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedBadges.map((badge: any) => (
                <BadgeItem 
                  key={badge.badge.id} 
                  badge={badge} 
                  userId={userId}
                  editable={editable}
                  onToggleDisplay={handleToggleDisplay}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge: any) => (
              <BadgeItem 
                key={badge.badge.id} 
                badge={badge} 
                userId={userId}
                editable={editable}
                onToggleDisplay={handleToggleDisplay}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="pt-4">
          <div className="space-y-6">
            {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-lg font-semibold capitalize">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryBadges.map((badge: any) => (
                    <BadgeItem 
                      key={badge.badge.id} 
                      badge={badge} 
                      userId={userId}
                      editable={editable}
                      onToggleDisplay={handleToggleDisplay}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}