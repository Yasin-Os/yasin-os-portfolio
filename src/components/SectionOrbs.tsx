/**
 * Live ambient orbs that float behind a section.
 * Pass 2-3 colors to tint the orbs.
 */
export function SectionOrbs({ colors }: { colors: [string, string, string?] }) {
  const [a, b, c] = colors;
  return (
    <div className="section-orbs" aria-hidden>
      <span
        className="orb"
        style={{
          width: 320, height: 320, left: "-80px", top: "10%",
          background: a, animation: "orbA 14s ease-in-out infinite",
        }}
      />
      <span
        className="orb"
        style={{
          width: 280, height: 280, right: "-60px", top: "40%",
          background: b, animation: "orbB 18s ease-in-out infinite",
        }}
      />
      {c && (
        <span
          className="orb"
          style={{
            width: 220, height: 220, left: "30%", bottom: "-60px",
            background: c, animation: "orbC 16s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}
