import { useEffect, useState } from "react";
import { AddressForm } from "../components/AddressForm";
import { createAddressApi, deleteAddressApi, fetchAddressesApi } from "../addressApi";

export function AddressBookPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await fetchAddressesApi();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Address Book</h1>
      <div className="space-y-2">
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {items.map((a) => (
          <article key={a._id} className="rounded border bg-white p-3 text-sm">
            <p className="font-medium">{a.fullName} | {a.phone}</p>
            <p>{a.line1}, {a.city}, {a.state} - {a.pincode}</p>
            <button className="mt-2 rounded border px-2 py-1 text-xs" onClick={async () => { await deleteAddressApi(a._id); await load(); }}>Delete</button>
          </article>
        ))}
      </div>
      <AddressForm onSubmit={async (payload) => { await createAddressApi(payload); await load(); }} />
    </section>
  );
}
