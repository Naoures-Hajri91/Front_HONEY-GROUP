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