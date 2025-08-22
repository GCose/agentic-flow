import { NextPage } from 'next';
import { useAuth } from '@/hooks/use-auth-store';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import Head from 'next/head';
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';

// --- Employee Directory Section ---
const EmployeeDirectorySection: React.FC = () => {
  const [employees] = useState([
    { name: 'Alice Johnson', role: 'Software Engineer', department: 'Tech' },
    { name: 'Mark Lee', role: 'Product Designer', department: 'Design' },
    { name: 'Sophia Brown', role: 'HR Manager', department: 'HR' },
  ]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Employee Directory</h3>
      <ul className="space-y-2">
        {employees.map((emp, i) => (
          <li
            key={i}
            className="flex justify-between bg-gray-700 px-3 py-2 rounded"
          >
            <span>{emp.name}</span>
            <span className="text-gray-300 text-sm">
              {emp.role} • {emp.department}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Leave Requests Section ---
const LeaveRequestsSection: React.FC = () => {
  const [requests] = useState([
    { name: 'Alice Johnson', type: 'Vacation', status: 'Pending' },
    { name: 'Mark Lee', type: 'Sick Leave', status: 'Approved' },
  ]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Leave Requests</h3>
      <ul className="space-y-2">
        {requests.map((req, i) => (
          <li
            key={i}
            className="flex justify-between bg-gray-700 px-3 py-2 rounded"
          >
            <span>
              {req.name} – {req.type}
            </span>
            <span
              className={`text-sm ${
                req.status === 'Approved'
                  ? 'text-green-400'
                  : req.status === 'Pending'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              {req.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Payroll Section ---
const PayrollSection: React.FC = () => {
  const [payroll] = useState([
    { name: 'Alice Johnson', salary: '$5000', status: 'Paid' },
    { name: 'Mark Lee', salary: '$4500', status: 'Pending' },
  ]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Payroll</h3>
      <ul className="space-y-2">
        {payroll.map((p, i) => (
          <li
            key={i}
            className="flex justify-between bg-gray-700 px-3 py-2 rounded"
          >
            <span>
              {p.name} – {p.salary}
            </span>
            <span
              className={`text-sm ${
                p.status === 'Paid' ? 'text-green-400' : 'text-yellow-400'
              }`}
            >
              {p.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Performance Reviews Section ---
const PerformanceSection: React.FC = () => {
  const [reviews] = useState([
    { name: 'Alice Johnson', rating: 'Excellent', lastReview: 'Jan 2025' },
    { name: 'Mark Lee', rating: 'Good', lastReview: 'Dec 2024' },
  ]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Performance Reviews</h3>
      <ul className="space-y-2">
        {reviews.map((rev, i) => (
          <li
            key={i}
            className="flex justify-between bg-gray-700 px-3 py-2 rounded"
          >
            <span>
              {rev.name} – {rev.rating}
            </span>
            <span className="text-gray-400 text-sm">
              Last Review: {rev.lastReview}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Analytics Section ---
const AnalyticsSection: React.FC = () => {
  const headcountData = [
    { department: 'Tech', employees: 10 },
    { department: 'Design', employees: 5 },
    { department: 'HR', employees: 3 },
  ];

  const leaveData = [
    { status: 'Approved', value: 8 },
    { status: 'Pending', value: 3 },
    { status: 'Rejected', value: 2 },
  ];

  const COLORS = ['#34D399', '#FBBF24', '#F87171'];

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">HR Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="mb-2 font-medium">Headcount by Department</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={headcountData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="department" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="employees" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="mb-2 font-medium">Leave Requests Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={leaveData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {leaveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- HR Dashboard Page ---
const HRDashboard: NextPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <RoleBasedRoute allowedRoles={['HR']}>
      <Head>
        <title>HR Dashboard | Agentic Flow</title>
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        {/* Navbar */}
        <nav className="bg-gray-800 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">HR Dashboard</h1>
            <div className="flex items-center gap-4">
              <span>
                Welcome, {user?.firstname} {user?.lastname}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="p-8">
          <div className="bg-teal-600/20 border border-teal-600/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">HR Overview</h2>
            <p className="text-teal-200">
              Manage employees, leave requests, payroll, and performance reviews
              from one central dashboard.
            </p>
          </div>

          {/* Sections */}
          <EmployeeDirectorySection />
          <LeaveRequestsSection />
          <PayrollSection />
          <PerformanceSection />
          <AnalyticsSection />
        </div>
      </div>
    </RoleBasedRoute>
  );
};

export default HRDashboard;
