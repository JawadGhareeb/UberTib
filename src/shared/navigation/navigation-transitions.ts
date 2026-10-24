/**
 * Route changes are immediate throughout the app.
 * Modal, dialog, bottom-sheet and in-screen animations are independent.
 */
export function pageTransitionOptions() {
  return {
    animation: 'none' as const,
    animationDuration: 0,
  };
}

export function tabTransitionOptions() {
  return {
    animation: 'none' as const,
  };
}
