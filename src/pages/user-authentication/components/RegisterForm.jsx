import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const RegisterForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    emailConsent: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Successful registration
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userTier', 'free');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('username', formData.username);
      onSuccess();
      navigate('/code-editor-workspace');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        type="text"
        name="username"
        placeholder="Choose a username"
        value={formData.username}
        onChange={handleInputChange}
        error={errors.username}
        description="3+ characters, letters, numbers, and underscores only"
        required
      />
      
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
      />
      
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Create a strong password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        description="8+ characters with uppercase, lowercase, and number"
        required
      />
      
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        error={errors.confirmPassword}
        required
      />
      
      <div className="space-y-3 pt-2">
        <Checkbox
          label="I accept the Terms of Service and Privacy Policy"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleInputChange}
          error={errors.acceptTerms}
          required
        />
        
        <Checkbox
          label="Send me product updates and coding tips via email"
          name="emailConsent"
          checked={formData.emailConsent}
          onChange={handleInputChange}
          description="Optional - you can unsubscribe anytime"
        />
      </div>
      
      <Button
        type="submit"
        variant="default"
        loading={isLoading}
        fullWidth
        className="mt-6"
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;