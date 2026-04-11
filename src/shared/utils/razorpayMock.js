export function createMockPayment() {
  const id = Date.now();
  return {
    razorpay_payment_id: `pay_mock_${id}`,
    razorpay_signature: "mock_signature"
  };
}
