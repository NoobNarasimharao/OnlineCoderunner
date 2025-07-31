import React from 'react';
import Icon from '../../../components/AppIcon';

const UsageStats = ({ stats, recentSelections }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <h3 className="font-semibold text-card-foreground mb-4 flex items-center space-x-2">
        <Icon name="TrendingUp" size={20} className="text-primary" />
        <span>Usage Statistics</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Languages */}
        <div>
          <h4 className="font-medium text-card-foreground mb-3 text-sm">Most Popular</h4>
          <div className="space-y-2">
            {stats.popular.map((lang, index) => (
              <div key={lang.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-primary w-4">#{index + 1}</span>
                  <span className="text-sm text-card-foreground">{lang.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{lang.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Selections */}
        <div>
          <h4 className="font-medium text-card-foreground mb-3 text-sm">Your Recent</h4>
          <div className="space-y-2">
            {recentSelections.length > 0 ? (
              recentSelections.map((selection, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-card-foreground">{selection.language}</span>
                  <span className="text-xs text-muted-foreground">{selection.timeAgo}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                <Icon name="Clock" size={16} className="mx-auto mb-2" />
                <p>No recent activity</p>
                <p className="text-xs">Start coding to see your history</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageStats;