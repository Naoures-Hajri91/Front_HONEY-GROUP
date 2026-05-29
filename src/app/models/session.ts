import { StatutSession } from './session-statut';

/**
 * Modèle de la Session Écotourisme synchronisé avec le backend
 * Représente un créneau de départ pour une prestation touristique
 */
export interface Session {
  /** Identifiant unique de la session */
  id: number;

  /** Date et heure de départ du séjour */
  dateDebut: Date | string;

  /** Date et heure de fin ou de retour du séjour */
  dateFin: Date | string;

  /** Seuil maximal de participants tolérés pour cette session */
  capaciteMax: number;

  /** Nombre cumulé de places actuellement réservées et validées */
  nbInscrits: number;

  /** État opérationnel et cycle de vie de la session */
  statutSession: StatutSession | string;

  /** Identifiant de la prestation associée */
  prestationId?: number;
  idPrestation?: number;
}

/**
 * Type utilitaire pour calculer les places disponibles
 */
export interface SessionAvecPlaces extends Session {
  placesRestantes: number;
  placesUtilisees: number;
  pourcentageRemplissage: number;
}
