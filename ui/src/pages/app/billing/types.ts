import type { TransactionStatus } from "@utils/types/payments";

export type TransactionTypeFilter = "ALL" | "SUBSCRIPTION" | "ONE_TIME" | "UPSELL" | "FREE";
export type TransactionStatusFilter = "ALL" | TransactionStatus;
export type TransactionDirectionFilter = "ALL" | "IN" | "OUT";

export type BillingQueryParams = Record<"checkout" | "payment" | "plan" | "transaction", string>;
