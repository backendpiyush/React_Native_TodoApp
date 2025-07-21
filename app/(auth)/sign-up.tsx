import { signUpUser } from '@/utils/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      await signUpUser(email, password);
      router.replace('/');
    } catch (error: any) {
      setError(error.message || 'Sign up failed');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#181818', justifyContent: 'center', padding: 24 }}>
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
        Sign Up
      </Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          backgroundColor: '#232323',
          color: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: '#232323',
          color: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />
      {error ? <Text style={{ color: '#ff5252', marginBottom: 12 }}>{error}</Text> : null}
      <TouchableOpacity
        onPress={handleSignUp}
        style={{
          backgroundColor: '#00adf5',
          padding: 14,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 16,
        }}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sign Up</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('./sign-in')}>
        <Text style={{ color: '#00adf5', textAlign: 'center' }}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
