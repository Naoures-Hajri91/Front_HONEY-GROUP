/**
 * Énumération des rôles synchronisée avec fr.honeygroup.enumeration.Role
 */
export enum Role {
  /** Administrateur : Privilèges absolus */
  ADMIN = 'ADMIN',

  /** Client : Consultation et réservation */
  CLIENT = 'CLIENT',

  /** Manager : Audit commercial et validation */
  MANAGER = 'MANAGER'
}

/** Miroir de fr.honeygroup.enumeration.StatutBooking */
export enum StatutBooking {
  EN_ATTENTE_PAIEMENT = 'EN_ATTENTE_PAIEMENT',
  CONFIRME = 'CONFIRME',
  DEMANDE_ANNULATION = 'DEMANDE_ANNULATION',
  ANNULE = 'ANNULE',
  REFUSE = 'REFUSE'
}

/** Miroir de fr.honeygroup.enumeration.StatutPayment */
export enum StatutPayment {
  EN_ATTENTE_PREUVE = 'EN_ATTENTE_PREUVE',
  EN_VERIFICATION = 'EN_VERIFICATION',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE'
}