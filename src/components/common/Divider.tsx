export default function Divider({ className = '' }: { className?: string }) {
  return <div className={`h-px bg-white/[0.07] my-3 ${className}`} />;
}
