import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  // NOTE: This component assumes a logo file named "logosem fundo.png" exists in the `public` directory.
  return (
    <Image
      src="/logosem fundo.png"
      alt="Dresbach Hosting Logo"
      width={140}
      height={35}
      priority
      className={className}
    />
  );
}
