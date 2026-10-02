import Image from "next/image";

export default function Wordmark({
  name,
  className = "h-8 lg:h-9",
}: {
  name: string;
  className?: string;
}) {
  return (
    <Image
      src="/images/logo.png"
      alt={name}
      width={487}
      height={175}
      priority
      className={`w-auto ${className}`}
    />
  );
}
