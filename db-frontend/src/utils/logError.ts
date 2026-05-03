export function logError(error: unknown) {
  if (import.meta.env.DEV) {
    console.error(error);
  }
}
