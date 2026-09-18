import { BarChart3, ShieldCheck, Wallet } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const FEATURES = [
  {
    icon: Wallet,
    title: "Track every rupee",
    desc: "Log trip income and expenses in seconds, from any device.",
  },
  {
    icon: BarChart3,
    title: "Real-time profitability",
    desc: "Dashboards and reports built straight from your trip data.",
  },
  {
    icon: ShieldCheck,
    title: "Built for teams",
    desc: "Role-based access keeps every branch and driver in sync.",
  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-slate-900 px-10 py-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 15% 0%, rgba(99,102,241,0.5), transparent 55%), radial-gradient(circle at 90% 90%, rgba(245,158,11,0.25), transparent 45%)",
          }}
        />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative flex flex-col gap-8">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Every Trip. <br />Every Rupee. <br />
              <span className="text-indigo-300">Complete Control.</span>
            </h2>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              TripLedger helps bus transport operators track daily trips, expenses, and income —
              and see profitability the moment a trip is logged.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <f.icon size={17} strokeWidth={2} className="text-indigo-300" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{f.title}</div>
                  <div className="text-xs text-slate-400">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-slate-500">© {new Date().getFullYear()} TripLedger</div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg bg-slate-900 px-3 py-2">
                <Logo />
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">Every Trip. Every Rupee. Complete Control.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
