interface TextBlockProps {
  text: string[];
  flip?: boolean;
}

/**
 * Each line has the same CSS animation, offset by one 2.5-second step.
 * The keyframes are included in this file, so no CSS module, useEffect,
 * timers, hydration, or Tailwind animation config are required.
 */
export default function TextBlock({ text, flip = false }: TextBlockProps) {
  if (text.length === 0) return null;

  const secondsPerLine = 2.5;
  const duration = text.length * secondsPerLine;
  const activeWindow = 100 / text.length;
  const holdUntil = activeWindow * 0.65;
  const animationName = `summaristGreenHighlight${text.length}`;

  return (
    <div
      data-textblock-animation="inline-keyframes-v2"
      className={`flex flex-col justify-center gap-2 ${
        flip ? "items-end" : "items-start"
      }`}
    >
      <style>{`
        @keyframes ${animationName} {
          0%, ${holdUntil.toFixed(4)}% { color: #16a34a; }
          ${activeWindow.toFixed(4)}%, 99.999% { color: #6b7280; }
          100% { color: #16a34a; }
        }
      `}</style>

      {text.map((phrase, index) => (
        <p
          key={`${index}-${phrase}`}
          className="text-[clamp(1.1rem,3vw,1.8rem)] leading-snug font-bold text-start lg:leading-[3rem]"
          style={{
            color: "#6b7280",
            animationName,
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            // At t=0 the first line is active. Each following line becomes
            // green 2.5 seconds after the preceding one.
            animationDelay: `${(index - text.length) * secondsPerLine}s`,
          }}
        >
          {phrase}
        </p>
      ))}
    </div>
  );
}
