export function generateRandomLabelName() {
  const random = Math.floor(Math.random() * 1000);
  return `RandomLabelName${random}`;
};