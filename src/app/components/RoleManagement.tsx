import { useMemo, useState } from 'react';
import { useBank } from '../context/BankContext';
import { toast } from 'sonner';
import { ShieldCheck, Users } from 'lucide-react';
import { motion } from 'motion/react';
import type { UserRole } from '../types';

export function RoleManagement() {
  const { users, currentUser, updateUserRole } = useBank();
  const [filter, setFilter] = useState<'all' | UserRole>('all');

  const adminCount = useMemo(() => users.filter(user => user.role === 'admin').length, [users]);
  const customerCount = users.length - adminCount;

  const filteredUsers = useMemo(() => {
    if (filter === 'all') return users;
    return users.filter(user => user.role === filter);
  }, [users, filter]);

  const handleRoleChange = async (userId: string, nextRole: UserRole) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.id === currentUser?.id && user.role === 'admin' && nextRole === 'customer') {
      toast.error('You cannot demote your own admin account');
      return;
    }

    if (user.role === 'admin' && nextRole === 'customer' && adminCount <= 1) {
      toast.error('At least one admin must remain active');
      return;
    }

    try {
      await updateUserRole(userId, nextRole);
      toast.success(`Role updated to ${nextRole.toUpperCase()}`);
    } catch (error) {
      toast.error('Role update failed', { description: 'Try again or check permissions.' });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-slate-900 mb-2">Role Management</h1>
        <p className="text-slate-600">Promote or demote users across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/90 rounded-xl border border-sky-100 p-4">
          <p className="text-sm text-slate-600">Total users</p>
          <p className="text-2xl text-slate-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white/90 rounded-xl border border-emerald-100 p-4">
          <p className="text-sm text-slate-600">Admins</p>
          <p className="text-2xl text-emerald-600 mt-1">{adminCount}</p>
        </div>
        <div className="bg-white/90 rounded-xl border border-amber-100 p-4">
          <p className="text-sm text-slate-600">Customers</p>
          <p className="text-2xl text-amber-600 mt-1">{customerCount}</p>
        </div>
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 p-6 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'admin', 'customer'] as const).map((role) => (
            <motion.button
              key={role}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(role)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === role
                  ? 'bg-teal-600 text-white'
                  : 'bg-sky-50 text-slate-700 hover:bg-sky-100'
              }`}
            >
              {role}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-sky-50/70 border-b border-sky-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-slate-600">User</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Email</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Status</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Role</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                className="border-b border-sky-50 hover:bg-sky-50/60 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-slate-900">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    {user.firstName || user.email}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {user.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{user.role.toUpperCase()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    <select
                      value={user.role}
                      onChange={(event) => handleRoleChange(user.id, event.target.value as UserRole)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
