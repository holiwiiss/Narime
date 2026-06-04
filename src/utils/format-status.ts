export const formatStatus = (status: string) =>{
    return status
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
  