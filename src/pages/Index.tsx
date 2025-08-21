import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import MainApp from '@/components/MainApp';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return <MainApp />;
};

export default Index;
