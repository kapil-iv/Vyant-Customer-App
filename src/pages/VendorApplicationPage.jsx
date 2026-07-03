import { useVendorStore } from "../store/useVendorStore";

export function VendorApplicationPage() {
  const { status, error, apply } = useVendorStore();
  const [formData, setFormData] = useState({
    shopName: "",
    email: "",
    phone: "",
    gstNumber: "",
    location: "",
    logoUrl: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apply(formData);
    } catch (err) {
      // Error handled in store
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>
        <h1 className="text-3xl font-black mb-4">Application Submitted!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for applying to be a seller on Vyant. Our team will review your application and get back to you via email within 2-3 business days.
        </p>
        <Link
          to="/"
          className="inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-2">
            <Store className="text-orange-600" size={24} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-tight">
            Grow your business <br />
            <span className="text-orange-600">with Vyant</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Vyant is the fastest-growing marketplace for premium lifestyle products. Apply today to reach thousands of customers.
          </p>

          <ul className="space-y-4">
            {[
              "Reach 100k+ active shoppers monthly",
              "Zero joining fee for verified shops",
              "Dedicated support and growth analytics",
              "Secure payments and logistics support"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <CheckCircle className="text-orange-600" size={16} />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-orange-500/5 p-8">
          <h2 className="text-xl font-bold mb-6">Seller Application</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Shop Name</label>
              <input
                required
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="e.g. Urban Threads"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Business Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@shop.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                <input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">GST Number</label>
              <input
                required
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Enter 15 digit GSTIN"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Workshop/Shop Location</label>
              <textarea
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Full address of your primary location"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Logo/Brand Image URL (Optional)</label>
              <input
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://cloud.com/your-logo.png"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
