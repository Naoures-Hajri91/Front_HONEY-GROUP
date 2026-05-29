export interface UserProfile {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  adresse?: string;
  telephone?: string;
  pays?: string;
  preferences?: string;
}

export interface ProfileUpdatePayload {
  nom?: string;
  prenom?: string;
  adresse?: string;
  telephone?: string;
  pays?: string;
  preferences?: string;
}
