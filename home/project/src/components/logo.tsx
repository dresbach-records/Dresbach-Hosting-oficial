import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo%20nova.png"
      alt="Dresbach Hosting Logo"
      width={180}
      height={45}
      priority
      className={cn("object-contain", className)}
    />
  );
}
