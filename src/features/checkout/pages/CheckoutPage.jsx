import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkAvailability, createPaymentOrder, fetchCheckoutQuote, placeOrder, verifyPayment } from "../api";
import { clearCartThunk } from "../../cart/cartSlice";
import { useRazorpay } from "../../../shared/hooks/useRazorpay";
import { Price } from "../../../shared/components/Price";
import { Loader } from "../../../shared/components/Loader";
import { ErrorState } from "../../../shared/components/ErrorState";
import { createAddressApi, fetchAddressesApi } from "../../address/addressApi";

const STEP_LABELS = ["Address", "Payment", "Confirmation"];

export function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth?.user);
  const isRazorpayLoaded = useRazorpay();

  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");
  const [quote, setQuote] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [manualAddress, setManualAddress] = useState({ fullName: "", phone: "", line1: "", city: "", state: "", pincode: "" });
  const [inlineErrors, setInlineErrors] = useState({});
  const [step, setStep] = useState(1);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && status !== "success") {
      navigate("/cart");
      return;
    }

    if (cartItems.length > 0 && !quote && status !== "error") {
      const initCheckout = async () => {
        try {
          setStatus("checking");
          setError("");

          const availability = await checkAvailability(cartItems);
          if (availability?.unavailableItems?.length) {
            const outOfStockNames = availability.unavailableItems.map((item) => item.productName || "an item").join(", ");
            throw new Error(`Insufficient stock for: ${outOfStockNames}. Please update your cart.`);
          }

          setStatus("quoting");
          const quoteData = await fetchCheckoutQuote(cartItems, couponCode);
          if (!quoteData) throw new Error("Failed to calculate order quote. Please try again.");
          setQuote(quoteData);
          setStatus("ready");
        } catch (err) {
          setError(err.message || "Failed to initialize checkout.");
          setStatus("error");
        }
      };

      initCheckout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  useEffect(() => {
    fetchAddressesApi()
      .then((rows) => {
        setSavedAddresses(rows || []);
        const defaultAddress = (rows || []).find((entry) => entry.isDefault) || rows?.[0];
        if (defaultAddress?._id) setSelectedAddressId(defaultAddress._id);
      })
      .catch(() => setSavedAddresses([]));
  }, []);

  const manualValidation = useMemo(
    () => ({
      fullName: manualAddress.fullName.trim().length >= 2 ? "" : "Enter full name",
      phone: /^[6-9]\d{9}$/.test(manualAddress.phone.trim()) ? "" : "Enter valid 10-digit phone",
      line1: manualAddress.line1.trim().length >= 5 ? "" : "Enter address line",
      city: manualAddress.city.trim().length >= 2 ? "" : "Enter city",
      state: manualAddress.state.trim().length >= 2 ? "" : "Enter state",
      pincode: /^\d{6}$/.test(manualAddress.pincode.trim()) ? "" : "Enter 6-digit pincode"
    }),
    [manualAddress]
  );

  const manualAddressValid = Object.values(manualValidation).every((v) => !v);
  const selectedAddress = savedAddresses.find((entry) => entry._id === selectedAddressId);

  const handleApplyCoupon = async () => {
    try {
      setStatus("quoting");
      const quoteData = await fetchCheckoutQuote(cartItems, couponCode);
      setQuote(quoteData);
      setStatus("ready");
    } catch {
      setError("Invalid coupon code.");
      setStatus("error");
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({ lat: Number(position.coords.latitude).toFixed(6), lng: Number(position.coords.longitude).toFixed(6) });
        setGeoLoading(false);
      },
      (geoError) => {
        setError(geoError.message || "Unable to fetch current location.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const moveToPayment = () => {
    if (selectedAddressId || currentLocation) {
      setStep(2);
      return;
    }

    setInlineErrors(manualValidation);
    if (manualAddressValid) {
      setStep(2);
    }
  };

  const resolveAddressPayload = async () => {
    if (selectedAddressId) {
      return { addressId: selectedAddressId, deliveryAddress: undefined };
    }
    if (currentLocation) {
      return { addressId: undefined, deliveryAddress: { source: "current_location", ...currentLocation } };
    }
    const created = await createAddressApi({ ...manualAddress, line2: "", landmark: "", isDefault: false });
    const id = created?._id || created?.id || created?.address?._id || "";
    return { addressId: id || undefined, deliveryAddress: manualAddress };
  };

  const handlePayNow = async () => {
    if (!isRazorpayLoaded) {
      setError("Payment gateway is still loading. Please wait.");
      return;
    }

    try {
      setStatus("processing");
      setError("");

      const amountToPay = quote.totalPayable ?? quote.totalAmount ?? quote.total ?? 0;
      const addressPayload = await resolveAddressPayload();
      const paymentOrder = await createPaymentOrder(amountToPay);
      const actualOrderId = paymentOrder.orderId || paymentOrder.id;
      const isMockOrder = String(actualOrderId || "").startsWith("mock_order_");

      const onPaymentSuccess = async (response) => {
        try {
          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: Math.round(Number(amountToPay) || 0)
          });

          if (verifyRes?.verified || verifyRes === true) {
            const finalOrder = await placeOrder({
              paymentId: response.razorpay_payment_id,
              paymentOrderId: response.razorpay_order_id,
              ...addressPayload
            });

            dispatch(clearCartThunk());
            setStep(3);
            setStatus("success");
            const orderId = finalOrder?._id || finalOrder?.id || "";
            navigate(`/checkout/result/success${orderId ? `?orderId=${orderId}` : ""}`);
          } else {
            throw new Error("Payment verification failed.");
          }
        } catch (err) {
          setError(err.message || "Order placement failed after payment.");
          setStatus("error");
          navigate("/checkout/result/failed");
        }
      };

      if (isMockOrder) {
        await onPaymentSuccess({ razorpay_order_id: actualOrderId, razorpay_payment_id: `pay_mock_${Date.now()}`, razorpay_signature: "mock_signature_from_frontend" });
        return;
      }

      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency || "INR",
        name: "Vyant Store",
        description: "Order Payment",
        order_id: actualOrderId,
        handler: onPaymentSuccess,
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: user?.phone || user?.phoneNumber || user?.mobile || ""
        },
        theme: { color: "#0f172a" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(response.error.description || "Payment failed.");
        setStatus("error");
        navigate("/checkout/result/failed");
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to initialize payment gateway.");
      setStatus("error");
      navigate("/checkout/result/failed");
    }
  };

  if (status === "checking") return <Loader label="Checking inventory availability..." />;
  if (status === "quoting") return <Loader label="Calculating final quote..." />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-5 text-3xl font-extrabold tracking-tight">Checkout</h1>

      <ol className="mb-6 flex flex-wrap items-center gap-3">
        {STEP_LABELS.map((label, idx) => {
          const current = idx + 1 === step;
          const done = idx + 1 < step;
          return <li key={label} className={`flex items-center gap-2 rounded-[12px] border px-3 py-2 text-sm ${current ? "border-slate-900 bg-slate-900 text-white" : done ? "border-emerald-500 bg-emerald-500 text-white" : "border-vy-border"}`}><span className="text-xs font-bold">{idx + 1}</span> {label}</li>;
        })}
      </ol>

      {error ? <div className="mb-4"><ErrorState message={error} /></div> : null}

      {quote ? (
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4 rounded-[12px] border bg-vy-surface p-5 shadow-xl shadow-slate-200/50">
            {step === 1 ? (
              <>
                <h2 className="text-lg font-bold">Step 1: Select Address</h2>
                {savedAddresses.length ? (
                  <div className="space-y-2">
                    {savedAddresses.map((address) => (
                      <label key={address._id} className="flex cursor-pointer items-start gap-2 rounded-[12px] border p-3 text-sm">
                        <input type="radio" name="saved-address" checked={selectedAddressId === address._id} onChange={() => setSelectedAddressId(address._id)} />
                        <span><strong>{address.fullName}</strong> ({address.phone})<br />{address.line1}, {address.city}, {address.state} - {address.pincode}</span>
                      </label>
                    ))}
                  </div>
                ) : null}

                <button type="button" onClick={captureLocation} className="rounded-[12px] border px-3 py-2 text-sm font-semibold" disabled={geoLoading}>
                  {geoLoading ? "Detecting..." : "Use Current Location (GPS)"}
                </button>
                {currentLocation ? <p className="text-xs text-emerald-700">Location set: {currentLocation.lat}, {currentLocation.lng}</p> : null}

                <p className="text-xs font-semibold uppercase tracking-wide text-vy-muted">Or add manual address</p>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {[ ["fullName", "Full Name"], ["phone", "Phone (10 digits)"], ["line1", "Address Line 1", "md:col-span-2"], ["city", "City"], ["state", "State"], ["pincode", "Pincode"] ].map(([key, label, span]) => (
                    <div key={key} className={span || ""}>
                      <input className="w-full rounded-[12px] border px-3 py-2 text-sm" placeholder={label} value={manualAddress[key]} onChange={(e) => setManualAddress((p) => ({ ...p, [key]: e.target.value }))} />
                      {inlineErrors[key] ? <p className="mt-1 text-xs text-rose-600">{inlineErrors[key]}</p> : null}
                    </div>
                  ))}
                </div>

                <button type="button" className="vy-primary-btn px-5 py-3 text-sm" onClick={moveToPayment}>Continue to Payment</button>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <h2 className="text-lg font-bold">Step 2: Payment</h2>
                <p className="text-sm text-vy-muted">
                  Address: {selectedAddress ? `${selectedAddress.fullName}, ${selectedAddress.city}` : currentLocation ? `GPS (${currentLocation.lat}, ${currentLocation.lng})` : `${manualAddress.fullName}, ${manualAddress.city}`}
                </p>
                <button className="vy-primary-btn w-full px-5 py-3 text-sm disabled:opacity-60" onClick={handlePayNow} disabled={status === "processing" || !isRazorpayLoaded}>
                  {status === "processing" ? "Processing..." : "Pay Now"}
                </button>
              </>
            ) : null}

            {step === 3 ? <><h2 className="text-lg font-bold">Step 3: Confirmation</h2><p className="text-sm text-emerald-700">Your order is confirmed.</p></> : null}
          </div>

          <aside className="rounded-[12px] border bg-vy-surface p-5 shadow-xl shadow-slate-200/50">
            <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
            <div className="mb-4 space-y-2 text-sm">
              {cartItems.map((item) => (
                <div key={item._id || item.cartItemId} className="flex justify-between border-b pb-2">
                  <span>{item.quantity} x {item.product?.name}</span>
                  <span className="font-semibold"><Price value={(item.product?.price || 0) * item.quantity} /></span>
                </div>
              ))}
            </div>
            <div className="mb-4 flex gap-2">
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="w-full rounded-[12px] border px-3 py-2 text-sm" />
              <button onClick={handleApplyCoupon} className="rounded-[12px] border px-3 py-2 text-xs font-semibold">Apply</button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span><Price value={quote.itemsTotal ?? quote.subtotal ?? 0} /></span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{(quote.shipping ?? quote.shippingFee) > 0 ? <Price value={quote.shipping ?? quote.shippingFee} /> : "Free"}</span></div>
              <div className="flex justify-between border-t pt-2 text-base font-extrabold"><span>Total</span><span><Price value={quote.totalPayable ?? quote.totalAmount ?? quote.total ?? 0} /></span></div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
