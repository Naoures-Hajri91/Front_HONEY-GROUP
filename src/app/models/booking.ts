export interface Booking {
  id: number;
  typeReservation?: string;
  userId?: number;
  userNomComplet?: string;
  poleId?: number;
  poleNom?: string;
  prestationId?: number;
  prestationTitre?: string;
  sessionId?: number;
  dateDebutSession?: string;
  dateFinSession?: string;
  nbPersonnes?: number;
  dateResa?: string;
  statut?: string;
  montantTotal?: number;
  paymentId?: number;
}
