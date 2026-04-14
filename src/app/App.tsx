import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import { BankProvider, useBank } from './context/BankContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLogin } from './components/AdminLogin';
import { AdminRegister } from './components/AdminRegister';
import { Landing } from './components/Landing';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerDashboard } from './components/CustomerDashboard';
import { CustomerManagement } from './components/CustomerManagement';
import { AccountManagement } from './components/AccountManagement';
import { AllTransactions } from './components/AllTransactions';
import { FraudDetection } from './components/FraudDetection';
import { RoleManagement } from './components/RoleManagement';
import { SystemAlerts } from './components/SystemAlerts';
import { AdminActivityLog } from './components/AdminActivityLog';
import { MyAccounts } from './components/MyAccounts';
import { TransactionPanel } from './components/TransactionPanel';
import { TransactionHistory } from './components/TransactionHistory';
import { ScheduledTransactions } from './components/ScheduledTransactions';
import { SpendingAnalysis } from './components/SpendingAnalysis';

function Dashboard() {
  const { currentUser } = useBank();

  if (currentUser?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <CustomerDashboard />;
}

export default function App() {
  return (
    <BankProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <CustomerManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/accounts"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <AccountManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <AllTransactions />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/fraud"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <FraudDetection />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/roles"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <RoleManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/alerts"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <SystemAlerts />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity"
            element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <AdminActivityLog />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-accounts"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyAccounts />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transfer"
            element={
              <ProtectedRoute>
                <Layout>
                  <TransactionPanel />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <Layout>
                  <TransactionHistory />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/scheduled"
            element={
              <ProtectedRoute>
                <Layout>
                  <ScheduledTransactions />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <Layout>
                  <SpendingAnalysis />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </BankProvider>
  );
}