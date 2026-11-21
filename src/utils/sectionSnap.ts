export function easeOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Normalizes raw DOM section offsetTop positions into clean scroll snap targets.
 * Section 0 always anchors at y=0, while subsequent sections account for the sticky header offset.
 */
export function computeSnapTargets(
  sectionOffsets: number[],
  navOffset = 72,
  maxScroll?: number,
): number[] {
  return sectionOffsets.map((offset, index) => {
    if (index === 0) return 0;
    const rawTarget = Math.max(0, Math.round(offset - navOffset));
    if (typeof maxScroll === 'number' && maxScroll >= 0) {
      return Math.min(rawTarget, Math.round(maxScroll));
    }
    return rawTarget;
  });
}

/**
 * Returns the index of the section snap target closest to the current scroll position.
 */
export function findNearestSectionIndex(scrollY: number, targets: number[]): number {
  if (targets.length === 0) return -1;

  let bestIndex = 0;
  let bestDistance = Math.abs(targets[0] - scrollY);

  for (let i = 1; i < targets.length; i++) {
    const distance = Math.abs(targets[i] - scrollY);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }

  return bestIndex;
}

export interface SoftSnapCheckInput {
  scrollY: number;
  targetY: number;
  velocity: number;
  timeSinceLastInputMs: number;
  isSnapping: boolean;
  reducedMotion?: boolean;
  viewportHeight?: number;
}

/**
 * Determines whether soft section snap should gently glide toward targetY.
 * Mirrors Lenis soft-snap rules: waits until user input settles (> 140ms) and velocity drops (< 1.2),
 * and skips snapping when already aligned (<= 1.5px) or too far inside a tall variable-height section.
 */
export function shouldSoftSnap({
  scrollY,
  targetY,
  velocity,
  timeSinceLastInputMs,
  isSnapping,
  reducedMotion = false,
  viewportHeight = 900,
}: SoftSnapCheckInput): boolean {
  if (reducedMotion || isSnapping) return false;
  if (timeSinceLastInputMs <= 140) return false;
  if (Math.abs(velocity) >= 1.2) return false;

  const distance = Math.abs(targetY - scrollY);
  if (distance <= 1.5) return false;

  // Only gently settle near section boundaries so readers scrolling down tall sections or timelines are never pulled back.
  const maxSnapPull = Math.min(120, Math.max(64, viewportHeight * 0.14));
  return distance <= maxSnapPull;
}
