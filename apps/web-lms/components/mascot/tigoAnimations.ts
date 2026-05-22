export const TIGO_ANIMATION_BASE_PATH = '/mascot/tigo/transparent-square/frames';
export const TIGO_ANIMATION_FRAME_COUNT = 6;

export const TIGO_ANIMATION_NAMES = [
  'apologetic-shrug',
  'attendance-saved',
  'celebration-achievement',
  'completed-task',
  'confused-question',
  'correct-answer-approval',
  'credentials-sent',
  'curious-head-tilt',
  'default-wave',
  'delete-confirm',
  'error-concerned',
  'explaining-pointing',
  'focused-studying',
  'form-incomplete',
  'invoice-generated',
  'loading-walk',
  'locked-restricted-access',
  'login-success',
  'maintenance-waiting',
  'neutral-idle',
  'no-results-looking-around',
  'notification-received',
  'peeking-helper',
  'pointing-left',
  'proud-hands-on-hips',
  'proud-milestone',
  'quiz-master',
  'save-success',
  'saving-changes',
  'session-expired',
  'signup-success',
  'sleepy-idle',
  'streak-progress-excitement',
  'student-enrolled',
  'thinking-hint',
  'wrong-answer-encouragement',
] as const;

export type TigoAnimationName = (typeof TIGO_ANIMATION_NAMES)[number];

export interface TigoAnimationDefinition {
  name: TigoAnimationName;
  label: string;
  frameCount: number;
  frames: string[];
  poster: string;
}

function formatAnimationLabel(name: string) {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function createFramePath(name: TigoAnimationName, frameNumber: number) {
  return `${TIGO_ANIMATION_BASE_PATH}/${name}/frame-${String(frameNumber).padStart(2, '0')}.png`;
}

function createAnimationDefinition(name: TigoAnimationName): TigoAnimationDefinition {
  const frames = Array.from({ length: TIGO_ANIMATION_FRAME_COUNT }, (_, index) => createFramePath(name, index + 1));

  return {
    name,
    label: formatAnimationLabel(name),
    frameCount: TIGO_ANIMATION_FRAME_COUNT,
    frames,
    poster: frames[0],
  };
}

export const TIGO_ANIMATIONS = Object.fromEntries(
  TIGO_ANIMATION_NAMES.map((name) => [name, createAnimationDefinition(name)]),
) as Record<TigoAnimationName, TigoAnimationDefinition>;

export function getTigoAnimation(name: TigoAnimationName) {
  return TIGO_ANIMATIONS[name];
}
