import { signInUser } from '@/utils/auth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig'; // adjust path if needed

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      await signInUser(email, password);
      router.replace('/');
    } catch (error: any) {
      setError(error.message || 'Login failed');
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Enter your email to reset password');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError('Password reset email sent!');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#181818', justifyContent: 'center', padding: 24 }}>
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
        Sign In
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
      <View style={{ position: 'relative', marginBottom: 16 }}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={{
            backgroundColor: '#232323',
            color: '#fff',
            borderRadius: 8,
            padding: 12,
            paddingRight: 44, // space for icon
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={{ position: 'absolute', right: 12, top: 12 }}
        >
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#aaa" />
        </TouchableOpacity>
      </View>
      {error ? <Text style={{ color: '#ff5252', marginBottom: 12 }}>{error}</Text> : null}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: '#00adf5',
          padding: 14,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 16,
        }}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Login</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('./sign-up')}>
        <Text style={{ color: '#00adf5', textAlign: 'center' }}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPassword} style={{ marginBottom: 12 }}>
        <Text style={{ color: '#00adf5', textAlign: 'center' }}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}
