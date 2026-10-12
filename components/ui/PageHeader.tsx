import { getSiteTheme } from "@/lib/themeStore";
import { Garland } from "../Lights";
import { Bats, Moon } from "../halloween/Decor";
import SpookyGarland from "../halloween/SpookyGarland";
import SectionHeading from "./SectionHeading";

const pageBats = [
  { left: "80%", top: "40%", size: 54, duration: 8, delay: 0 },
  { left: "72%", top: "62%", size: 34, duration: 10, delay: -4 },
  { left: "91%", top: "66%", size: 28, duration: 9, delay: -2 },
];

export default async function PageHeader({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  children?: React.ReactNode;
}) {
  if ((await getSiteTheme()) === "halloween")
    return (
      <section className="relative overflow-hidden bg-cream">
        <SpookyGarland id="page-garland" />
        <Moon className="absolute top-24 right-[6%] hidden w-28 lg:block" />
        <Bats spots={pageBats} className="hidden lg:block" />
        <div className="relative container-page pt-2 pb-14 sm:pb-16">
          <SectionHeading as="h1" eyebrow={eyebrow} title={title} text={text} />
          {children && <div className="mt-8">{children}</div>}
        </div>
      </section>
    );
  return (
    <section className="bg-cream">
      <Garland id="page-garland" />
      <div className="container-page pt-6 pb-14 sm:pb-16">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} text={text} />
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
