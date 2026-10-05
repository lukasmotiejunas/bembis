"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { phoneHref } from "@/lib/site";

export default function MobileContactBar() {
  // The checkout has its own pay button at the bottom of the page.
  if (usePathname().startsWith("/checkout")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-snow/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a href={phoneHref} className="btn btn-dark">
          <Phone className="size-4" aria-hidden="true" />
          Skambinti
        </a>
        <Link href="/kontaktai#forma" className="btn btn-primary">
          <MessageCircle className="size-4" aria-hidden="true" />
          Parašyti
        </Link>
      </div>
    </div>
  );
}
