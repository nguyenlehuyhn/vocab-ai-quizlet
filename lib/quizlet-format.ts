export function buildQuizletDefinition(vietnameseMeaning?: string | null, englishExample?: string | null) {
  const meaning = vietnameseMeaning?.trim() ?? "";
  const example = englishExample?.trim() ?? "";

  if (meaning && example) {
    return `${meaning}. Example: ${example}`;
  }

  if (meaning) {
    return meaning;
  }

  if (example) {
    return `Example: ${example}`;
  }

  return "";
}
