export function normalizeTransaction(raw: any) {
  return {
    id:
      raw.id ??
      raw.transaction_id ??
      raw.txn_id ??
      null,

    date:
      raw.date ??
      raw.transaction_date ??
      raw.txn_date ??
      null,

    merchant:
      raw.merchant ??
      raw.merchant_name ??
      raw.vendor ??
      raw.payee ??
      null,

    amount:
      raw.amount ??
      raw.txn_amount ??
      raw.value ??
      null,

    category:
      raw.category ??
      "uncategorized",

    currency:
      raw.currency ??
      "INR",

    memo:
      raw.memo ??
      raw.description ??
      "",
  };
}

export function canonicalizeMerchant(name: string) {
  if (!name) return null;

  const m = name.toUpperCase();

  if (m.includes("AIR INDIA"))
    return "AIR INDIA";

  if (m.includes("INDIGO"))
    return "INDIGO";

  if (m.includes("AMAZON"))
    return "AMAZON";

  if (m.includes("APOLLO"))
    return "APOLLO";

  if (m.includes("SWIGGY"))
    return "SWIGGY";

  return m;
}