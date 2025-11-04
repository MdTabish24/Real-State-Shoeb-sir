'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, Building2, TrendingUp, DollarSign, 
  Eye, CheckCircle, XCircle, Phone, Mail,
  Search, Filter, Trash2
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
    }
  }, [router]);

  const [leads, setLeads] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [pendingBuilders, setPendingBuilders] = useState<any[]>([]);
  const [totalBuilders, setTotalBuilders] = useState(0);
  const [allBuilders, setAllBuilders] = useState<any[]>([]);
  const [monthlyEnquiries, setMonthlyEnquiries] = useState(0);
  const [monthlyVisits, setMonthlyVisits] = useState(0);

  // Fetch data on mount
  useEffect(() => {
    fetchLeads();
    fetchPendingBuilders();
    fetchProperties();
    fetchBuilders();
    fetchAllBuilders();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties/list?limit=1000');
      const data = await res.json();
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchBuilders = async () => {
    try {
      const res = await fetch('/api/admin/all-builders');
      const data = await res.json();
      if (data.success) {
        setTotalBuilders(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching builders:', error);
    }
  };

  const fetchAllBuilders = async () => {
    try {
      const res = await fetch('/api/admin/all-builders?details=true');
      const data = await res.json();
      if (data.success) {
        setAllBuilders(data.builders || []);
      }
    } catch (error) {
      console.error('Error fetching all builders:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchPendingBuilders = async () => {
    try {
      const response = await fetch('/api/admin/pending-builders');
      const data = await response.json();
      if (data.success) {
        setPendingBuilders(data.builders);
      }
    } catch (error) {
      console.error('Error fetching builders:', error);
    }
  };

  const handleApproveBuilder = async (builder: any) => {
    if (!confirm(`Approve ${builder.fullName || builder.name} from ${builder.company?.name || builder.company}?`)) {
      return;
    }
    
    try {
      const response = await fetch('/api/admin/approve-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ builderId: builder._id || builder.id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Builder approved! Email sent with login credentials.');
        fetchPendingBuilders();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error approving builder:', error);
      alert('Failed to approve builder');
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await fetch('/api/admin/delete-property', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ propertyId })
      });

      const data = await response.json();

      if (data.success) {
        alert('Property deleted successfully!');
        fetchProperties();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  const handleRejectBuilder = async (builder: any) => {
    if (!confirm(`Reject ${builder.fullName || builder.name}'s application?`)) {
      return;
    }
    
    try {
      const response = await fetch('/api/admin/reject-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ builderId: builder._id || builder.id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Builder application rejected.');
        fetchPendingBuilders();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error rejecting builder:', error);
      alert('Failed to reject builder');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      'site-visit': 'bg-purple-100 text-purple-700',
      negotiation: 'bg-orange-100 text-orange-700',
      closed: 'bg-green-100 text-green-700',
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your properties, leads, and deals</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Monthly Enquiries', value: leads.length, icon: Mail },
            { label: 'Total Properties', value: properties.length, icon: Building2 },
            { label: 'Registered Builders', value: totalBuilders, icon: Users },
            { label: 'Pending Approvals', value: pendingBuilders.length, icon: TrendingUp },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 shadow-md border-l-4 border-[#0a2540]"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-[#0a2540] flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#544e49]">{stat.value}</h3>
              </div>
              <p className="text-[#544e49] font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {['overview', 'list', 'builders', 'pending-builders'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'list' ? 'List' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>

            {/* List - All Properties */}
            {activeTab === 'list' && (
              <div className="space-y-6">
                {properties.length > 0 ? (
                  properties.map((property: any) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Property Details */}
                        <div className="lg:col-span-2 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                              <p className="text-gray-600 mb-2">{property.location}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>🏠 {property.type}</span>
                                <span>🛏️ {property.beds} Beds</span>
                                <span>🛿 {property.baths} Baths</span>
                                <span>📐 {property.area} sq ft</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">₹{property.price}</p>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status || 'active')}`}>
                                {property.status || 'active'}
                              </span>
                            </div>
                          </div>
                          
                          {property.description && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                              <p className="text-gray-600 text-sm">{property.description}</p>
                            </div>
                          )}
                          
                          {property.amenities && property.amenities.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
                              <div className="flex flex-wrap gap-2">
                                {property.amenities.map((amenity: string, index: number) => (
                                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {property.builder && (
                              <div>
                                <span className="font-semibold text-gray-900">Builder:</span>
                                <p className="text-gray-600">{property.builder}</p>
                              </div>
                            )}
                            {property.possession && (
                              <div>
                                <span className="font-semibold text-gray-900">Possession:</span>
                                <p className="text-gray-600">{property.possession}</p>
                              </div>
                            )}
                            {property.createdAt && (
                              <div>
                                <span className="font-semibold text-gray-900">Listed:</span>
                                <p className="text-gray-600">{new Date(property.createdAt).toLocaleDateString()}</p>
                              </div>
                            )}
                            <div>
                              <span className="font-semibold text-gray-900">Property ID:</span>
                              <p className="text-gray-600">#{property.id}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions & Media Display */}
                        <div className="space-y-4">
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Property
                          </button>
                          
                          {/* YouTube Video */}
                          {property.videoUrl && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Property Video</h4>
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-2">
                                <iframe
                                  src={property.videoUrl.replace('watch?v=', 'embed/')}
                                  className="w-full h-full"
                                  frameBorder="0"
                                  allowFullScreen
                                  title={`Video for ${property.title}`}
                                />
                              </div>
                              <button 
                                onClick={() => window.open(property.videoUrl, '_blank')}
                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm"
                              >
                                📹 Open in YouTube
                              </button>
                            </div>
                          )}
                          
                          {/* Image Buttons */}
                          {property.images && property.images.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Property Images</h4>
                              <div className="space-y-2">
                                {property.images.map((imageUrl: string, index: number) => {
                                  const isYouTube = imageUrl && (imageUrl.includes('youtube.com') || imageUrl.includes('youtu.be'));
                                  return (
                                    <button 
                                      key={index}
                                      onClick={() => window.open(imageUrl, '_blank')}
                                      className={`w-full px-4 py-2 text-white rounded-lg hover:opacity-90 flex items-center justify-center gap-2 text-sm ${
                                        isYouTube ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                                      }`}
                                    >
                                      {isYouTube ? '📹 Open Video' : '🖼️ Open Image'} {index + 1}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          
                          {/* Main Image Button if no images array */}
                          {property.image && (!property.images || property.images.length === 0) && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Property Image</h4>
                              <button 
                                onClick={() => window.open(property.image, '_blank')}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
                              >
                                🖼️ Open Main Image
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No properties listed yet</p>
                    <p className="text-gray-400 text-sm">Properties will appear here when builders add them</p>
                  </div>
                )}
              </div>
            )}

            {/* Builders Table */}
            {activeTab === 'builders' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">GST/PAN</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBuilders.map((builder, index) => (
                      <motion.tr
                        key={builder._id || builder.id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 font-semibold text-gray-900">#{builder.id || builder._id}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">{builder.fullName || builder.name}</p>
                            <p className="text-sm text-gray-600">{builder.company?.address || builder.address}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-900">{builder.company?.name || builder.company}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {builder.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              {builder.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-gray-700"><strong>GST:</strong> {builder.company?.gstNumber || builder.gst}</p>
                            <p className="text-gray-700"><strong>PAN:</strong> {builder.company?.panNumber || builder.pan}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(builder.status || 'active')}`}>
                            {builder.status || 'active'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{builder.createdAt ? new Date(builder.createdAt).toLocaleDateString() : 'N/A'}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                
                {allBuilders.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No builders registered yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Pending Builders Table */}
            {activeTab === 'pending-builders' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">GST/PAN</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBuilders.map((builder, index) => (
                      <motion.tr
                        key={builder._id || builder.id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 font-semibold text-gray-900">#{builder.id}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">{builder.fullName || builder.name}</p>
                            <p className="text-sm text-gray-600">{builder.company?.address || builder.address}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-900">{builder.company?.name || builder.company}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {builder.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              {builder.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-gray-700"><strong>GST:</strong> {builder.company?.gstNumber || builder.gst}</p>
                            <p className="text-gray-700"><strong>PAN:</strong> {builder.company?.panNumber || builder.pan}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{builder.submittedDate || new Date(builder.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => alert(`Viewing details for ${builder.fullName || builder.name}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleApproveBuilder(builder)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Approve Builder"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleRejectBuilder(builder)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Reject Application"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                
                {pendingBuilders.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No pending builder applications</p>
                  </div>
                )}
              </div>
            )}

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {leads.slice(0, 3).map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div>
                            <p className="font-semibold text-gray-900">{lead.name}</p>
                            <p className="text-sm text-gray-600">{lead.property}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Top Properties</h3>
                    <div className="space-y-3">
                      {properties.slice(0, 3).map((property) => (
                        <div key={property.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div>
                            <p className="font-semibold text-gray-900">{property.title}</p>
                            <p className="text-sm text-gray-600">{property.location}</p>
                          </div>
                          <p className="font-bold text-blue-600">{property.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}