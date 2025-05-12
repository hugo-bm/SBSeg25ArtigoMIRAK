export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDateNowNumbersOnly(): string {
  const dateString = new Date(Date.now()).toLocaleString();
  return dateString.replace(/\D/g, '');
}

export function octalForText(number: number): string {
  const permission = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];
  return permission[number] || "---" // If an error occurs, it will be determined that there is no permission.
}

