/**
 * Énumération synchronisée avec le backend Java
 * Représente les canaux de règlement acceptés par Honey Group.
 */
export enum TypePayment {
  /**
   * Virement bancaire classique (transfert de compte à compte).
   */
  VIREMENT_BANCAIRE = 'VIREMENT_BANCAIRE',
  /**
   * Paiement via les solutions de Mobile Money (Mvola, Orange Money, Airtel Money).
   */
  MOBILE_MONEY = 'MOBILE_MONEY',
  /**
   * Paiement en ligne sécurisé via la plateforme PayPal.
   */
  PAYPAL = 'PAYPAL',
  /**
   * Paiement direct par carte bancaire (Stripe ou passerelle équivalente).
   */
  CARTE_BANCAIRE = 'CARTE_BANCAIRE',
}