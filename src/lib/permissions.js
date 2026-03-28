/**
 * src/lib/permissions.js
 *
 * Centralised, scalable permission system for project-level access control.
 *
 * EXTENDING — how to add a new permission:
 *   1. Add a key to PROJECT_PERMISSIONS.
 *   2. Add that key string to the relevant role arrays in ROLE_PERMISSIONS.
 *   Done — every hasPermission() call throughout the app picks it up automatically.
 *
 * EXTENDING — how to add a new role:
 *   1. Add it to PROJECT_ROLES (in descending privilege order).
 *   2. Add its permission set to ROLE_PERMISSIONS.
 *   3. Add a label+description to ROLE_LABELS.
 *
 * Pure JS — importable in both Server Components/Actions and Client Components.
 */

// ─── Permissions ──────────────────────────────────────────────────────────────

/** All defined project-level permissions. */
export const PROJECT_PERMISSIONS = {
  EDIT_PROJECT:   'EDIT_PROJECT',   // rename, color, icon, description, visibility
  INVITE_MEMBER:  'INVITE_MEMBER',  // send invitations to new members
  REMOVE_MEMBER:  'REMOVE_MEMBER',  // remove a single member from the project
  MANAGE_ROLES:   'MANAGE_ROLES',   // change existing members' roles
  DELETE_PROJECT: 'DELETE_PROJECT', // permanently delete the project
};

// ─── Roles ────────────────────────────────────────────────────────────────────

/** All valid roles ordered from highest to lowest privilege. */
export const PROJECT_ROLES = ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'];

/**
 * Role → permissions mapping (single source of truth).
 * OWNER   — full control; unique per project; cannot be removed.
 * ADMIN   — can manage members and settings but cannot delete the project.
 * MEMBER  — collaborates on tasks; no administrative permissions.
 * VIEWER  — read-only access.
 */
export const ROLE_PERMISSIONS = {
  OWNER: [
    'EDIT_PROJECT',
    'INVITE_MEMBER',
    'REMOVE_MEMBER',
    'MANAGE_ROLES',
    'DELETE_PROJECT',
  ],
  ADMIN: [
    'EDIT_PROJECT',
    'INVITE_MEMBER',
    'REMOVE_MEMBER',
    'MANAGE_ROLES',
  ],
  MEMBER: [],
  VIEWER: [],
};

/** Human-readable role metadata for UI rendering. */
export const ROLE_LABELS = {
  OWNER:  { label: 'Owner',  description: 'Full control — cannot be removed',    color: 'indigo' },
  ADMIN:  { label: 'Admin',  description: 'Can manage members and settings',      color: 'blue'   },
  MEMBER: { label: 'Member', description: 'Can view and work on tasks',           color: 'green'  },
  VIEWER: { label: 'Viewer', description: 'Read-only access',                     color: 'slate'  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true if the given role grants the specified permission.
 *
 * @param {string|null} role       — One of PROJECT_ROLES, or null (no access).
 * @param {string}      permission — One of PROJECT_PERMISSIONS.
 * @returns {boolean}
 */
export function hasPermission(role, permission) {
  if (!role) return false;
  return (ROLE_PERMISSIONS[role] ?? []).includes(permission);
}

/**
 * Returns all permissions granted to a role.
 *
 * @param {string|null} role
 * @returns {string[]}
 */
export function getPermissions(role) {
  if (!role) return [];
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Returns the subset of roles that the actor is allowed to assign to others.
 * - OWNER can assign ADMIN, MEMBER, or VIEWER.
 * - ADMIN can only assign MEMBER or VIEWER.
 * - Others cannot assign roles.
 *
 * @param {string|null} actorRole
 * @returns {string[]}
 */
export function assignableRoles(actorRole) {
  if (actorRole === 'OWNER') return ['ADMIN', 'MEMBER', 'VIEWER'];
  if (actorRole === 'ADMIN') return ['MEMBER', 'VIEWER'];
  return [];
}

/**
 * Returns true if actorRole is allowed to act on targetRole.
 * No one can act on OWNER. ADMIN cannot act on another ADMIN.
 *
 * @param {string|null} actorRole
 * @param {string}      targetRole
 * @returns {boolean}
 */
export function canActOn(actorRole, targetRole) {
  if (targetRole === 'OWNER') return false;
  if (actorRole === 'OWNER') return true;
  if (actorRole === 'ADMIN') return targetRole === 'MEMBER' || targetRole === 'VIEWER';
  return false;
}
