import { encryptText } from "./crypto";

export async function generateAssignmentLink(giver: string, receiver: string, instructions?: string) {
  const baseUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}`;
  const encryptedReceiver = await encryptText(receiver);
  const params = new URLSearchParams({
    from: giver,
    to: encryptedReceiver,
  });
  if (instructions?.trim()) {
    params.set('info', instructions.trim());
  }
  return `${baseUrl}/pairing?${params.toString()}`;
}

export function generateCSV(assignments: [string, string][]) {
  const csvContent = assignments
    .map(([giver, receiver]) => `${giver}\t${receiver}`)
    .join('\n');
  return `Giver\tReceiver\n${csvContent}`;
} 