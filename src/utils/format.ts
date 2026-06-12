export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("es-ES", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day} of ${month}, ${year}`;
};

export const formatSynopsis = (synopsis: string): string[] => {
  return synopsis
    .split("\n")
    .map(p => p.trim())
    .filter(p => p.length > 0);
};