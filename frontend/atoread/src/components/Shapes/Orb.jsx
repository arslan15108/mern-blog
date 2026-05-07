const Orb = ({ width, height, bg, className = "" }) => (
  <div
    className={`absolute rounded-full blur-3xl pointer-events-none ${bg} ${className}`}
    style={{ width, height }}
  />
);

export default Orb;