import { NextPage } from 'next';
import { useAuth } from '@/hooks/use-auth-store';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import Head from 'next/head';
import React, { useState } from 'react';

// --- Video Upload Section ---
const VideoUploadSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    // TODO: Implement actual upload logic (API call)
    setTimeout(() => setUploading(false), 1500);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Upload Video</h3>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {selectedFile && (
        <div className="mt-2 text-gray-300">
          Selected: {selectedFile.name}
        </div>
      )}
    </div>
  );
};

// --- Video Assignment Section ---
const VideoAssignmentSection: React.FC = () => {
  const [assignment, setAssignment] = useState({
    type: '',
    value: '',
  });

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Assign Video</h3>
      <div className="mb-2">
        <label className="mr-2">Assign to:</label>
        <select
          value={assignment.type}
          onChange={e =>
            setAssignment({ ...assignment, type: e.target.value, value: '' })
          }
          className="bg-gray-700 text-white px-2 py-1 rounded"
        >
          <option value="">Select</option>
          <option value="organization">Organization</option>
          <option value="client">Client</option>
          <option value="platform">Platform</option>
        </select>
      </div>
      {assignment.type && (
        <input
          type="text"
          placeholder={`Enter ${assignment.type} name`}
          value={assignment.value}
          onChange={e =>
            setAssignment({ ...assignment, value: e.target.value })
          }
          className="bg-gray-700 text-white px-2 py-1 rounded w-full"
        />
      )}
      <button
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white mt-2"
        disabled={!assignment.type || !assignment.value}
      >
        Assign
      </button>
    </div>
  );
};

// --- Video Features Section ---
const VideoFeaturesSection: React.FC = () => {
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    status: 'Draft',
  });

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Video Metadata & Status</h3>
      <input
        type="text"
        placeholder="Title"
        value={metadata.title}
        onChange={e => setMetadata({ ...metadata, title: e.target.value })}
        className="bg-gray-700 text-white px-2 py-1 rounded w-full mb-2"
      />
      <textarea
        placeholder="Description"
        value={metadata.description}
        onChange={e => setMetadata({ ...metadata, description: e.target.value })}
        className="bg-gray-700 text-white px-2 py-1 rounded w-full mb-2"
      />
      <div className="mb-2">
        <label className="mr-2">Status:</label>
        <select
          value={metadata.status}
          onChange={e => setMetadata({ ...metadata, status: e.target.value })}
          className="bg-gray-700 text-white px-2 py-1 rounded"
        >
          <option value="Draft">Draft</option>
          <option value="Review">Review</option>
          <option value="Published">Published</option>
        </select>
      </div>
      <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white">
        Save Metadata
      </button>
    </div>
  );
};

const VideographerDashboard: NextPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <RoleBasedRoute allowedRoles={['Videographer']}>
      <Head>
        <title>Videographer Dashboard | Agentic Flow</title>
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="bg-gray-800 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Videographer Dashboard</h1>
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

        <div className="p-8">
          <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
            <p className="text-blue-200">
              The videographer dashboard is currently under development. You'll
              be able to manage video projects, assets, and workflows here.
            </p>
          </div>

          {/* New Sections */}
          <VideoUploadSection />
          <VideoAssignmentSection />
          <VideoFeaturesSection />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Video Projects</h3>
              <p className="text-gray-300">
                Manage your video production projects
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Asset Library</h3>
              <p className="text-gray-300">
                Access and organize video assets
              </p>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedRoute>
  );
};

export default VideographerDashboard;
