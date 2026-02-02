import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware'; // Import devtools

// 1. Tipe Data User
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'Free' | 'Pro';
}

// 2. Tipe Data Store
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools( // <-- Wrapper DevTools (Paling Luar)
    persist(
      (set) => ({
        // --- Initial State ---
        user: null,
        token: null,
        isAuthenticated: false,

        // --- Action: Set Auth (Dipanggil setelah login Supabase sukses) ---
        setAuth: (user, token) => 
          set(
            { user, token, isAuthenticated: true }, 
            false, 
            'auth/loginSuccess' // Label untuk DevTools
          ),

        // --- Action: Logout ---
        logout: () => 
          set(
            { user: null, token: null, isAuthenticated: false }, 
            false, 
            'auth/logout' // Label untuk DevTools
          ),
      }),
      {
        name: 'theziz-auth-storage', // Nama di LocalStorage
        partialize: (state) => ({ 
          user: state.user, 
          token: state.token, 
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    { name: 'Auth Store' } // Nama Instance di DevTools
  )
);