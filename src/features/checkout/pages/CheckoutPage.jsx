import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { checkAvailability, createPaymentOrder, fetchCheckoutQuote, placeOrder, verifyPayment } from "../api";
import { clearCartThunk } from "../../cart/cartSlice";
import { useRazorpay } from "../../../shared/hooks/useRazorpay";
import { Price } from "../../../shared/components/Price";
import { Loader } from "../../../shared/components/Loader";
import { ErrorState } from "../../../shared/components/ErrorState";
import { createAddress, fetchAddresses } from "../../addresses/api";
import { useToast } from "../../../shared/components/ToastProvider";

const STEP_LABELS = ["Address", "Payment", "Confirmation"];

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth?.user);
  const isRazorpayLoaded = useRazorpay();
  const toast = useToast();
  const selectedFromCart = cartItems.filter((item) => item.selected !== false);
  const selectedCartItemIdsFromRoute = Array.isArray(location.state?.selectedCartItemIds)
    ? location.state.selectedCartItemIds
    : [];
  const scopedCartItems = selectedCartItemIdsFromRoute.length
    ? cartItems.filter((item) => selectedCartItemIdsFromRoute.includes(item._id || item.cartItemId))
    : selectedFromCart;

  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");
  const [quote, setQuote] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [manualAddress, setManualAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    email: user?.email || ""
  });
  const [inlineErrors, setInlineErrors] = useState({});
  const [step, setStep] = useState(1);
  const formRefs = useRef({});
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (scopedCartItems.length === 0 && status !== "success") {
      navigate("/cart");
      return;
    }

    if (scopedCartItems.length > 0 && !quote && status !== "error") {
      const initCheckout = async () => {
        try {
          setStatus("checking");
          setError("");

          const availability = await checkAvailability(scopedCartItems);
          if (availability?.unavailableItems?.length) {
            const outOfStockNames = availability.unavailableItems.map((item) => item.productName || "an item").join(", ");
            throw new Error(`Insufficient stock for: ${outOfStockNames}. Please update your cart.`);
          }

          setStatus("quoting");
          const quoteData = await fetchCheckoutQuote(scopedCartItems, couponCode);
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
  }, [scopedCartItems]);

  useEffect(() => {
    fetchAddresses()
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
      pincode: /^\d{6}$/.test(manualAddress.pincode.trim()) ? "" : "Enter 6-digit pincode",
      email: /^\S+@\S+\.\S+$/.test(manualAddress.email.trim()) ? "" : "Enter valid email"
    }),
    [manualAddress]
  );

  const manualAddressValid = Object.values(manualValidation).every((v) => !v);
  const selectedAddress = savedAddresses.find((entry) => entry._id === selectedAddressId);

  const handleApplyCoupon = async () => {
    try {
      setStatus("quoting");
      const quoteData = await fetchCheckoutQuote(scopedCartItems, couponCode);
      setQuote(quoteData);
      setStatus("ready");
    } catch {
      setError("Invalid coupon code.");
      setStatus("error");
    }
  };

  const moveToPayment = () => {
    if (selectedAddressId) {
      setStep(2);
      return;
    }

    setInlineErrors(manualValidation);
    if (manualAddressValid) {
      setStep(2);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.show("Geolocation is not supported by your browser.", "error");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error("Failed to fetch address");
          const data = await res.json();

          const addy = data.address || {};
          const city = addy.city || addy.town || addy.village || addy.county || "";
          const state = addy.state || "";
          const pincode = addy.postcode || "";
          const line1 = addy.road ? `${addy.house_number ? addy.house_number + ", " : ""}${addy.road}` : (data.display_name?.split(",").slice(0, 2).join(",") || "");

          setManualAddress((prev) => ({
            ...prev,
            city,
            state,
            pincode,
            line1,
          }));
          setSelectedAddressId("");
          toast.show("Location fetched successfully!", "success");
        } catch (error) {
          toast.show("Could not resolve address from location.", "error");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.show("Location permission denied.", "error");
        } else {
          toast.show("Location unavailable.", "error");
        }
      }
    );
  };

  const resolveAddressPayload = async () => {
    let finalAddress;
    if (selectedAddressId) {
      const address = savedAddresses.find((entry) => entry._id === selectedAddressId);
      if (!address) throw new Error("Selected address not found.");
      finalAddress = {
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        landmark: address.landmark || "",
        email: address.email || ""
      };
    } else {
      const finalManual = { ...manualAddress };
      Object.keys(formRefs.current).forEach((k) => {
        const el = formRefs.current[k];
        if (el && String(el.value).trim() !== String(finalManual[k]).trim()) {
          finalManual[k] = el.value;
        }
      });
      finalAddress = {
        fullName: finalManual.fullName,
        phone: finalManual.phone,
        line1: finalManual.line1,
        line2: finalManual.line2 || "",
        city: finalManual.city,
        state: finalManual.state,
        pincode: finalManual.pincode,
        landmark: finalManual.landmark || "",
        email: (finalManual.email || "").trim()
      };
    }

    let rawPhone = finalAddress.phone || user?.phone || user?.mobile || user?.phoneNumber || "";
    let cleanPhone = String(rawPhone).replace(/\D/g, "");
    if (cleanPhone.length > 10 && (cleanPhone.startsWith("91") || cleanPhone.startsWith("0"))) {
      cleanPhone = cleanPhone.substring(cleanPhone.length - 10);
    }
    const finalEmail = (finalAddress.email || user?.email || "").trim();

    if (!selectedAddressId) {
      const created = await createAddress({
        fullName: finalAddress.fullName,
        phone: cleanPhone,
        line1: finalAddress.line1,
        line2: finalAddress.line2,
        city: finalAddress.city,
        state: finalAddress.state,
        pincode: finalAddress.pincode,
        landmark: finalAddress.landmark,
        email: finalEmail,
        isDefault: false
      });
      const id = created?._id || created?.id || created?.address?._id || "";
      if (id) setSelectedAddressId(id);
    }

    return {
      shippingAddress: {
        ...finalAddress,
        phone: cleanPhone,
        email: finalEmail
      }
    };
  };

  const handlePayNow = async () => {
    if (!isRazorpayLoaded || !window.Razorpay) {
      toast.show("Please disable AdBlocker to continue", "error");
      setError("Payment gateway is blocked or still loading. Please disable AdBlocker and refresh.");
      return;
    }

    try {
      setStatus("processing");
      setError("");

      const amountToPay = Number(quote.totalPayable ?? quote.totalAmount ?? quote.total ?? 0);
      const createOrderPayload = {
        amount: Number(amountToPay.toFixed(2)),
        currency: "INR"
      };
      console.log("Create order payload:", createOrderPayload);
      const addressPayload = await resolveAddressPayload();

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!addressPayload?.shippingAddress?.email || !emailRegex.test(addressPayload.shippingAddress.email) || addressPayload?.shippingAddress?.phone?.length !== 10) {
        toast.show("Please provide a valid email and 10-digit phone number in the shipping address.", "error");
        setStatus("ready");
        return;
      }

      const paymentOrder = await createPaymentOrder(createOrderPayload.amount);
      const actualOrderId = paymentOrder?.orderId || paymentOrder?.order_id || paymentOrder?.id;
      const razorpayKeyId = paymentOrder?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
      const orderAmountPaise = Number(paymentOrder?.amount);
      const verifiedAmountRupees =
        Number.isFinite(orderAmountPaise) && orderAmountPaise > 0
          ? Number((orderAmountPaise / 100).toFixed(2))
          : Number(amountToPay.toFixed(2));
      if (!actualOrderId) {
        throw new Error("Payment order id missing from backend response.");
      }
      if (!razorpayKeyId) {
        throw new Error("Razorpay key is missing. Check backend/frontend environment configuration.");
      }

      const onPaymentSuccess = async (response) => {
        try {
          if (!response?.razorpay_order_id || !response?.razorpay_payment_id || !response?.razorpay_signature) {
            throw new Error("Incomplete payment response received from Razorpay.");
          }
          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: verifiedAmountRupees,
            currency: "INR"
          });

          if (verifyRes?.verified || verifyRes === true) {
            const selectedCartItemIds = scopedCartItems
              .map((item) => item._id || item.cartItemId)
              .filter((value) => /^[a-fA-F0-9]{24}$/.test(String(value)));
            const finalOrder = await placeOrder({
              paymentId: response.razorpay_payment_id,
              paymentOrderId: response.razorpay_order_id,
              selectedCartItemIds,
              couponCode,
              amount: Number(amountToPay.toFixed(2)),
              currency: "INR",
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

      const options = {
        key: razorpayKeyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency || "INR",
        name: "Vyant Store",
        description: "Order Payment",
        order_id: actualOrderId,
        handler: onPaymentSuccess,
        prefill: {
          name: addressPayload.shippingAddress.fullName || user?.name || "Customer",
          email: addressPayload.shippingAddress.email || user?.email || "",
          contact: addressPayload.shippingAddress.phone || user?.phone || user?.phoneNumber || user?.mobile || ""
        },
        theme: { color: "#000" },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        retry: { enabled: true, max_count: 1 },
        modal: {
          ondismiss: () => {
            setStatus("ready");
          }
        }
      };
      if (!options.order_id) {
        throw new Error("Invalid order_id from backend. Cannot open Razorpay.");
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(response?.error?.description || response?.error?.reason || "Payment failed.");
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
                    <label className="flex cursor-pointer items-start gap-2 rounded-[12px] border p-3 text-sm">
                      <input type="radio" name="saved-address" checked={selectedAddressId === ""} onChange={() => setSelectedAddressId("")} />
                      <span><strong>Add new address</strong></span>
                    </label>
                  </div>
                ) : null}

                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-vy-muted">Or add manual address</p>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="flex w-max items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-200 disabled:opacity-50"
                  >
                    {isLocating ? "Fetching..." : "📍 Use Current Location"}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {[
                    ["fullName", "Full Name"],
                    ["phone", "Phone (10 digits)"],
                    ["email", "Email"],
                    ["line1", "Address Line 1", "md:col-span-2"],
                    ["line2", "Address Line 2", "md:col-span-2"],
                    ["city", "City"],
                    ["state", "State"],
                    ["pincode", "Pincode"],
                    ["landmark", "Landmark (optional)", "md:col-span-2"]
                  ].map(([key, label, span]) => (
                    <div key={key} className={span || ""}>
                      <input ref={(el) => (formRefs.current[key] = el)} className="w-full rounded-[12px] border px-3 py-2 text-sm" placeholder={label} value={manualAddress[key]} onBlur={(e) => {
                        let val = e.target.value;
                        if (key === "phone") {
                          val = val.replace(/\D/g, "");
                          if (val.length > 10 && (val.startsWith("91") || val.startsWith("0"))) val = val.substring(val.length - 10);
                        }
                        setManualAddress((p) => ({ ...p, [key]: val }));
                      }} onChange={(e) => {
                        let val = e.target.value;
                        setManualAddress((p) => ({ ...p, [key]: val }));
                        if (selectedAddressId) setSelectedAddressId("");
                      }} onFocus={() => {
                        if (selectedAddressId) setSelectedAddressId("");
                      }} />
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
                  Address: {selectedAddress ? `${selectedAddress.fullName}, ${selectedAddress.city}` : `${manualAddress.fullName}, ${manualAddress.city}`}
                </p>
                <button className="vy-primary-btn w-full px-5 py-3 text-sm disabled:opacity-60" onClick={handlePayNow} disabled={status === "processing" || !isRazorpayLoaded}>
                  {status === "processing" ? "Processing Payment..." : "Pay Securely"}
                </button>
              </>
            ) : null}

            {step === 3 ? <><h2 className="text-lg font-bold">Step 3: Confirmation</h2><p className="text-sm text-emerald-700">Your order is confirmed.</p></> : null}
          </div>

          <aside className="rounded-[12px] border bg-vy-surface p-5 shadow-xl shadow-slate-200/50">
            <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
            <div className="mb-4 space-y-2 text-sm">
              {scopedCartItems.map((item) => (
                <div key={item._id || item.cartItemId} className="flex flex-col border-b pb-2">
                  <div className="flex justify-between">
                    <span>{item.quantity} x {item.product?.name}</span>
                    <span className="font-semibold"><Price value={(item.product?.price || 0) * item.quantity} /></span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-vy-muted">
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    {item.selectedVolume && <span>Vol: {item.selectedVolume}</span>}
                  </div>
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
