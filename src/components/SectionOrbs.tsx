export function SectionOrbs({ colors }: { colors: [string, string, string?] }) {
  const [a, b, c] = colors;
  return (
    <div className="section-orbs" aria-hidden>
      <span className="orb" style={{ width: 320, height: 320, left: "-80px", top: "10%", "--orb-color": a, animation: "orbA 14s ease-in-out infinite" } as React.CSSProperties} />
      <span className="orb" style={{ width: 280, height: 280, right: "-60px", top: "40%", "--orb-color": b, animation: "orbB 18s ease-in-out infinite" } as React.CSSProperties} />
      {c && <span className="orb" style={{ width: 220, height: 220, left: "30%", bottom: "-60px", "--orb-color": c, animation: "orbC 16s ease-in-out infinite" } as React.CSSProperties} />}
    </div>
  );
}
