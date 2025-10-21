import { Layout } from '@/components/Layout';
import { useWorkTrackerState } from '@/hooks/useWorkTrackerState';
import { getDailyQuote } from '@/lib/quotes';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Dashboard() {
  const { state, completeGoal } = useWorkTrackerState();
  const dailyQuote = getDailyQuote();
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());

  const today = new Date().toISOString().split('T')[0];
  const todaysGoals = state.goals;

  const handleCompleteGoal = (goalId: string) => {
    completeGoal(goalId);
    setCompletedToday(prev => new Set([...prev, goalId]));
  };

  const totalCompleted = completedToday.size;
  const completionPercentage = Math.round((totalCompleted / todaysGoals.length) * 100);

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'light':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medium':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'heavy':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortEmoji = (effort: string) => {
    switch (effort) {
      case 'light':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'heavy':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Daily Quote Section */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-border p-8 text-center">
          <div className="mb-4 text-4xl">✨</div>
          <p className="text-lg font-medium text-foreground mb-3 italic">"{dailyQuote.text}"</p>
          <p className="text-sm text-muted-foreground">— {dailyQuote.author}</p>
        </section>

        {/* Today's Progress Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Today's Progress</h3>
            <p className="text-4xl font-bold text-primary">{completionPercentage}%</p>
            <p className="text-xs text-muted-foreground mt-2">{totalCompleted} of {todaysGoals.length} goals completed</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Streak</h3>
            <p className="text-4xl font-bold text-primary">
              {todaysGoals.length > 0 && state.streaks[todaysGoals[0]?.id]
                ? state.streaks[todaysGoals[0]?.id].currentStreak
                : 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">days in a row</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Best Streak</h3>
            <p className="text-4xl font-bold text-primary">
              {todaysGoals.length > 0 && state.streaks[todaysGoals[0]?.id]
                ? state.streaks[todaysGoals[0]?.id].longestStreak
                : 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">personal record</p>
          </div>
        </section>

        {/* Goals Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Today's Goals</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Keep the momentum going. Complete your goals for today.
              </p>
            </div>
            <Link to="/goals">
              <Button variant="default">+ Add Goal</Button>
            </Link>
          </div>

          {todaysGoals.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first goal to start tracking your progress.
              </p>
              <Link to="/goals">
                <Button>Create Your First Goal</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {todaysGoals.map(goal => {
                const isCompleted = completedToday.has(goal.id);
                const streak = state.streaks[goal.id];

                return (
                  <div
                    key={goal.id}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{goal.title}</h3>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getEffortColor(goal.effort)}`}>
                            {getEffortEmoji(goal.effort)} {goal.effort}
                          </span>
                        </div>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                        )}
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>🔥 {streak?.currentStreak || 0} day streak</span>
                          <span>🏆 {streak?.longestStreak || 0} best</span>
                          <span>🎯 {goal.frequency}</span>
                        </div>
                      </div>
                      {!isCompleted && (
                        <Button
                          onClick={() => handleCompleteGoal(goal.id)}
                          variant="default"
                          className="ml-4 whitespace-nowrap"
                        >
                          Mark Complete ✓
                        </Button>
                      )}
                      {isCompleted && (
                        <div className="text-xl ml-4">✅</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
