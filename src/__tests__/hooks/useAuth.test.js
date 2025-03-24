import { renderHook } from '@testing-library/react';
import { useAuth } from '../../../hooks/useAuth';
import { AuthContext } from '../../../context/AuthContext';
import React from 'react';

// Mock des AuthContext
const mockAuthContext = {
  user: { id: '1', name: 'Test User', role: 'admin' },
  isAuthenticated: true,
  isLoading: false,
  error: null,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
  resetPassword: jest.fn(),
  updateProfile: jest.fn(),
  fetchUserProfile: jest.fn()
};

// Wrapper-Komponente für den AuthContext
const wrapper = ({ children }) => (
  <AuthContext.Provider value={mockAuthContext}>
    {children}
  </AuthContext.Provider>
);

describe('useAuth Hook', () => {
  test('should return auth context values', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current).toEqual(mockAuthContext);
    expect(result.current.user).toEqual(mockAuthContext.user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.signup).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.resetPassword).toBe('function');
    expect(typeof result.current.updateProfile).toBe('function');
    expect(typeof result.current.fetchUserProfile).toBe('function');
  });

  test('should throw error when used outside AuthProvider', () => {
    // Spy auf console.error, um die erwartete Fehlermeldung zu unterdrücken
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth muss innerhalb eines AuthProviders verwendet werden');
    
    // Spy zurücksetzen
    console.error.mockRestore();
  });
});
