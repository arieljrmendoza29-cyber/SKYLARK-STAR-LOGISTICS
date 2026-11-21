import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSnapTargets,
  easeOutCubic,
  findNearestSectionIndex,
  shouldSoftSnap,
} from './sectionSnap';

test('easeOutCubic starts at 0, slows smoothly, and ends at 1', () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.ok(easeOutCubic(0.5) > 0.8);
  assert.equal(easeOutCubic(-0.2), 0);
  assert.equal(easeOutCubic(1.5), 1);
});

test('computeSnapTargets pins first section to 0 and applies sticky navbar offset safely', () => {
  const targets = computeSnapTargets([0, 760, 1620, 2480], 72, 2350);
  assert.deepEqual(targets, [0, 688, 1548, 2350]);
});

test('findNearestSectionIndex picks closest section target', () => {
  const targets = [0, 700, 1500, 2300];
  assert.equal(findNearestSectionIndex(120, targets), 0);
  assert.equal(findNearestSectionIndex(620, targets), 1);
  assert.equal(findNearestSectionIndex(1490, targets), 2);
  assert.equal(findNearestSectionIndex(2500, targets), 3);
  assert.equal(findNearestSectionIndex(0, []), -1);
});

test('shouldSoftSnap enforces input pause, low velocity, alignment threshold, and reduced motion', () => {
  assert.equal(
    shouldSoftSnap({
      scrollY: 640,
      targetY: 700,
      velocity: 0.4,
      timeSinceLastInputMs: 180,
      isSnapping: false,
      viewportHeight: 900,
    }),
    true,
  );

  // Too soon after user input
  assert.equal(
    shouldSoftSnap({
      scrollY: 640,
      targetY: 700,
      velocity: 0.4,
      timeSinceLastInputMs: 90,
      isSnapping: false,
    }),
    false,
  );

  // Scroll velocity still high
  assert.equal(
    shouldSoftSnap({
      scrollY: 640,
      targetY: 700,
      velocity: 2.4,
      timeSinceLastInputMs: 220,
      isSnapping: false,
    }),
    false,
  );

  // Already aligned within 1.5px
  assert.equal(
    shouldSoftSnap({
      scrollY: 701,
      targetY: 700,
      velocity: 0.1,
      timeSinceLastInputMs: 220,
      isSnapping: false,
    }),
    false,
  );

  // Respects prefers-reduced-motion
  assert.equal(
    shouldSoftSnap({
      scrollY: 640,
      targetY: 700,
      velocity: 0.1,
      timeSinceLastInputMs: 220,
      isSnapping: false,
      reducedMotion: true,
    }),
    false,
  );

  // Does not yank user back when parked deep inside a tall variable-height section or vertical timeline
  assert.equal(
    shouldSoftSnap({
      scrollY: 1200,
      targetY: 600,
      velocity: 0.1,
      timeSinceLastInputMs: 220,
      isSnapping: false,
      viewportHeight: 900,
    }),
    false,
  );

  assert.equal(
    shouldSoftSnap({
      scrollY: 3420,
      targetY: 3097,
      velocity: 0.1,
      timeSinceLastInputMs: 220,
      isSnapping: false,
      viewportHeight: 900,
    }),
    false,
  );
});
