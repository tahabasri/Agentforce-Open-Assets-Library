// String utility functions


export function capitalizeWords(str: string): string {
  return str.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export function toSentenceCase(str: string): string {
  if (!str) return '';
  // Split camelCase and PascalCase words
  const spaced = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Capitalize each word
  return capitalizeWords(spaced);
}
