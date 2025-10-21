import { Layout } from '@/components/Layout';
import { useWorkTrackerState } from '@/hooks/useWorkTrackerState';
import { useState } from 'react';

export default function Calendar() {
  const { state } = useWorkTrackerState();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isGoalCompletedOnDate = (goalId: string, dateStr: string) => {
    const goal = state.goals.find(g => g.id === goalId);
    return goal?.completedDates.includes(dateStr) || false;
  };

  const getCompletionRateForDate = (dateStr: string) => {
    const completedCount = state.goals.filter(g => isGoalCompletedOnDate(g.id, dateStr)).length;
    return state.goals.length > 0 ? Math.round((completedCount / state.goals.length) * 100) : 0;
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage === 0) return 'bg-muted border-border';
    if (percentage < 33) return 'bg-orange-100 border-orange-300 dark:bg-orange-900 dark:border-orange-700';
    if (percentage < 66) return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700';
    return 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900 dark:border-emerald-700';
  };

  const daysInMonth = getDaysInMonth(selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date().toISOString().split('T')[0];

  const handlePrevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const handleToday = () => {
    setSelectedMonth(new Date());
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Progress Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Visualize your consistency and track daily progress across all your goals.
          </p>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handlePrevMonth}
              className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground font-medium"
            >
              ← Previous
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">{monthName}</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleToday}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium text-sm"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground font-medium"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {emptyDays.map(i => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {days.map(day => {
              const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const percentage = getCompletionRateForDate(dateStr);
              const isToday = dateStr === today;

              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs font-semibold cursor-default transition-all ${getCompletionColor(percentage)} ${isToday ? 'ring-2 ring-primary' : ''}`}
                  title={`${day}: ${percentage}% completed`}
                >
                  <div className="text-sm text-foreground">{day}</div>
                  {percentage > 0 && (
                    <div className="text-xs text-muted-foreground">{percentage}%</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-muted border-2 border-border" />
                <span className="text-sm text-muted-foreground">No goals</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-orange-100 border-2 border-orange-300 dark:bg-orange-900 dark:border-orange-700" />
                <span className="text-sm text-muted-foreground">&lt;33%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-yellow-100 border-2 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700" />
                <span className="text-sm text-muted-foreground">33-66%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-100 border-2 border-emerald-300 dark:bg-emerald-900 dark:border-emerald-700" />
                <span className="text-sm text-muted-foreground">&gt;66%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Summary */}
        {state.goals.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Goals Tracked</h2>
            <div className="grid gap-3">
              {state.goals.map(goal => {
                const streak = state.streaks[goal.id];
                return (
                  <div key={goal.id} className="flex items-center justify-between pb-3 border-b border-border last:border-b-0">
                    <div>
                      <p className="font-medium text-foreground">{goal.title}</p>
                      <p className="text-sm text-muted-foreground">{goal.completedDates.length} times completed</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">🔥 {streak?.currentStreak || 0}</span>
                      <span className="text-muted-foreground">🏆 {streak?.longestStreak || 0}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {state.goals.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No goals to track yet</h3>
            <p className="text-muted-foreground">
              Create goals to start seeing your progress on the calendar.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
