export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("es-ES", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
};
