import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { emailHref, phoneHref, site } from "@/lib/site";

export default function TopBar() {
  return (
    <div className="bg-pine-900 text-[0.8125rem] text-snow/80">
      <div className="container-page flex h-10 items-center justify-center gap-6 sm:justify-between">
        <div className="flex items-center gap-5">
          <a href={phoneHref} className="inline-flex items-center gap-1.5 font-semibold text-snow hover:text-glow">
            <Phone className="size-3.5 text-glow" aria-hidden="true" />
            {site.phone}
          </a>
          <a href={emailHref} className="hidden items-center gap-1.5 hover:text-glow sm:inline-flex">
            <Mail className="size-3.5 text-glow" aria-hidden="true" />
            {site.email}
          </a>
          <span className="hidden items-center gap-1.5 lg:inline-flex">
            <MapPin className="size-3.5 text-glow" aria-hidden="true" />
            {site.serviceArea}
          </span>
        </div>
        <span className="hidden items-center gap-1.5 sm:inline-flex">
          <Clock className="size-3.5 text-glow" aria-hidden="true" />
          {site.hours.map((h) => `${h.days} ${h.time}`).join(" · ")}
        </span>
      </div>
    </div>
  );
}
