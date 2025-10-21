import { Layout } from '@/components/Layout';
import { useWorkTrackerState } from '@/hooks/useWorkTrackerState';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { EffortLevel } from '@shared/types';
import { useNavigate } from 'react-router-dom';

export default function Goals() {
  const { state, addGoal, deleteGoal } = useWorkTrackerState();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    effort: 'medium' as EffortLevel,
    frequency: 'daily' as 'once' | 'daily' | 'weekly',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addGoal({
      title: formData.title,
      description: formData.description,
      effort: formData.effort,
      frequency: formData.frequency,
    });

    setFormData({
      title: '',
      description: '',
      effort: 'medium',
      frequency: 'daily',
    });
    setIsFormOpen(false);
  };

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

  const getFrequencyEmoji = (freq: string) => {
    switch (freq) {
      case 'once':
        return '1️⃣';
      case 'daily':
        return '📅';
      case 'weekly':
        return '📆';
      default:
        return '⏰';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Goals</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your goals. Track your progress towards your objectives.
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(!isFormOpen)}
            variant="default"
          >
            {isFormOpen ? '✕ Cancel' : '+ New Goal'}
          </Button>
        </div>

        {/* Goal Creation Form */}
        {isFormOpen && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Create a New Goal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Morning Meditation"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add details about this goal..."
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Effort Level
                  </label>
                  <select
                    value={formData.effort}
                    onChange={(e) => setFormData({ ...formData, effort: e.target.value as EffortLevel })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" variant="default">
                  Create Goal
                </Button>
                <Button type="button" onClick={() => setIsFormOpen(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Goals List */}
        {state.goals.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No goals created yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by creating your first goal to begin tracking your progress.
            </p>
            <Button onClick={() => setIsFormOpen(true)}>Create Your First Goal</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {state.goals.map(goal => {
              const streak = state.streaks[goal.id];
              return (
                <div
                  key={goal.id}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">{goal.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getEffortColor(goal.effort)}`}>
                          {getEffortEmoji(goal.effort)} {goal.effort}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                          {getFrequencyEmoji(goal.frequency)} {goal.frequency}
                        </span>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                      )}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>🔥 {streak?.currentStreak || 0} day streak</span>
                        <span>🏆 {streak?.longestStreak || 0} best</span>
                        <span>✅ {goal.completedDates.length} times completed</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => deleteGoal(goal.id)}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
