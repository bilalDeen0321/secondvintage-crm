// src/helpers/stringHelpers.js
export const capitalizeWords = (str) => {
  if (!str) return "";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
