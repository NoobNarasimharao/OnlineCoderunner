import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: 'FileCode',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'This Month',
      value: stats.thisMonth,
      icon: 'Calendar',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Storage Used',
      value: stats.storageUsed,
      icon: 'HardDrive',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {card.value}
              </p>
            </div>
            <div className={`${card.bgColor} ${card.color} p-3 rounded-lg`}>
              <Icon name={card.icon} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;