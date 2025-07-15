import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { UserRegisterRequest, UserRole } from 'shared/types';
import { useAuth } from 'shared/hooks/useAuth';

export default function RegisterScreen() {
  const [formData, setFormData] = useState<UserRegisterRequest>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'buyer',
    phone: '',
  });
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.first_name || !formData.last_name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    try {
      await register(formData);
      Alert.alert('Success', 'Account created successfully! Please login.', [
        { text: 'OK', onPress: () => router.push('/login') }
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', 'Please try again with different credentials');
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev: UserRegisterRequest) => ({ ...prev, role }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Galactavista today</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="First Name"
                value={formData.first_name}
                onChangeText={(text) => setFormData((prev: UserRegisterRequest) => ({ ...prev, first_name: text }))}
                autoCapitalize="words"
                editable={!isLoading}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Last Name"
                value={formData.last_name}
                onChangeText={(text) => setFormData((prev: UserRegisterRequest) => ({ ...prev, last_name: text }))}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData((prev: UserRegisterRequest) => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) => setFormData((prev: UserRegisterRequest) => ({ ...prev, password: text }))}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone (optional)"
              value={formData.phone}
              onChangeText={(text) => setFormData((prev: UserRegisterRequest) => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
              editable={!isLoading}
            />

            <View style={styles.roleSection}>
              <Text style={styles.roleTitle}>I am a:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'buyer' && styles.roleButtonActive
                  ]}
                  onPress={() => handleRoleChange('buyer')}
                  disabled={isLoading}
                >
                  <Text style={[
                    styles.roleButtonText,
                    formData.role === 'buyer' && styles.roleButtonTextActive
                  ]}>
                    Buyer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'seller' && styles.roleButtonActive
                  ]}
                  onPress={() => handleRoleChange('seller')}
                  disabled={isLoading}
                >
                  <Text style={[
                    styles.roleButtonText,
                    formData.role === 'seller' && styles.roleButtonTextActive
                  ]}>
                    Seller
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'agent' && styles.roleButtonActive
                  ]}
                  onPress={() => handleRoleChange('agent')}
                  disabled={isLoading}
                >
                  <Text style={[
                    styles.roleButtonText,
                    formData.role === 'agent' && styles.roleButtonTextActive
                  ]}>
                    Agent
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'seller' && styles.roleButtonActive
                  ]}
                  onPress={() => handleRoleChange('seller')}
                  disabled={isLoading}
                >
                  <Text style={[
                    styles.roleButtonText,
                    formData.role === 'seller' && styles.roleButtonTextActive
                  ]}>
                    Seller
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  halfInput: {
    flex: 1,
  },
  roleSection: {
    marginBottom: 24,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  roleButtonActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  roleButtonText: {
    fontSize: 14,
    color: '#666',
  },
  roleButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 