import { encryptText } from "./crypto";
import { ReceiverData } from "../types";

export async function generateAssignmentLink(giver: string, receiver: string, receiverHint?: string, instructions?: string) {
  const baseUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}`;
  
  // If there's a hint, encrypt a JSON object
  const dataToEncrypt = receiverHint
    ? JSON.stringify({ name: receiver, hint: receiverHint } as ReceiverData)
    : receiver;
    
  const encryptedReceiver = await encryptText(dataToEncrypt);
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