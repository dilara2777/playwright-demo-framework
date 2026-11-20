/**
 * Public demo credentials for https://www.saucedemo.com
 * (listed on the site's own login page; password is the same for all users).
 */
export const DEMO_PASSWORD = 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: DEMO_PASSWORD },
  lockedOut: { username: 'locked_out_user', password: DEMO_PASSWORD },
  problem: { username: 'problem_user', password: DEMO_PASSWORD },
  performanceGlitch: { username: 'performance_glitch_user', password: DEMO_PASSWORD },
  error: { username: 'error_user', password: DEMO_PASSWORD },
  visual: { username: 'visual_user', password: DEMO_PASSWORD },
} as const;

export type DemoUser = (typeof users)[keyof typeof users];

export const checkoutInfo = {
  valid: { firstName: 'Ada', lastName: 'Lovelace', postalCode: '33160' },
  missingFirstName: { firstName: '', lastName: 'Lovelace', postalCode: '33160' },
};
