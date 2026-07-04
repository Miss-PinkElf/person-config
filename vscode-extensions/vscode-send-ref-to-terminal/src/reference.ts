export interface LineReferenceInput {
  relativePath: string;
  startLine: number;
  endLine: number;
}

export function normalizeReferencePath(relativePath: string): string {
  return relativePath.replace(/\\/g, "/");
}

export function buildLineReference(input: LineReferenceInput): string {
  const normalizedPath = normalizeReferencePath(input.relativePath);
  const linePart =
    input.startLine === input.endLine
      ? `L${input.startLine}`
      : `L${input.startLine}-${input.endLine}`;

  return `@${normalizedPath}#${linePart} `;
}
