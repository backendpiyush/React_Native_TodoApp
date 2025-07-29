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
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Field-specific errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Validation functions
  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
    return "";
  };
  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  // Live validation on change
  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailError(validateEmail(val));
  };
  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setPasswordError(validatePassword(val));
  };

  const handleLogin = async () => {
    setFormError('');
    const eError = validateEmail(email);
    const pError = validatePassword(password);
    setEmailError(eError);
    setPasswordError(pError);

    if (eError || pError) return;

    setLoading(true);
    try {
      await signInUser(email, password);
      router.replace('/');
    } catch (error: any) {
      // Show error at the top if it's not field-specific
      if(error.code === 'auth/user-not-found') {
        setFormError('No user found with this email.');
      } else if(error.code === 'auth/wrong-password') {
        setFormError('Incorrect password. Please try again.');
      }
        // If the error is related to email, show it in the email field
        if (error.code === 'auth/invalid-email') {
          setEmailError('Invalid email address.');
        } else if (error.code === 'auth/too-many-requests') {
          setFormError('Too many login attempts. Please try again later.');
        } else if (error.code === 'auth/network-request-failed') {
          setFormError('Network error. Please check your connection.');
        } else if (error.code === 'auth/invalid-credential') {
          // Otherwise, show a generic error message
          setFormError('invalid credentials. Please try again.');
        }
          // If the error is related to email, show it in the email field
        
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setEmailError('Enter your email to reset password');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email to reset password');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setFormError('Password reset email sent!');
    } catch (error: any) {
      setFormError(error.message || 'Failed to send reset email');
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
        onChangeText={handleEmailChange}
        autoCapitalize="none"
        style={{
          backgroundColor: '#232323',
          color: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 4,
        }}
      />
      {emailError ? <Text style={{ color: '#ff5252', marginBottom: 8 }}>{emailError}</Text> : null}
      <View style={{ position: 'relative', marginBottom: 4 }}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry={!showPassword}
          style={{
            backgroundColor: '#232323',
            color: '#fff',
            borderRadius: 8,
            padding: 12,
            paddingRight: 44, // space for icon
          }}
        />
        {formError ? <Text style={{ color: '#ff5252', marginBottom: 12, textAlign: 'center' }}>{formError}</Text> : null}
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={{ position: 'absolute', right: 12, top: 12 }}
        >
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#aaa" />
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={{ color: '#ff5252', marginBottom: 8 }}>{passwordError}</Text> : null}
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
