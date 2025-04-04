import ProfileScreen from '@/screens/profile';
import { Stack } from 'expo-router';

export default function Profile() {

    return (
        <>
        <Stack.Screen 
        options={{ 
            headerShown: false,
            headerBackVisible: false, 
        }} 
        />
        <ProfileScreen/>
         </>
    )
}

