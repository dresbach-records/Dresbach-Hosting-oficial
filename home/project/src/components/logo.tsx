import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  // NOTE: This component assumes a logo file named "logosem fundo.png" exists in the `public` directory.
  return (
    <Image
      src="/logosem fundo.png"
      alt="Dresbach Hosting Logo"
      width={180}
      height={45}
      priority
      className={cn("object-contain", className)}
    />
  );
}
