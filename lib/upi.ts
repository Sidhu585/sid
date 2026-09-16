/**
 * UPI payment link construction.
 *
 * This intentionally never talks to a payment gateway. It builds the
 * standard `upi://pay` deep link that any UPI app (GPay, PhonePe, Paytm,
 * BHIM, ...) already knows how to handle. There is no way for a website
 * to know whether the resulting payment succeeded — see the "I've Paid"
 * manual-confirmation flow instead.
 */

export interface UpiPaymentDetails {
  payeeUpiId: string;
  payeeName: string;
  amount: number;
  note?: string;
}

/**
 * Builds a `upi://pay` URI with every parameter properly URL-encoded.
 * Never hand-concatenate these strings elsewhere in the app — always go
 * through this function so encoding stays consistent.
 */
export function buildUpiUri({ payeeUpiId, payeeName, amount, note }: UpiPaymentDetails): string {
  const params = new URLSearchParams();
  params.set("pa", payeeUpiId);
  params.set("pn", payeeName);
  params.set("am", amount.toFixed(2));
  params.set("cu", "INR");
  if (note) {
    // UPI apps expect the transaction note under "tn"
    params.set("tn", note);
  }
  return `upi://pay?${params.toString()}`;
}
