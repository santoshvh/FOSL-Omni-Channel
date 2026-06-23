import { cn } from "../lib/utils";

type FoslLogoProps = {
  className?: string;
  height?: number;
};

export function FoslLogo({ className, height = 36 }: FoslLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-fosl.svg"
      alt="FOSL"
      height={height}
      className={cn("h-auto w-auto", className)}
      style={{ height, width: "auto" }}
    />
  );
}
