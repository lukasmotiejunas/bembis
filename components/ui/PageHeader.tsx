import { Garland } from "../Lights";
import SectionHeading from "./SectionHeading";

export default function PageHeader({
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
