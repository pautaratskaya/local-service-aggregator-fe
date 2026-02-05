import type { Profile, ProfileRole } from '../types/profile';
import { PROFILE_ROLES } from '../types/profile';

const mockProfiles: Profile[] = [
  {
    id: '1',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    name: 'Екатерина',
    surname: 'Ковалёва',
    role: PROFILE_ROLES.CLIENT,
    phone: '+375 (44) 544-04-26',
  },
  {
    id: '2',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    name: 'Екатерина',
    surname: 'Ковалёва',
    role: PROFILE_ROLES.MASTER,
    phone: '+375 (44) 544-04-26',
  },
];

export function useProfiles() {
  return {
    data: mockProfiles,
    isLoading: false,
    error: null,
  };
}

export function useDeleteProfile() {
  return {
    mutate: (profileId: string) => {
      console.log('Mock delete profile:', profileId);
    },
    isLoading: false,
  };
}

export function useCreateProfile() {
  return {
    mutate: (data: {
      name: string;
      surname: string;
      phone: string;
      role: ProfileRole;
    }) => {
      console.log('Mock create profile:', data);
    },
    isLoading: false,
  };
}
