import { User } from '@/types';
import { create } from 'zustand';

export interface State {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Actions {
  onLogin: (user: State['user']) => void;
  onLogout: () => void;
  isNotAuthenticated: () => void;
}

const useUserStore = create<State & Actions>((set) => ({
  user: null,
  isAuthenticated: false,
  onLogin: (user) => set({ user, isAuthenticated: !!user }),
  onLogout: () => set({ user: null, isAuthenticated: false }),
  isNotAuthenticated: () => set({ isAuthenticated: false }),
}));

useUserStore.subscribe((state) => {
  if (state.isAuthenticated) {
    localStorage.setItem('user', JSON.stringify(state.user));
  } else {
    localStorage.removeItem('user');
  }
});

export default useUserStore;
