import { Redirect } from 'expo-router';
import { useAuth } from '@/firebase/AuthContext';
import PreLoginPage from '../intro/PreLoginPage';
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import "expo-router/entry";

export default function Page() {
  const { slug } = useLocalSearchParams();
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/tabs" />;
  }

  return <PreLoginPage />;
}