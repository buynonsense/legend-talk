export function getStorageUsage(): string {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      total += key.length + (localStorage.getItem(key)?.length || 0);
    }
  }
  const kb = total * 2;
  if (kb < 1024) return `${kb} B`;
  if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(1)} KB`;
  return `${(kb / (1024 * 1024)).toFixed(1)} MB`;
}
