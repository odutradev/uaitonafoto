export const formatPriceInBrl = (priceInCents: number): string => {
  if (priceInCents === 0) return "Grátis";
  return (priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  });
};
