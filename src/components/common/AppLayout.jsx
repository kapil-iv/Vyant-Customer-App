import { Navbar } from "../Navbar";

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-3 py-5 md:px-4">{children}</main>
    </div>
  );
}
