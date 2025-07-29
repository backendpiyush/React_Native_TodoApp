import { signUpUser } from '@/utils/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [mobile, setMobile] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      await signUpUser(email, password, name, age, mobile);
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
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: '#232323',
          color: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />
       <TextInput
        placeholder="Age"
        placeholderTextColor="#aaa"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{
          backgroundColor: '#232323',
          color: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />
       <TextInput
        placeholder="Mobile Number"
        placeholderTextColor="#aaa"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        style={{
          backgroundColor: '#232323',
          color: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />
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
      {/* Password field */}
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
            paddingRight: 44,
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={{ position: 'absolute', right: 12, top: 12 }}
        >
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password field */}
      <View style={{ position: 'relative', marginBottom: 16 }}>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={{
            backgroundColor: '#232323',
            color: '#fff',
            borderRadius: 8,
            padding: 12,
            paddingRight: 44,
          }}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword((prev) => !prev)}
          style={{ position: 'absolute', right: 12, top: 12 }}
        >
          <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#aaa" />
        </TouchableOpacity>
      </View>
      {confirmPassword.length > 0 && password !== confirmPassword && (
        <Text style={{ color: '#ff5252', marginBottom: 8 }}>
          Passwords do not match
        </Text>
      )}
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
