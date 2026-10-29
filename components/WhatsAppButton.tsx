"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import SocialIcon from "./SocialIcon";

/**
 * Desktop chat button in the corner; pointing at it shows the QR code to scan with a phone.
 * Phones get WhatsApp in MobileContactBar instead.
 */
export default function WhatsAppButton({ qr }: { qr: ReactNode }) {
  // The checkout keeps the buyer on paying, as MobileContactBar does.
  const pathname = usePathname();
  if (pathname.startsWith("/checkout")) return null;

  return (
    <div className="group fixed right-6 bottom-6 z-30 hidden md:block">
      {/* Padding, not margin, under the card: the pointer stays on the group on its way up to the code. */}
      <div className="invisible absolute right-0 bottom-full translate-y-2 pb-3 opacity-0 transition-[opacity,translate,visibility] duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="w-64 rounded-3xl border border-sand bg-white p-5 shadow-[0_24px_60px_-20px_rgb(12_27_20/0.45)]">
          <p className="font-bold text-pine-900">Parašykite mums WhatsApp</p>
          <p className="mt-1 text-sm leading-snug text-stone">Nuskenuokite QR kodą telefono kamera.</p>
          <div className="mt-4 rounded-2xl bg-[#fff] p-3 shadow-[inset_0_0_0_1px_#e7dfd1]">{qr}</div>
        </div>
      </div>
      <a
        href={site.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp shadow-[0_14px_34px_-12px_rgb(12_27_20/0.55)]"
      >
        <SocialIcon name="WhatsApp" className="size-5" />
        WhatsApp
      </a>
    </div>
  );
}
