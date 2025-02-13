export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDateNowNumbersOnly(): string {
  const dateString = new Date(Date.now()).toLocaleString();
  return dateString.replace(/\D/g, '');
}
