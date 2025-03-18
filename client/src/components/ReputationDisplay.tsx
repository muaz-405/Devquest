import { useQuery } from '@tanstack/react-query';
import { Loader2, BarChart3, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ReputationDisplayProps = {
  userId: number;
};

export default function ReputationDisplay({ userId }: ReputationDisplayProps) {
  const { data: repData, isLoading: isRepLoading } = useQuery({
    queryKey: [`/api/users/${userId}/reputation`],
    enabled: !!userId,
  });

  const { data: topUsers, isLoading: isTopLoading } = useQuery({
    queryKey: ['/api/users/top'],
  });

  if (isRepLoading || isTopLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Find user's rank among top users if available
  let userRank = -1;
  if (topUsers && Array.isArray(topUsers)) {
    userRank = topUsers.findIndex(user => user.id === userId) + 1;
  }

  // Define reputation levels
  const repLevels = [
    { name: 'Newcomer', minRep: 0, maxRep: 9 },
    { name: 'Contributor', minRep: 10, maxRep: 49 },
    { name: 'Trusted', minRep: 50, maxRep: 99 },
    { name: 'Expert', minRep: 100, maxRep: 249 },
    { name: 'Master', minRep: 250, maxRep: 499 },
    { name: 'Legend', minRep: 500, maxRep: Infinity }
  ];

  // Find current level based on reputation
  const reputation = repData?.reputation || 0;
  const currentLevel = repLevels.find(level => 
    reputation >= level.minRep && reputation <= level.maxRep
  ) || repLevels[0];
  
  // Calculate progress to next level
  const isMaxLevel = currentLevel === repLevels[repLevels.length - 1];
  const nextLevel = isMaxLevel ? null : repLevels[repLevels.indexOf(currentLevel) + 1];
  
  const progressToNextLevel = isMaxLevel 
    ? 100 
    : nextLevel 
      ? Math.round(((reputation - currentLevel.minRep) / (nextLevel.minRep - currentLevel.minRep)) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span>Reputation: {reputation} points</span>
          </CardTitle>
          <CardDescription>
            Your community standing based on participation and contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium">{currentLevel.name}</span>
                {nextLevel && (
                  <span className="text-muted-foreground">
                    {reputation}/{nextLevel.minRep} to {nextLevel.name}
                  </span>
                )}
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
            </div>
            
            {userRank > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Your rank: #{userRank} {userRank === 1 ? '🏆' : ''} 
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {userRank === 1 
                    ? 'Congratulations! You are the top contributor!'
                    : `Keep contributing to improve your position among the top users`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}