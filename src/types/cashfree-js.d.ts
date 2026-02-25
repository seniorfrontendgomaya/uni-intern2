declare module "@cashfreepayments/cashfree-js" {
  export function load(options: {
    mode: "sandbox" | "production";
  }): Promise<{
    checkout(options: {
      paymentSessionId?: string;
      payment_session_id?: string;
      returnUrl: string;
    }): Promise<{ error?: { message?: string }; redirect?: boolean }>;
  } | null>;
}
