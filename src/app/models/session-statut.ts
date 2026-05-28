/**
 * Énumération synchronisée avec le backend Java
 * Représente le cycle de vie opérationnel d'une session du pôle Écotourisme
 */
export enum StatutSession {
  /** La session accepte activement les réservations clients */
  OUVERT = 'OUVERT',

  /** Le nombre maximal de participants est atteint, les inscriptions sont bloquées */
  COMPLET = 'COMPLET',

  /** Le circuit ou voyage est actuellement en cours de réalisation sur le terrain */
  EN_COURS = 'EN_COURS',

  /** Le voyage est terminé, les clients sont rentrés */
  CLOTURE = 'CLOTURE',

  /** Le départ a été annulé */
  ANNULE = 'ANNULE'
}

export type StatutSessionType = keyof typeof StatutSession;
