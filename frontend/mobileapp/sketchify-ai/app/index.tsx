import { Redirect } from 'expo-router';
import { useAuth } from '@/firebase/AuthContext';
import { View } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={{ flex: 1 }} />;
  }

  // If no user is logged in, redirect to pre-login page
  if (!user) {
    return <Redirect href="/intro/PreLoginPage" />;
  }

  return <Redirect href="/home" />;
}