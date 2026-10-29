"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { phoneHref, site } from "@/lib/site";
import SocialIcon from "./SocialIcon";

export default function MobileContactBar() {
  // The checkout has its own pay button at the bottom of the page; the price calculator shows a live total there.
  const pathname = usePathname();
  if (pathname.startsWith("/checkout") || pathname === "/kiek-kainuoja") return null;

  // Three buttons in a row: icons drop out on the narrowest phones so the words still fit.
  const button = "btn gap-1.5 px-2 text-[0.8125rem] [&>svg]:max-[379px]:hidden";
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-snow/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <div className="grid grid-cols-3 gap-2">
        <a href={phoneHref} className={`${button} btn-dark`}>
          <Phone className="size-4" aria-hidden="true" />
          Skambinti
        </a>
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={`${button} btn-whatsapp`}>
          <SocialIcon name="WhatsApp" className="size-4" />
          WhatsApp
        </a>
        <Link href="/kontaktai#forma" className={`${button} btn-primary`}>
          <MessageCircle className="size-4" aria-hidden="true" />
          Užklausa
        </Link>
      </div>
    </div>
  );
}
