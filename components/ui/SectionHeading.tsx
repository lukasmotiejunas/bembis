import clsx from "clsx";

export default function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  light = false,
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  align?: "left" | "center";
  light?: boolean;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={clsx(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && <p className={clsx("eyebrow", light && "text-glow")}>{eyebrow}</p>}
      <Tag
        className={clsx(
          "mt-3 font-semibold",
          Tag === "h1" ? "text-4xl leading-[1.05] sm:text-5xl lg:text-6xl" : "text-3xl leading-tight sm:text-[2.75rem]",
          light ? "text-snow" : "text-pine-900"
        )}
      >
        {title}
      </Tag>
      {text && <p className={clsx("mt-4 text-lg leading-relaxed", light ? "text-snow/70" : "text-stone")}>{text}</p>}
    </div>
  );
}
