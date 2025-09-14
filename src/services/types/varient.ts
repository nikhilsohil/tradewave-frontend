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

interface ProductVarient {
  id: number;
  productId: number;
  code: string;
  name: string;
  unit_discription: string;
  DiscountOnCOB: string;
  DiscountOnCOD: string;
  ProductDiscountByGroup: any[];
  PurchaseType: string;
  PurchasedFrom: string;
  billDate: string;
  billNo: string;
  bulkPackType: string;
  createdAt: string;
  elegibleForCredit: boolean;
  elegibleForGoodWill: boolean;
  expDate: string;
  inStock: number;
  mfgDate: string;
  mrpWithGST: string;
  productDiscountSlab: any[];
  purchasePriceWithGST: string;
  quantityPurchased: number;
  sellerGST: string;
  status: boolean;
  unitsPerBulkPack: number;
  updateAt: string;
}

export type { AddProductVarient, ProductVarient };
