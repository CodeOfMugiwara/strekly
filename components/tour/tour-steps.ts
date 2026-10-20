/**
 * The product tour — the steps, in order.
 *
 * Each step names the route it lives on and the `data-tour` attribute of
 * the element it points at. The tour navigates to the route, waits for the
 * element to mount, scrolls it into view and spots it.
 *
 * Steps whose target cannot be found are skipped rather than stalling the
 * tour, so a missing element (a feature that moved, a section that is not
 * rendered) never traps a new user in a dead-end tour.
 */

export type TourPlacement = "bottom" | "top" | "right" | "left";

export type TourStep = {
  id: string;
  /** Route the step lives on. */
  route: string;
  /** `data-tour` value of the element to spotlight. */
  target: string;
  title: string;
  body: string;
  /** Where the card sits relative to the spotlight. */
  placement?: TourPlacement;
  /**
   * `data-tour` value of a trigger to CLICK before this step is shown.
   * Used for transient UI: the profile popover has to be opened before its
   * name field exists in the DOM.
   */
  open?: string;
};

export const TOUR_STEPS: TourStep[] = [
  {
    id: "home-checkin",
    route: "/home",
    target: "home-checkin",
    title: "Check in on your habits",
    body: "Tap a circle to log today. Every tap cycles done → partial → missed, so a half-finished day still counts.",
    placement: "bottom",
  },
  {
    id: "home-week",
    route: "/home",
    target: "home-week",
    title: "Your week at a glance",
    body: "One ring per day. The fuller the ring, the more of your habits you finished that day.",
    placement: "bottom",
  },
  {
    id: "habits-grid",
    route: "/habits",
    target: "habits-grid",
    title: "Every habit, every day",
    body: "The grid is your month. Tap any cell to log that day — the habit names stay pinned while you scroll.",
    placement: "bottom",
  },
  {
    id: "habits-edit",
    route: "/habits",
    target: "habits-edit",
    title: "Edit a habit",
    body: "Tap a habit's name to rename it, change its icon, move it to a category, archive it or delete it. Drag the handle to reorder.",
    placement: "right",
  },
  {
    id: "habits-add",
    route: "/habits",
    target: "habits-add",
    title: "Make the set yours",
    body: "We started you with six universal habits. Add your own — or delete the ones that were never for you.",
    placement: "bottom",
  },
  {
    id: "mood-log",
    route: "/mood",
    target: "mood-log",
    title: "Log how you feel",
    body: "Pick a day, then tap a face. Your mood and your habits end up telling the same story on the Stats page.",
    placement: "bottom",
  },
  {
    id: "calendar-grid",
    route: "/calendar",
    target: "calendar-grid",
    title: "Your month, with feeling",
    body: "Every day shows the habits you logged and the face you wore. Click a day for the detail and a note.",
    placement: "bottom",
  },
  {
    id: "stats-heatmap",
    route: "/stats",
    target: "stats-heatmap",
    title: "See what keeps you going",
    body: "One square per day, darker the more you finished. Streaks, rates and the insights live here too.",
    placement: "bottom",
  },
  {
    id: "settings-profile",
    route: "/settings",
    target: "settings-profile",
    title: "Make it yours",
    body: "Your name, your theme, your data — everything personal lives behind these two buttons.",
    placement: "bottom",
  },
  {
    id: "settings-name",
    route: "/settings",
    target: "settings-name",
    open: "settings-profile",
    title: "Set your name",
    body: "Type it here. It saves on its own and drives the greeting on your Home page.",
    placement: "bottom",
  },
  {
    id: "settings-appearance",
    route: "/settings",
    target: "settings-appearance",
    title: "Pick a theme",
    body: "Ten colour themes, light and dark. You can replay this tour any time from Settings → About.",
    placement: "top",
  },
];

/** localStorage key — the tour runs once per browser. */
export const TOUR_SEEN_KEY = "strekly_tour_seen";
