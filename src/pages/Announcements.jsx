import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  SpeakerWaveIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Announcements = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    targetAudience: 'all'
  });

  // Fetch announcements from Supabase
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        setError('Failed to load announcements.');
      } else {
        setAnnouncements(data || []);
      }
    } catch (err) {
      setError('Failed to load announcements.');
    }
    setLoading(false);
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const announcementData = {
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      target_audience: formData.targetAudience,
      created_by: user.profile?.name || user.email
    };
    
    console.log('Creating announcement with data:', announcementData);
    
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert(announcementData)
        .select();
      
      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Supabase error details:', error);
        setError(`Failed to create announcement: ${error.message}`);
      } else {
        setSuccess('Announcement created successfully!');
        setIsCreateModalOpen(false);
        setFormData({ title: '', content: '', priority: 'normal', targetAudience: 'all' });
        fetchAnnouncements();
      }
    } catch (err) {
      console.error('Exception during announcement creation:', err);
      setError('Failed to create announcement.');
    }
    setLoading(false);
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('announcements')
        .update({
          title: formData.title,
          content: formData.content,
          priority: formData.priority,
          target_audience: formData.targetAudience,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingAnnouncement.id);
      
      if (error) {
        setError('Failed to update announcement.');
      } else {
        setSuccess('Announcement updated successfully!');
        setIsEditModalOpen(false);
        setEditingAnnouncement(null);
        setFormData({ title: '', content: '', priority: 'normal', targetAudience: 'all' });
        fetchAnnouncements();
      }
    } catch (err) {
      setError('Failed to update announcement.');
    }
    setLoading(false);
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      
      if (error) {
        setError('Failed to delete announcement.');
      } else {
        setSuccess('Announcement deleted successfully!');
        fetchAnnouncements();
      }
    } catch (err) {
      setError('Failed to delete announcement.');
    }
    setLoading(false);
  };

  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      targetAudience: announcement.target_audience
    });
    setIsEditModalOpen(true);
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      low: 'Low',
      normal: 'Normal',
      high: 'High'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  const getAudienceBadge = (audience) => {
    const colors = {
      all: 'bg-purple-100 text-purple-800',
      students: 'bg-green-100 text-green-800',
      faculty: 'bg-orange-100 text-orange-800',
      staff: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      all: 'All',
      students: 'Students',
      faculty: 'Faculty',
      staff: 'Staff'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[audience]}`}>
        {labels[audience]}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if user has permission to manage announcements
  const canManageAnnouncements = user?.profile?.role === 'hod' || user?.profile?.role === 'principal';

  if (!canManageAnnouncements) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">You don't have permission to manage announcements.</p>
          <p className="text-red-600 text-sm mt-1">Your role: {user?.profile?.role || 'undefined'}</p>
          <p className="text-red-600 text-sm">Required roles: hod, principal</p>
        </div>
      </div>
    );
  }

  if (loading && announcements.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="mt-1 text-gray-600">Create and manage college announcements</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Announcement
        </button>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <SpeakerWaveIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first announcement.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create First Announcement
              </button>
            </div>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                    {getPriorityBadge(announcement.priority)}
                    {getAudienceBadge(announcement.target_audience)}
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{announcement.content}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {announcement.created_by}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatDateTime(announcement.created_at)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => openEditModal(announcement)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Announcement Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Announcement</h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setFormData({ title: '', content: '', priority: 'normal', targetAudience: 'all' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <textarea
                  id="content"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter announcement content"
                  required
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
                  Target Audience
                </label>
                <select
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="students">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setFormData({ title: '', content: '', priority: 'normal', targetAudience: 'all' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {isEditModalOpen && editingAnnouncement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Announcement</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingAnnouncement(null);
                  setFormData({ title: '', content: '', priority: 'normal', targetAudience: 'all' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateAnnouncement} className="space-y-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <textarea
                  id="edit-content"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter announcement content"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="edit-priority"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-targetAudience" className="block text-sm font-medium text-gray-700">
                  Target Audience
                </label>
                <select
                  id="edit-targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="students">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingAnnouncement(null);
                    setFormData({ title: '', content: '', priority: 'normal', targetAudience: 'all' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
