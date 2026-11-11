import type { CreditUsageItem, PurchaseItem, TransactionItem } from "@utils/types/payments";

export type UnifiedHistoryEntry =
  | {
      kind: "transaction";
      id: string;
      timestamp: string;
      transaction: TransactionItem;
    }
  | {
      kind: "purchase";
      id: string;
      timestamp: string;
      purchase: PurchaseItem;
    }
  | {
      kind: "usage";
      id: string;
      timestamp: string;
      usage: CreditUsageItem;
    };
