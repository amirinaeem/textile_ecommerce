/*======================================================================================
 * Orders Utilities
 * Reusable helpers for order/payment management
======================================================================================*/

// Map payment status string to boolean
export const mapPaymentStatus = (status: string): boolean | undefined => {
  if (status === "paid") return true;
  if (status === "unPaid") return false;
  return undefined;
};

// Map payment method string to standard format
export const mapPaymentMethod = (method: string): string | undefined => {
  if (method === "cash") return "cash";
  if (method === "RazorPay") return "RazorPay";
  return undefined;
};