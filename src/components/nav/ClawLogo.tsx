export function ClawLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <path d="M5 25Q7 18 9 10Q10 6 13 4" stroke="#C07838" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M11 27Q13 20 14 12Q15 8 18 6" stroke="#C07838" strokeWidth="2.4" strokeLinecap="round" opacity="0.8"/>
      <path d="M17 27Q19 21 20 14Q21 10 24 8" stroke="#C07838" strokeWidth="2.4" strokeLinecap="round" opacity="0.55"/>
      <circle cx="5" cy="25" r="2.2" fill="#C07838"/>
    </svg>
  )
}
