/**
 * Temporary stand-in for the authenticated user until Identity & Access is integrated.
 * Single source of truth: every bounded context imports these, none defines its own.
 */
export const CURRENT_OWNER_ID = 1;
export const CURRENT_DRIVER_ID = 2;
