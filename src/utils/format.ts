export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("es-ES", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
};

export const formatSynopsis = (synopsis: string): string[] => {
  return synopsis
    .split("\n")
    .map(p => p.trim())
    .filter(p => p.length > 0);
};