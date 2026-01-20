const SantaHat = ({ className }: { className?: string }) => (
    <svg
      width="120"
      height="120"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M 50,150 Q 40,90 100,70 Q 160,90 150,150 Z"
        fill="#FFFFFF"
      />
      <path
        d="M 100,70 C 50,20 120,0 150,50 C 180,100 140,110 100,70"
        fill="#E53935"
      />
      <circle cx="160" cy="45" r="20" fill="#FFFFFF" />
    </svg>
);

export default SantaHat;
