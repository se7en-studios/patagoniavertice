export function StarMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 2l3.6 9.4L29 14l-7.6 5.8L23.6 30 16 24l-7.6 6 2.2-10.2L3 14l9.4-2.6z" fill="#d9ab47" />
    </svg>
  );
}
