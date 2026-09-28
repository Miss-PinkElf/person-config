export type CursorMode = "end" | "lastContent";

export function resolveCursorOffset(text: string, mode: CursorMode): number {
  if (mode === "end") {
    return text.length;
  }

  for (let index = text.length - 1; index >= 0; index -= 1) {
    if (!isWhitespace(text[index])) {
      return index + 1;
    }
  }

  return 0;
}

function isWhitespace(character: string): boolean {
  return /\s/.test(character);
}
