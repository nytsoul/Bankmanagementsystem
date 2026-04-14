import { useState } from 'react';
import { useBank } from '../context/BankContext';
import { toast } from 'sonner';
import { Ban, CheckCircle2, Plus, Edit, Shield, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function CustomerManagement() {
  const { customers, users, addCustomer, updateCustomer, deleteCustomer, setCustomerStatus } = useBank();
  const activeCustomers = customers.filter(customer => customer.isActive).length;
  const disabledCustomers = customers.length - activeCustomers;
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        });
        toast.success('Customer updated successfully');
      } else {
        await addCustomer(formData);
        toast.success('Customer added successfully');
      }
      setShowModal(false);
      setEditingCustomer(null);
      setFormData({ name: '', email: '', phone: '', address: '', password: '' });
    } catch (error) {
      toast.error('Action failed', { description: 'Please check the details and try again.' });
    }
  };

  const handleEdit = (customer: typeof customers[0]) => {
    setEditingCustomer(customer.id);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      password: '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const isAdmin = users.find(user => user.id === id)?.role === 'admin';

    if (isAdmin) {
      toast.error('Admin accounts cannot be deleted');
      return;
    }

    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        toast.success('Customer deleted successfully');
      } catch (error) {
        toast.error('Delete failed', { description: 'Unable to delete this customer.' });
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', address: '', password: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl text-slate-900 mb-2">Customer Management</h1>
          <p className="text-slate-600">Manage customer information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/90 rounded-xl border border-sky-100 p-4">
          <p className="text-sm text-slate-600">Total customers</p>
          <p className="text-2xl text-slate-900 mt-1">{customers.length}</p>
        </div>
        <div className="bg-white/90 rounded-xl border border-emerald-100 p-4">
          <p className="text-sm text-slate-600">Active customers</p>
          <p className="text-2xl text-emerald-600 mt-1">{activeCustomers}</p>
        </div>
        <div className="bg-white/90 rounded-xl border border-rose-100 p-4">
          <p className="text-sm text-slate-600">Disabled customers</p>
          <p className="text-2xl text-rose-600 mt-1">{disabledCustomers}</p>
        </div>
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-sky-50/70 border-b border-sky-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Customer ID</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Name</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Email</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Phone</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Status</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Role</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <motion.tr
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-sky-50 hover:bg-sky-50/60 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-slate-900">{customer.id}</td>
                <td className="px-6 py-4 text-sm text-slate-900">{customer.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{customer.email}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{customer.phone}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${customer.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {customer.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {users.find(user => user.id === customer.id)?.role.toUpperCase() || 'CUSTOMER'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCustomerStatus(customer.id, !customer.isActive)}
                      className={`p-2 rounded-lg transition-colors ${customer.isActive ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                      title={customer.isActive ? 'Disable customer' : 'Enable customer'}
                    >
                      {customer.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(customer)}
                      className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const isAdmin = users.find(user => user.id === customer.id)?.role === 'admin';
                        toast.info(isAdmin ? 'Already admin' : 'Promote in role management tab');
                      }}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Manage role in Role Management"
                    >
                      <Shield className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(customer.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-xl rounded-xl p-6 w-full max-w-md border border-sky-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-slate-900">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                    required
                  />
                </div>

                {!editingCustomer && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Temporary Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-sky-200 text-slate-700 rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    {editingCustomer ? 'Update' : 'Add'} Customer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
