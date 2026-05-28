export interface PrestationResponse {
  // Champs Communs
  id: number;
  poleId: number;
  type: string; // 'CIRCUIT', 'COURS_LANGUE', 'GENERIQUE'
  titreService: string;
  description: string;
  prixBase: number;
  statut: string;
  dateCreation: string; // En TS, on utilise souvent 'string' ou 'Date' pour LocalDateTime
  metadata: { [key: string]: any };

  // Champs Spécifiques CIRCUIT
  descriptionLongue?: string; // Le '?' signifie que le champ est optionnel
  itineraire?: string;
  duree?: string;

  // Champs Spécifiques COURS_LANGUE
  langue?: string;
  niveau?: string;
  descriptifProgramme?: string;
}