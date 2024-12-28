import { User } from '@/types';
import { create } from 'zustand';

export interface State {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Actions {
  setUser: (user: State['user']) => void;
  onLogout: () => void;
}

const useUserStore = create<State & Actions>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  onLogout: () => set({ user: null, isAuthenticated: false }),
}));

export default useUserStore;
