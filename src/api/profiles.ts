import { API_BASE_URL } from './config';

export async function fetchProfiles() {
  const response = await fetch(`${API_BASE_URL}/profiles`);

  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }

  return response.json();
}

export async function createProfile(data: {
  name: string;
  surname: string;
  phone: string;
  role: string;
}) {
  const response = await fetch(`${API_BASE_URL}/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create profile');
  }

  return response.json();
}

export async function deleteProfile(profileId: string) {
  const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete profile');
  }

  return response.json();
}
