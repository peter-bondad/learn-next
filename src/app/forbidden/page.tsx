import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-8 text-center">
        <section className="rounded-3xl bg-[linear-gradient(135deg,#4a2b1c_0%,#6e3d1f_45%,#c67e3f_100%)] p-10 text-[#fff9f2] shadow-lg">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/10">
            <ShieldAlert className="size-7" />
          </div>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-[#f7d8b2]">
            Access Control
          </p>

          <h1 className="mt-3 text-4xl font-semibold">Access Denied</h1>

          <p className="mt-4 text-[#f7e9d8]">
            You do not have permission to access this page. Contact an
            administrator if you believe this is a mistake.
          </p>
        </section>

        <Link
          href="/admin"
          className="
    inline-flex
    h-12
    items-center
    justify-center
    gap-2
    rounded-full
    bg-[#6f3e1d]
    px-6
    text-sm
    font-semibold
    text-[#fff8ef]
    shadow-[0_14px_30px_-18px_rgba(74,43,28,0.9)]
    transition
    hover:bg-[#8d5a2b]
    cursor-pointer
  "
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
