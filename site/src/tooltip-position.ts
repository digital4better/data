export function tooltipPosition(x: number, y: number, width: number, height: number, viewportWidth: number, viewportHeight: number) {
  const gap = 16;
  const margin = 8;
  return {
    left: Math.max(margin, Math.min(x + gap + width <= viewportWidth - margin ? x + gap : x - width - gap, viewportWidth - width - margin)),
    top: Math.max(margin, Math.min(y + gap + height <= viewportHeight - margin ? y + gap : y - height - gap, viewportHeight - height - margin)),
  };
}
