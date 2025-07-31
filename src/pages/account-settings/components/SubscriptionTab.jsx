import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SubscriptionTab = () => {
  const [currentTier, setCurrentTier] = useState('free');
  const [showBillingHistory, setShowBillingHistory] = useState(false);

  const usageStats = {
    executions: { used: 247, limit: 500 },
    storage: { used: 15, limit: 50 }, // MB
    languages: { used: 12, limit: 15 }
  };

  const billingHistory = [
    {
      id: 1,
      date: '2024-07-01',
      amount: 9.99,
      status: 'paid',
      plan: 'Premium Monthly',
      invoice: 'INV-2024-001'
    },
    {
      id: 2,
      date: '2024-06-01',
      amount: 9.99,
      status: 'paid',
      plan: 'Premium Monthly',
      invoice: 'INV-2024-002'
    },
    {
      id: 3,
      date: '2024-05-01',
      amount: 9.99,
      status: 'paid',
      plan: 'Premium Monthly',
      invoice: 'INV-2024-003'
    }
  ];

  const features = {
    free: [
      'Up to 500 code executions per month',
      'Access to 15 programming languages',
      '50MB code storage',
      'Basic syntax highlighting',
      'Community support',
      'Ad-supported experience'
    ],
    premium: [
      'Unlimited code executions',
      'Access to all 25+ programming languages',
      '5GB code storage',
      'Advanced syntax highlighting & IntelliSense',
      'Priority support',
      'Ad-free experience',
      'Private code execution',
      'Enhanced compilation speed',
      'Code collaboration features',
      'Export & sharing capabilities'
    ]
  };

  const getUsagePercentage = (used, limit) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 70) return 'text-warning';
    return 'text-accent';
  };

  const handleUpgrade = () => {
    console.log('Redirecting to upgrade flow...');
    // In real app, would redirect to payment flow
  };

  const handleDowngrade = () => {
    console.log('Initiating downgrade process...');
    // In real app, would show confirmation modal
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Current Plan</h3>
            <p className="text-muted-foreground">Manage your subscription and billing</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            currentTier === 'premium' ?'bg-primary/10 text-primary border border-primary/20' :'bg-muted text-muted-foreground border border-border'
          }`}>
            {currentTier === 'premium' ? 'Premium' : 'Free Tier'}
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-foreground">Usage This Month</h4>
          
          {/* Code Executions */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Code Executions</span>
              <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usageStats.executions.used, usageStats.executions.limit))}`}>
                {usageStats.executions.used} / {currentTier === 'premium' ? '∞' : usageStats.executions.limit}
              </span>
            </div>
            {currentTier === 'free' && (
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getUsagePercentage(usageStats.executions.used, usageStats.executions.limit) >= 90 
                      ? 'bg-error' 
                      : getUsagePercentage(usageStats.executions.used, usageStats.executions.limit) >= 70 
                        ? 'bg-warning' :'bg-accent'
                  }`}
                  style={{ width: `${getUsagePercentage(usageStats.executions.used, usageStats.executions.limit)}%` }}
                />
              </div>
            )}
          </div>

          {/* Storage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Code Storage</span>
              <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usageStats.storage.used, currentTier === 'premium' ? 5000 : usageStats.storage.limit))}`}>
                {usageStats.storage.used}MB / {currentTier === 'premium' ? '5GB' : `${usageStats.storage.limit}MB`}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 bg-accent rounded-full transition-all duration-300"
                style={{ width: `${getUsagePercentage(usageStats.storage.used, currentTier === 'premium' ? 5000 : usageStats.storage.limit)}%` }}
              />
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Languages Available</span>
              <span className="text-sm font-medium text-foreground">
                {currentTier === 'premium' ? '25+' : `${usageStats.languages.used}/${usageStats.languages.limit}`}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {currentTier === 'free' ? (
            <Button
              variant="default"
              onClick={handleUpgrade}
              iconName="Zap"
              iconPosition="left"
              className="flex-1"
            >
              Upgrade to Premium
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleDowngrade}
                iconName="ArrowDown"
                iconPosition="left"
              >
                Downgrade Plan
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowBillingHistory(!showBillingHistory)}
                iconName="Receipt"
                iconPosition="left"
              >
                Billing History
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Plan Features</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            currentTier === 'free' ?'border-primary bg-primary/5' :'border-border bg-muted/30'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-foreground">Free</h4>
              <span className="text-2xl font-bold text-foreground">$0</span>
            </div>
            <ul className="space-y-2">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Icon name="Check" size={16} color="var(--color-accent)" className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Plan */}
          <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            currentTier === 'premium' ?'border-primary bg-primary/5' :'border-border bg-muted/30'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-foreground">Premium</h4>
              <div className="text-right">
                <span className="text-2xl font-bold text-foreground">$9.99</span>
                <span className="text-sm text-muted-foreground block">/month</span>
              </div>
            </div>
            <ul className="space-y-2">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Icon name="Check" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Billing History */}
      {currentTier === 'premium' && showBillingHistory && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Billing History</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Plan</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border/50">
                    <td className="py-3 px-2 text-sm text-foreground">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-3 px-2 text-sm text-foreground">
                      {transaction.plan}
                    </td>
                    <td className="py-3 px-2 text-sm text-foreground font-medium">
                      ${transaction.amount}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'paid' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                      }`}>
                        {transaction.status === 'paid' ? 'Paid' : 'Failed'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Download"
                        iconPosition="left"
                      >
                        {transaction.invoice}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTab;