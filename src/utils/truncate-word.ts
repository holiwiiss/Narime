export const truncateWords = (text:string, maxWords = 3) => {
  const words = text.split(' ');

  return words.length > maxWords
    ? `${words.slice(0, maxWords).join(' ')}...`
    : text;
};