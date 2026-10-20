/**
 * Shared motion presets.
 *
 * The app has one motion language: content that replaces other content
 * fades while it slides in from the LEFT and drifts out to the RIGHT.
 * Both the route transition (`PageTransition`) and the Settings section
 * cross-fade use these values, so switching a Settings tab and switching
 * a page feel like the same gesture.
 */

/** Incoming content: decelerates as it glides into place. */
export const EASE_IN: [number, number, number, number] = [0.32, 0.72, 0, 1];

/** Outgoing content: accelerates as it drifts away. */
export const EASE_OUT: [number, number, number, number] = [0.4, 0, 0.6, 1];

/** Slightly slower than a snap, so the motion reads as a glide. */
export const ENTER_DURATION = 0.32;
export const EXIT_DURATION = 0.28;

/** Horizontal travel, in pixels. */
export const SLIDE_DISTANCE = 16;
