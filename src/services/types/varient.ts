interface AddProductVarient {
  productId: number;
  name: string;
  unit_discription?: string;
  bulkPackType: string;
  unitsPerBulkPack: number;
  PurchasedFrom?: string;
  sellerGST?: string;
  PurchaseType?: string;
  billNo?: string;
  billDate?: string;
  mfgDate?: string;
  expDate?: string;
  purchasePriceWithGST: number;
  quantityPurchased?: number;
  mrpWithGST: number;
  inStock?: number;
  elegibleForCredit?: boolean;
  elegibleForGoodWill?: boolean;
  DiscountOnCOB?: number;
  DiscountOnCOD?: number;
}
export type { AddProductVarient };
