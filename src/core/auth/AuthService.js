/* ==========================================================================
   NEUROVAULT AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) SERVICE
   ========================================================================== */

import { CryptoUtils } from './CryptoUtils';

const ACCOUNTS_STORAGE_KEY = 'neurovault_accounts_db_v1';
const SESSION_STORAGE_KEY = 'neurovault_active_session_v1';
const AUDIT_LOGS_KEY = 'neurovault_audit_logs_v1';

export const USER_ROLES = {
  PLAYER: 'PLAYER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export class AuthService {
  /**
   * Initialize default accounts if database is empty
   */
  static async initializeDefaults() {
    const existing = this.getAccounts();
    if (existing.length === 0) {
      const superAdminPass = await CryptoUtils.hashPassword('SuperAdmin123!');
      const adminPass = await CryptoUtils.hashPassword('Admin123!');
      const playerPass = await CryptoUtils.hashPassword('Player123!');

      const defaultUsers = [
        {
          id: 'usr_superadmin',
          email: 'superadmin@mind50.com',
          name: 'Super Admin',
          role: USER_ROLES.SUPER_ADMIN,
          passwordHash: superAdminPass.hash,
          salt: superAdminPass.salt,
          avatar: '👑',
          createdAt: new Date().toISOString(),
          status: 'ACTIVE',
        },
        {
          id: 'usr_admin',
          email: 'admin@mind50.com',
          name: 'Platform Admin',
          role: USER_ROLES.ADMIN,
          passwordHash: adminPass.hash,
          salt: adminPass.salt,
          avatar: '🛡️',
          createdAt: new Date().toISOString(),
          status: 'ACTIVE',
        },
        {
          id: 'usr_player',
          email: 'player@mind50.com',
          name: 'Cognitive Explorer',
          role: USER_ROLES.PLAYER,
          passwordHash: playerPass.hash,
          salt: playerPass.salt,
          avatar: '🧩',
          createdAt: new Date().toISOString(),
          status: 'ACTIVE',
        },
      ];

      this.saveAccounts(defaultUsers);
      this.logSecurityEvent('SYSTEM_INIT', 'Initialized default accounts database');
    }
  }

  static getAccounts() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static saveAccounts(accounts) {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save accounts:', e);
    }
  }

  /**
   * Register a new user account
   */
  static async register({ name, email, password, role = USER_ROLES.PLAYER, avatar = '🧩' }) {
    await this.initializeDefaults();
    const accounts = this.getAccounts();

    const normalizedEmail = email.trim().toLowerCase();
    if (accounts.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const { hash, salt } = await CryptoUtils.hashPassword(password);
    const newUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email: normalizedEmail,
      name: name.trim(),
      role,
      passwordHash: hash,
      salt,
      avatar,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
    };

    accounts.push(newUser);
    this.saveAccounts(accounts);
    this.logSecurityEvent('USER_REGISTERED', `New account created: ${normalizedEmail} (${role})`);

    // Auto-login registered user
    return this.createSession(newUser);
  }

  /**
   * Log in user with email & password
   */
  static async login(email, password) {
    await this.initializeDefaults();
    const accounts = this.getAccounts();
    const normalizedEmail = email.trim().toLowerCase();

    const user = accounts.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      this.logSecurityEvent('FAILED_LOGIN', `Attempted login for non-existent email: ${normalizedEmail}`);
      return { success: false, error: 'Invalid email or password.' };
    }

    if (user.status === 'DISABLED') {
      this.logSecurityEvent('BLOCKED_LOGIN', `Attempted login for disabled user: ${normalizedEmail}`);
      return { success: false, error: 'Your account has been disabled by an administrator.' };
    }

    const isMatch = await CryptoUtils.verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      this.logSecurityEvent('FAILED_LOGIN', `Incorrect password for: ${normalizedEmail}`);
      return { success: false, error: 'Invalid email or password.' };
    }

    this.logSecurityEvent('USER_LOGIN', `User logged in: ${normalizedEmail}`);
    return this.createSession(user);
  }

  /**
   * Create active session token
   */
  static createSession(user) {
    const session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      token: 'nv_sess_' + Math.random().toString(36).substring(2) + '_' + Date.now().toString(36),
      loggedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to create session:', e);
    }

    return { success: true, session };
  }

  /**
   * Get active user session
   */
  static getActiveSession() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Log out active user
   */
  static logout() {
    const session = this.getActiveSession();
    if (session) {
      this.logSecurityEvent('USER_LOGOUT', `User logged out: ${session.user.email}`);
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return { success: true };
  }

  /**
   * Update user role (Admin / Super Admin action)
   */
  static updateUserRole(targetUserId, newRole, actorUser) {
    if (!actorUser || (actorUser.role !== USER_ROLES.SUPER_ADMIN && actorUser.role !== USER_ROLES.ADMIN)) {
      return { success: false, error: 'Unauthorized. Admin permissions required.' };
    }

    const accounts = this.getAccounts();
    const userIndex = accounts.findIndex(u => u.id === targetUserId);
    if (userIndex === -1) {
      return { success: false, error: 'User not found.' };
    }

    accounts[userIndex].role = newRole;
    this.saveAccounts(accounts);
    this.logSecurityEvent('ROLE_UPDATED', `Role of ${accounts[userIndex].email} changed to ${newRole} by ${actorUser.email}`);
    return { success: true, updatedUser: accounts[userIndex] };
  }

  /**
   * Toggle user account status (Disable / Enable)
   */
  static toggleUserStatus(targetUserId, actorUser) {
    if (!actorUser || (actorUser.role !== USER_ROLES.SUPER_ADMIN && actorUser.role !== USER_ROLES.ADMIN)) {
      return { success: false, error: 'Unauthorized.' };
    }

    const accounts = this.getAccounts();
    const user = accounts.find(u => u.id === targetUserId);
    if (!user) return { success: false, error: 'User not found.' };

    user.status = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    this.saveAccounts(accounts);
    this.logSecurityEvent('STATUS_UPDATED', `User ${user.email} status set to ${user.status} by ${actorUser.email}`);
    return { success: true, status: user.status };
  }

  /**
   * Log technical & security events
   */
  static logSecurityEvent(type, details) {
    try {
      const raw = localStorage.getItem(AUDIT_LOGS_KEY);
      const logs = raw ? JSON.parse(raw) : [];
      const entry = {
        id: 'log_' + Math.random().toString(36).substring(2, 9),
        type,
        details,
        timestamp: new Date().toISOString(),
      };
      logs.unshift(entry);
      // Keep last 200 logs
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs.slice(0, 200)));
    } catch (e) {
      console.error('Failed to log audit event:', e);
    }
  }

  static getAuditLogs() {
    try {
      const raw = localStorage.getItem(AUDIT_LOGS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
