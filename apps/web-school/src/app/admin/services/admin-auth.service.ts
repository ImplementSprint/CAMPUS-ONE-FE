import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
export type AdminRole = 'student_admin' | 'applicant_admin' | 'alumni_admin' | 'super_admin';

export interface AdminUser {
  id: string;
  auth_id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  department: string | null;
  permissions: string[];
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface CreateAdminData {
  email: string;
  password: string;
  full_name: string;
  role: AdminRole;
  department?: string;
  permissions?: string[];
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: any;
  created_at: string;
}

// ─── Create Admin Account ─────────────────────────────────────────────────────
export async function createAdminAccount(data: CreateAdminData) {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create auth user');

    // 2. Create admin user record
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .insert({
        auth_id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        department: data.department || null,
        permissions: data.permissions || [],
      })
      .select()
      .single();

    if (adminError) {
      // Rollback: delete auth user if admin creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw adminError;
    }

    // 3. Log activity
    await logAdminActivity(
      adminUser.id,
      'admin.created',
      'admin',
      adminUser.id,
      { email: data.email, role: data.role }
    );

    return { data: adminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ─── Get All Admin Users ──────────────────────────────────────────────────────
export async function getAllAdminUsers() {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as AdminUser[], error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ─── Get Admin User by ID ─────────────────────────────────────────────────────
export async function getAdminUserById(adminId: string) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', adminId)
      .single();

    if (error) throw error;
    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ─── Get Current Admin User ───────────────────────────────────────────────────
export async function getCurrentAdminUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (error) throw error;
    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ─── Update Admin User ────────────────────────────────────────────────────────
export async function updateAdminUser(
  adminId: string,
  updates: Partial<Omit<AdminUser, 'id' | 'auth_id' | 'email' | 'created_at'>>
) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .update(updates)
      .eq('id', adminId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logAdminActivity(
      adminId,
      'admin.updated',
      'admin',
      adminId,
      updates
    );

    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ─── Deactivate Admin User ────────────────────────────────────────────────────
export async function deactivateAdminUser(adminId: string) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .update({ is_active: false })
      .eq('id', adminId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logAdminActivity(
      adminId,
      'admin.deactivated',
      'admin',
      adminId
    );

    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ─── Update Last Login ────────────────────────────────────────────────────────
export async function updateLastLogin(adminId: string) {
  try {
    const { error } = await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', adminId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── Check Admin Permission ───────────────────────────────────────────────────
export async function hasPermission(adminId: string, permission: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .rpc('has_admin_permission', {
        p_admin_id: adminId,
        p_permission: permission
      });

    return data === true;
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
}

// ─── Log Admin Activity ───────────────────────────────────────────────────────
export async function logAdminActivity(
  adminId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  details?: any
) {
  try {
    const { error } = await supabase
      .from('admin_activity_logs')
      .insert({
        admin_id: adminId,
        action,
        entity_type: entityType || null,
        entity_id: entityId || null,
        details: details || null,
      });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Failed to log activity:', error);
    return { success: false, error: error.message };
  }
}

// ─── Get Admin Activity Logs ──────────────────────────────────────────────────
export async function getAdminActivityLogs(
  adminId?: string,
  limit: number = 50
) {
  try {
    let query = supabase
      .from('admin_activity_logs')
      .select(`
        *,
        admin:admin_users(full_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (adminId) {
      query = query.eq('admin_id', adminId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as AdminActivityLog[], error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ─── Get All Permissions ──────────────────────────────────────────────────────
export async function getAllPermissions() {
  try {
    const { data, error } = await supabase
      .from('admin_permissions')
      .select('*')
      .order('module', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ─── Assign Permissions to Admin ──────────────────────────────────────────────
export async function assignPermissions(adminId: string, permissions: string[]) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .update({ permissions })
      .eq('id', adminId)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logAdminActivity(
      adminId,
      'admin.permissions_updated',
      'admin',
      adminId,
      { permissions }
    );

    return { data: data as AdminUser, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// ─── Change Admin Password ────────────────────────────────────────────────────
export async function changeAdminPassword(adminId: string, newPassword: string) {
  try {
    // Get admin's auth_id
    const { data: admin } = await supabase
      .from('admin_users')
      .select('auth_id')
      .eq('id', adminId)
      .single();

    if (!admin) throw new Error('Admin not found');

    // Update password in auth
    const { error } = await supabase.auth.admin.updateUserById(
      admin.auth_id,
      { password: newPassword }
    );

    if (error) throw error;

    // Log activity
    await logAdminActivity(
      adminId,
      'admin.password_changed',
      'admin',
      adminId
    );

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
