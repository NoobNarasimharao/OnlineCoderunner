import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

import Icon from '../../../components/AppIcon';

const SecurityTab = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const activeSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, US',
      lastActive: '2024-07-31T08:00:00Z',
      current: true,
      ip: '192.168.1.100'
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, US',
      lastActive: '2024-07-30T15:30:00Z',
      current: false,
      ip: '192.168.1.101'
    },
    {
      id: 3,
      device: 'Firefox on MacOS',
      location: 'Boston, US',
      lastActive: '2024-07-29T09:15:00Z',
      current: false,
      ip: '10.0.0.50'
    }
  ];

  const securityEvents = [
    {
      id: 1,
      type: 'login',
      description: 'Successful login from Chrome on Windows',
      timestamp: '2024-07-31T08:00:00Z',
      location: 'New York, US',
      status: 'success'
    },
    {
      id: 2,
      type: 'password_change',
      description: 'Password changed successfully',
      timestamp: '2024-07-28T14:22:00Z',
      location: 'New York, US',
      status: 'success'
    },
    {
      id: 3,
      type: 'failed_login',
      description: 'Failed login attempt',
      timestamp: '2024-07-25T11:45:00Z',
      location: 'Unknown Location',
      status: 'warning'
    }
  ];

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear errors when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePassword()) return;

    setIsChangingPassword(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsChangingPassword(false);
    setPasswordSuccess(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleEnable2FA = () => {
    if (!twoFactorEnabled) {
      setShowQRCode(true);
      // Generate backup codes
      const codes = Array.from({ length: 8 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      setBackupCodes(codes);
    }
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleRevokeSession = (sessionId) => {
    console.log('Revoking session:', sessionId);
    // In real app, would make API call to revoke session
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'login': return 'LogIn';
      case 'password_change': return 'Key';
      case 'failed_login': return 'AlertTriangle';
      default: return 'Info';
    }
  };

  const getEventColor = (status) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Success Message */}
      {passwordSuccess && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3">
          <Icon name="CheckCircle" size={20} color="var(--color-success)" />
          <span className="text-success font-medium">Password changed successfully!</span>
        </div>
      )}

      {/* Change Password */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Change Password</h3>
        
        <div className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
            error={passwordErrors.currentPassword}
            required
          />

          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            error={passwordErrors.newPassword}
            description="Must be at least 8 characters with uppercase, lowercase, and number"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            error={passwordErrors.confirmPassword}
            required
          />

          <Button
            variant="default"
            onClick={handlePasswordSubmit}
            loading={isChangingPassword}
            iconName="Key"
            iconPosition="left"
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
            <p className="text-muted-foreground">Add an extra layer of security to your account</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            twoFactorEnabled 
              ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
          }`}>
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        {!twoFactorEnabled ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Shield" size={20} color="var(--color-primary)" className="mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">Secure Your Account</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Two-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password.
                  </p>
                  <Button
                    variant="default"
                    onClick={handleEnable2FA}
                    iconName="Shield"
                    iconPosition="left"
                  >
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {showQRCode && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-3">Setup Authenticator App</h4>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-white border-2 border-border rounded-lg flex items-center justify-center">
                      <span className="text-xs text-muted-foreground text-center">QR Code\nPlaceholder</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-3">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="p-3 bg-card border border-border rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Manual entry key:</p>
                      <code className="text-sm font-mono text-foreground">JBSWY3DPEHPK3PXP</code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {backupCodes.length > 0 && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <h4 className="font-medium text-foreground mb-3 flex items-center">
                  <Icon name="AlertTriangle" size={16} className="mr-2" color="var(--color-warning)" />
                  Backup Codes
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {backupCodes.map((code, index) => (
                    <code key={index} className="text-sm font-mono bg-card border border-border rounded px-2 py-1">
                      {code}
                    </code>
                  ))}
                </div>
                <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
                  Download Codes
                </Button>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowQRCode(!showQRCode)}
                iconName="QrCode"
                iconPosition="left"
              >
                {showQRCode ? 'Hide' : 'Show'} QR Code
              </Button>
              <Button
                variant="destructive"
                onClick={handleEnable2FA}
                iconName="ShieldOff"
                iconPosition="left"
              >
                Disable 2FA
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Active Sessions</h3>
        
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Monitor" size={20} color="var(--color-primary)" className="mt-0.5" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground">{session.device}</h4>
                    {session.current && (
                      <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{session.location}</p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {formatTimestamp(session.lastActive)} • IP: {session.ip}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                  iconName="X"
                  iconPosition="left"
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="destructive"
            iconName="LogOut"
            iconPosition="left"
          >
            Sign Out All Other Sessions
          </Button>
        </div>
      </div>

      {/* Security Events */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Recent Security Events</h3>
        
        <div className="space-y-3">
          {securityEvents.map((event) => (
            <div key={event.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon 
                name={getEventIcon(event.type)} 
                size={16} 
                className={`mt-0.5 ${getEventColor(event.status)}`}
              />
              <div className="flex-1">
                <p className="text-sm text-foreground">{event.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(event.timestamp)} • {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="ghost" iconName="Eye" iconPosition="left">
            View All Security Events
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;