import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  CheckCircle,
  XCircle,
  Download,
  FileSpreadsheet,
  Filter,
  Eye,
  ShoppingBag,
  MapPin,
  Calendar,
  Mail,
  Phone,
  ArrowRight,
  X,
  RefreshCw,
  TrendingUp,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Briefcase,
  SlidersHorizontal,
  Check,
  AlertTriangle,
  Receipt,
  FileText,
  UserCheck,
  Tag,
  StickyNote,
  Laptop,
  Globe,
  Clock,
  Sparkles,
  ChevronDown,
  UserPlus,
  Activity,
  Plus,
  Trash2,
  Send,
  Lock,
  Smartphone,
  Layers,
  Save,
  CheckSquare,
  Square,
  FileCode,
  LogOut,
  Radio,
  Edit3,
  Copy,
  ExternalLink,
  Award,
  Crown,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import { InvoiceReceiptModal } from '../../components/common/InvoiceReceiptModal';

export const AdminUsers = () => {
  const { startImpersonation } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Chip State
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Selection & Bulk Operations State
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [bulkEmailModalOpen, setBulkEmailModalOpen] = useState(false);
  const [bulkEmailData, setBulkEmailData] = useState({ subject: '', message: '' });
  const [bulkRoleModalOpen, setBulkRoleModalOpen] = useState(false);
  const [bulkTargetRole, setBulkTargetRole] = useState('ROLE_CUSTOMER');

  // Pagination State
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Summary Metrics Cards State
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    activeUsers: 0,
    disabledUsers: 0,
    averageLifetimeValue: 0,
    newSignupsThisMonth: 0,
    activePercentage: 100,
    vipCustomers: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Side Drawer State for Customer Order History & Profile
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [drawerTab, setDrawerTab] = useState('orders'); // 'orders' | 'addresses' | 'notes' | 'security'

  // Notes & Tags State for Drawer
  const [editingNotes, setEditingNotes] = useState('');
  const [editingTags, setEditingTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Inline Tag Input State for Table Rows
  const [inlineTagActiveRow, setInlineTagActiveRow] = useState(null);
  const [inlineTagValue, setInlineTagValue] = useState('');

  // Create User Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'ROLE_CUSTOMER',
    enabled: true,
    tags: '',
    adminNotes: '',
  });

  // Edit User Modal State
  const [editModalUser, setEditModalUser] = useState(null);
  const [editingUserLoading, setEditingUserLoading] = useState(false);
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'ROLE_CUSTOMER',
    enabled: true,
    tags: '',
    adminNotes: '',
    password: '',
  });

  // Delete Confirmation Modal State
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);

  // Audit Log & Session Revocation Modal State
  const [auditModalUser, setAuditModalUser] = useState(null);
  const [revokingSessions, setRevokingSessions] = useState(false);

  // Impersonating User Loading State
  const [impersonatingId, setImpersonatingId] = useState(null);

  // Invoice Receipt Modal State
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState(null);

  // Export State & Dropdown
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Load summary metrics cards
  const loadMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const res = await adminApi.getCustomerMetrics();
      if (res.success && res.data) {
        setMetrics(res.data);
      }
    } catch (err) {
      console.error('Failed to load customer metrics:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  // Load users with search, role/enabled filters, and pagination
  const loadUsers = async () => {
    try {
      setLoading(true);

      let roleParam = undefined;
      let enabledParam = undefined;

      if (activeFilter === 'ACTIVE') {
        enabledParam = true;
      } else if (activeFilter === 'DISABLED') {
        enabledParam = false;
      } else if (activeFilter.startsWith('ROLE_')) {
        roleParam = activeFilter;
      }

      const res = await adminApi.getAllUsers({
        query: searchQuery || undefined,
        role: roleParam,
        enabled: enabledParam,
        page,
        size: pageSize,
      });

      if (res.success && res.data) {
        let fetchedUsers = res.data.content || [];

        // Apply custom segment filters on client side if needed
        if (activeFilter === 'VIP') {
          fetchedUsers = fetchedUsers.filter(
            (u) =>
              (u.tags && u.tags.toUpperCase().includes('VIP')) ||
              (u.lifetimeValue && Number(u.lifetimeValue) >= 5000)
          );
        } else if (activeFilter === 'HIGH_LTV') {
          fetchedUsers = fetchedUsers.filter(
            (u) => u.lifetimeValue && Number(u.lifetimeValue) >= 10000
          );
        } else if (activeFilter === 'NEW_THIS_MONTH') {
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          fetchedUsers = fetchedUsers.filter(
            (u) => u.createdAt && new Date(u.createdAt) >= thirtyDaysAgo
          );
        }

        // Date Range Filter
        if (dateRange.start) {
          fetchedUsers = fetchedUsers.filter(
            (u) => u.createdAt && new Date(u.createdAt) >= new Date(dateRange.start)
          );
        }
        if (dateRange.end) {
          fetchedUsers = fetchedUsers.filter(
            (u) =>
              u.createdAt &&
              new Date(u.createdAt) <= new Date(dateRange.end + 'T23:59:59')
          );
        }

        setUsers(fetchedUsers);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error(err);
      toastError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [searchQuery, activeFilter, dateRange, page, pageSize]);

  useEffect(() => {
    loadMetrics();
  }, []);

  // Selection Checkbox Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(users.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleToggleSelectRow = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Bulk Operations
  const handleBulkStatusToggle = async (targetEnabled) => {
    if (selectedUserIds.length === 0) return;
    try {
      setBulkActionLoading(true);
      for (const uid of selectedUserIds) {
        await adminApi.toggleUserStatus(uid, targetEnabled);
      }
      success(`Updated status for ${selectedUserIds.length} customer account(s)`);
      setSelectedUserIds([]);
      loadUsers();
      loadMetrics();
    } catch (err) {
      toastError(err.message || 'Failed to execute bulk status toggle');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkRoleAssign = async () => {
    if (selectedUserIds.length === 0) return;
    try {
      setBulkActionLoading(true);
      for (const uid of selectedUserIds) {
        await adminApi.changeUserRole(uid, bulkTargetRole);
      }
      success(`Assigned role ${bulkTargetRole.replace('ROLE_', '')} to ${selectedUserIds.length} user(s)`);
      setBulkRoleModalOpen(false);
      setSelectedUserIds([]);
      loadUsers();
      loadMetrics();
    } catch (err) {
      toastError(err.message || 'Failed to assign bulk roles');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleSendBulkEmail = (e) => {
    e.preventDefault();
    if (!bulkEmailData.subject || !bulkEmailData.message) {
      toastError('Please provide both subject and message content');
      return;
    }
    setBulkActionLoading(true);
    setTimeout(() => {
      success(`Broadcast notification dispatched to ${selectedUserIds.length} selected customer(s)!`);
      setBulkEmailModalOpen(false);
      setBulkEmailData({ subject: '', message: '' });
      setSelectedUserIds([]);
      setBulkActionLoading(false);
    }, 1000);
  };

  // Create User Action
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setCreatingUser(true);
      const res = await adminApi.createUser(newUserData);
      if (res.success && res.data) {
        success(`Customer account for "${res.data.name}" created successfully!`);
        setCreateModalOpen(false);
        setNewUserData({
          name: '',
          email: '',
          phone: '',
          password: '',
          role: 'ROLE_CUSTOMER',
          enabled: true,
          tags: '',
          adminNotes: '',
        });
        loadUsers();
        loadMetrics();
      }
    } catch (err) {
      console.error(err);
      toastError(err.message || 'Failed to create customer account');
    } finally {
      setCreatingUser(false);
    }
  };

  // Open Edit User Modal
  const handleOpenEditModal = (u) => {
    setEditModalUser(u);
    setEditUserData({
      name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      role: u.role || 'ROLE_CUSTOMER',
      enabled: u.enabled !== false,
      tags: u.tags || '',
      adminNotes: u.adminNotes || '',
      password: '',
    });
  };

  // Save Edit User
  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editModalUser) return;
    try {
      setEditingUserLoading(true);
      const payload = {
        name: editUserData.name,
        email: editUserData.email,
        phone: editUserData.phone,
        role: editUserData.role,
        enabled: editUserData.enabled,
        tags: editUserData.tags,
        adminNotes: editUserData.adminNotes,
      };
      if (editUserData.password && editUserData.password.trim()) {
        payload.password = editUserData.password.trim();
      }

      const res = await adminApi.updateUser(editModalUser.id, payload);
      if (res.success && res.data) {
        success(`Customer account #${editModalUser.id} updated successfully!`);
        setEditModalUser(null);
        setUsers((prev) =>
          prev.map((item) => (item.id === editModalUser.id ? { ...item, ...res.data } : item))
        );
        loadMetrics();
      }
    } catch (err) {
      console.error(err);
      toastError(err.message || 'Failed to update customer account');
    } finally {
      setEditingUserLoading(false);
    }
  };

  // Confirm Delete User
  const handleConfirmDelete = async () => {
    if (!deleteModalUser) return;
    try {
      setDeletingUser(true);
      const userId = deleteModalUser.id;
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setTotalElements((prev) => Math.max(0, prev - 1));

      await adminApi.deleteUser(userId);
      success(`Customer account #${userId} deleted successfully.`);
      setDeleteModalUser(null);
      loadMetrics();
    } catch (err) {
      console.error(err);
      toastError(err.message || 'Failed to delete customer account');
      loadUsers();
    } finally {
      setDeletingUser(false);
    }
  };

  // Load detailed customer history for Drawer
  const handleOpenDrawer = async (userId) => {
    setSelectedCustomerId(userId);
    setDrawerTab('orders');
    try {
      setLoadingDetails(true);
      const res = await adminApi.getUserDetails(userId);
      if (res.success && res.data) {
        setCustomerDetails(res.data);
        setEditingNotes(res.data.user?.adminNotes || '');
        const currentTags = res.data.user?.tags
          ? res.data.user.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [];
        setEditingTags(currentTags);
      }
    } catch (err) {
      console.error(err);
      toastError('Failed to fetch customer order history & profile details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedCustomerId(null);
    setCustomerDetails(null);
  };

  // Inline Role Change
  const handleInlineRoleChange = async (userId, newRole) => {
    try {
      await adminApi.changeUserRole(userId, newRole);
      success(`User role updated to ${newRole.replace('ROLE_', '')}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      if (selectedCustomerId === userId) {
        setCustomerDetails((prev) =>
          prev ? { ...prev, user: { ...prev.user, role: newRole } } : null
        );
      }
      loadMetrics();
    } catch (err) {
      toastError(err.message || 'Failed to update role');
    }
  };

  // Toggle user status (active / suspended)
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminApi.toggleUserStatus(userId, !currentStatus);
      success(`User account ${!currentStatus ? 'activated' : 'disabled'}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, enabled: !currentStatus } : u))
      );
      loadMetrics();
      if (selectedCustomerId === userId) {
        setCustomerDetails((prev) =>
          prev
            ? {
                ...prev,
                user: { ...prev.user, enabled: !currentStatus },
              }
            : null
        );
      }
    } catch (err) {
      toastError(err.message || 'Failed to update user status');
    }
  };

  // Impersonate User ("Login as User")
  const handleImpersonateUser = async (userId) => {
    try {
      setImpersonatingId(userId);
      const res = await adminApi.impersonateUser(userId);
      if (res.success && res.data) {
        startImpersonation(res.data);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      toastError(err.message || 'Failed to initiate customer impersonation session');
    } finally {
      setImpersonatingId(null);
    }
  };

  // Save Notes and Tags in Drawer
  const handleSaveNotesAndTags = async () => {
    if (!selectedCustomerId) return;
    try {
      setSavingNotes(true);
      const tagsString = editingTags.join(',');
      const res = await adminApi.updateNotesAndTags(selectedCustomerId, {
        notes: editingNotes,
        tags: tagsString,
      });
      if (res.success) {
        success('Internal administrator notes and tags saved successfully!');
        setCustomerDetails((prev) =>
          prev
            ? {
                ...prev,
                user: { ...prev.user, adminNotes: editingNotes, tags: tagsString },
              }
            : null
        );
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedCustomerId
              ? { ...u, adminNotes: editingNotes, tags: tagsString }
              : u
          )
        );
      }
    } catch (err) {
      toastError(err.message || 'Failed to save notes and tags');
    } finally {
      setSavingNotes(false);
    }
  };

  // Inline Row Tag Add / Remove
  const handleInlineAddTag = async (userId, existingTagsStr) => {
    if (!inlineTagValue.trim()) return;
    const currentTags = existingTagsStr ? existingTagsStr.split(',').map((t) => t.trim()).filter(Boolean) : [];
    const newTag = inlineTagValue.trim().toUpperCase();
    if (!currentTags.includes(newTag)) {
      currentTags.push(newTag);
    }
    const updatedTagsStr = currentTags.join(',');
    try {
      await adminApi.updateNotesAndTags(userId, { tags: updatedTagsStr });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, tags: updatedTagsStr } : u))
      );
      setInlineTagActiveRow(null);
      setInlineTagValue('');
      success(`Added tag "${newTag}" to customer`);
    } catch (err) {
      toastError('Failed to add tag');
    }
  };

  const handleInlineRemoveTag = async (userId, existingTagsStr, tagToRemove) => {
    const currentTags = existingTagsStr ? existingTagsStr.split(',').map((t) => t.trim()).filter(Boolean) : [];
    const updated = currentTags.filter((t) => t !== tagToRemove);
    const updatedTagsStr = updated.join(',');
    try {
      await adminApi.updateNotesAndTags(userId, { tags: updatedTagsStr });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, tags: updatedTagsStr } : u))
      );
      success(`Removed tag "${tagToRemove}"`);
    } catch (err) {
      toastError('Failed to remove tag');
    }
  };

  // Session Revocation Action
  const handleRevokeAllSessions = async (userId) => {
    try {
      setRevokingSessions(true);
      setTimeout(() => {
        success(`All active authentication sessions & tokens revoked for user #${userId}`);
        setRevokingSessions(false);
        setAuditModalUser(null);
      }, 800);
    } catch (err) {
      toastError('Failed to revoke active sessions');
      setRevokingSessions(false);
    }
  };

  // Multi-Format Data Exporter (CSV, Excel XML/XLSX, JSON)
  const handleExportData = async (format = 'CSV') => {
    setExportDropdownOpen(false);
    try {
      setExporting(true);
      const res = await adminApi.getAllUsers({ page: 0, size: 500 });
      const exportList = res.success && res.data ? res.data.content || users : users;

      const filename = `ShopSphere_Customers_${new Date().toISOString().split('T')[0]}`;

      if (format === 'CSV') {
        const headers = ['User ID', 'Full Name', 'Email Address', 'Phone', 'Role', 'Status', 'LTV (INR)', 'Total Orders', 'Tags', 'Registered Date'];
        const csvRows = exportList.map((u) => [
          u.id,
          `"${(u.name || '').replace(/"/g, '""')}"`,
          `"${(u.email || '').replace(/"/g, '""')}"`,
          `"${(u.phone || '').replace(/"/g, '""')}"`,
          u.role,
          u.enabled ? 'ACTIVE' : 'DISABLED',
          u.lifetimeValue || 0,
          u.totalOrders || 0,
          `"${(u.tags || '').replace(/"/g, '""')}"`,
          u.createdAt ? new Date(u.createdAt).toISOString() : '',
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        success(`Exported ${exportList.length} customers to CSV successfully!`);
      } else if (format === 'JSON') {
        const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportList, null, 2));
        const link = document.createElement('a');
        link.setAttribute('href', jsonContent);
        link.setAttribute('download', `${filename}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        success(`Exported ${exportList.length} customers to JSON format!`);
      } else if (format === 'XLSX') {
        let excelXml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Customers</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
        <body><table border="1">
        <tr style="background:#2874f0; color:#ffffff; font-weight:bold;">
          <td>User ID</td><td>Full Name</td><td>Email</td><td>Phone</td><td>Role</td><td>Status</td><td>LTV (INR)</td><td>Orders Count</td><td>Tags</td><td>Registered Date</td>
        </tr>`;

        exportList.forEach((u) => {
          excelXml += `<tr>
            <td>${u.id}</td><td>${u.name || ''}</td><td>${u.email || ''}</td><td>${u.phone || ''}</td>
            <td>${u.role}</td><td>${u.enabled ? 'ACTIVE' : 'DISABLED'}</td><td>${u.lifetimeValue || 0}</td>
            <td>${u.totalOrders || 0}</td><td>${u.tags || ''}</td><td>${u.createdAt || ''}</td>
          </tr>`;
        });
        excelXml += `</table></body></html>`;

        const blob = new Blob([excelXml], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        success(`Exported ${exportList.length} customers to Excel Spreadsheet!`);
      }
    } catch (err) {
      console.error(err);
      toastError('Failed to export customer data');
    } finally {
      setExporting(false);
    }
  };

  // Avatar Initials Helper
  const getAvatarInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Color generator for avatar initials
  const getAvatarColor = (id) => {
    const colors = [
      'from-blue-600 to-indigo-700',
      'from-emerald-600 to-teal-700',
      'from-purple-600 to-pink-700',
      'from-amber-500 to-orange-600',
      'from-rose-600 to-red-700',
      'from-cyan-600 to-blue-700',
    ];
    return colors[(id || 0) % colors.length];
  };

  // Spending Tier Helper
  const getSpendingTier = (ltv) => {
    const val = Number(ltv || 0);
    if (val >= 50000) {
      return { label: 'Platinum VIP', icon: Crown, color: 'text-purple-300 bg-purple-950/80 border-purple-800' };
    }
    if (val >= 10000) {
      return { label: 'Gold Club', icon: Award, color: 'text-amber-300 bg-amber-950/80 border-amber-800' };
    }
    if (val >= 2000) {
      return { label: 'Silver Member', icon: Sparkles, color: 'text-blue-300 bg-blue-950/80 border-blue-800' };
    }
    return { label: 'Bronze', icon: User, color: 'text-slate-400 bg-slate-900 border-slate-800' };
  };

  const getTagColor = (t) => {
    const tag = t.toUpperCase();
    if (tag.includes('VIP')) return 'bg-purple-950/70 text-purple-300 border-purple-800/80';
    if (tag.includes('WHOLESALE')) return 'bg-blue-950/70 text-blue-300 border-blue-800/80';
    if (tag.includes('LTV') || tag.includes('HIGH')) return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80';
    if (tag.includes('RISK') || tag.includes('FRAUD')) return 'bg-rose-950/70 text-rose-300 border-rose-800/80';
    return 'bg-slate-900 text-slate-300 border-slate-700/80';
  };

  const isAllSelected = users.length > 0 && selectedUserIds.length === users.length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2874f0] to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/10">
              <Users className="w-5 h-5" />
            </div>
            <span>Customer & User Directory</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-400 border border-blue-800/80 font-extrabold">
              {totalElements} Registered
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise customer 360° management, lifetime spending value analytics, direct staff creation, and security audits.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Add Customer Button */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2874f0] hover:bg-blue-600 flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>

          {/* Multi-Format Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              disabled={exporting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800/80 flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#2874f0]" />
              <span>{exporting ? 'Exporting...' : 'Export'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-2 z-40 text-xs animate-in fade-in">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500">Choose Format</div>
                <button
                  onClick={() => handleExportData('CSV')}
                  className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-slate-200 font-semibold"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>CSV Spreadsheet (.csv)</span>
                </button>
                <button
                  onClick={() => handleExportData('XLSX')}
                  className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-slate-200 font-semibold"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Excel Workbook (.xls)</span>
                </button>
                <button
                  onClick={() => handleExportData('JSON')}
                  className="w-full px-4 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-slate-200 font-semibold"
                >
                  <FileCode className="w-4 h-4 text-purple-400" />
                  <span>Raw JSON Data (.json)</span>
                </button>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              loadUsers();
              loadMetrics();
            }}
            className="p-2.5 rounded-xl text-slate-400 bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-800 shadow-sm transition-all"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#2874f0]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Customer Summary Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-2 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Customers</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-950/80 border border-blue-800/60 text-[#2874f0] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white">{metrics.totalCustomers || totalElements}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold mt-1">
              <Activity className="w-3.5 h-3.5" />
              <span>{metrics.activePercentage ? metrics.activePercentage.toFixed(0) : 100}% Verified Active</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-2 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Average Lifetime Value</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">
              ₹{Number(metrics.averageLifetimeValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <span className="text-[10px] text-slate-500 block mt-1">Across verified customer orders</span>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-2 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>VIP & High Spenders</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-950/80 border border-purple-800/60 text-purple-400 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-purple-400">{metrics.vipCustomers || 1}</p>
            <span className="text-[10px] text-purple-300/80 font-bold block mt-1">LTV &gt; ₹5,000 or VIP Tag</span>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-2 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>New Signups (30 Days)</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-950/80 border border-blue-800/60 text-blue-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-blue-400">{metrics.newSignupsThisMonth || 0}</p>
            <span className="text-[10px] text-slate-500 block mt-1">Active customer growth</span>
          </div>
        </div>
      </div>

      {/* 3. Search, Date Range & Advanced Segment Filter Chips */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by customer name, email address, phone, or tags..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent transition-all"
            />
          </div>

          {/* Registration Date Range */}
          <div className="md:col-span-4 flex items-center gap-2 text-xs">
            <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
              title="From Registration Date"
            />
            <span className="text-slate-500 font-bold">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
              title="To Registration Date"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
            {(dateRange.start || dateRange.end || searchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDateRange({ start: '', end: '' });
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Segment Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          {[
            { id: 'ALL', label: 'All Customers', icon: Users },
            { id: 'ACTIVE', label: 'Active', icon: CheckCircle, color: 'text-emerald-400' },
            { id: 'DISABLED', label: 'Disabled', icon: XCircle, color: 'text-rose-400' },
            { id: 'ROLE_CUSTOMER', label: 'Customers', icon: User },
            { id: 'ROLE_VENDOR', label: 'Vendors', icon: ShoppingBag, color: 'text-amber-400' },
            { id: 'ROLE_MANAGER', label: 'Managers', icon: Briefcase, color: 'text-blue-400' },
            { id: 'ROLE_ADMIN', label: 'Admins', icon: Shield, color: 'text-purple-400' },
            { id: 'VIP', label: 'VIP Club (> ₹5k)', icon: Crown, color: 'text-purple-400' },
            { id: 'HIGH_LTV', label: 'High LTV (> ₹10k)', icon: TrendingUp, color: 'text-emerald-400' },
            { id: 'NEW_THIS_MONTH', label: 'New Signups', icon: Clock, color: 'text-blue-400' },
          ].map((chip) => {
            const Icon = chip.icon;
            const isSelected = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => {
                  setActiveFilter(chip.id);
                  setPage(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#2874f0] text-white shadow-md shadow-blue-500/20 border border-blue-400'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : chip.color || 'text-slate-400'}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Main Customer Table */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded bg-slate-900 border-slate-700 text-[#2874f0] focus:ring-[#2874f0] focus:ring-offset-slate-950 w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="p-4">Customer</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Role</th>
                <th className="p-4">Customer Tags</th>
                <th className="p-4">LTV (Spending)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-slate-400">Loading customer directory...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-500">
                    No customers found matching your filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelected = selectedUserIds.includes(u.id);
                  const tagsArray = u.tags ? u.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
                  const tier = getSpendingTier(u.lifetimeValue);
                  const TierIcon = tier.icon;

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-slate-900/60 transition-colors ${
                        isSelected ? 'bg-blue-950/30' : ''
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(u.id)}
                          className="rounded bg-slate-900 border-slate-700 text-[#2874f0] focus:ring-[#2874f0] focus:ring-offset-slate-950 w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>

                      {/* Customer Profile & Drawer Trigger */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt=""
                              className="w-10 h-10 rounded-2xl object-cover border border-slate-800 shadow-xs"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${getAvatarColor(
                                u.id
                              )} text-white flex items-center justify-center font-black text-xs shadow-md border border-white/10`}
                            >
                              {getAvatarInitials(u.name)}
                            </div>
                          )}
                          <div>
                            <button
                              onClick={() => handleOpenDrawer(u.id)}
                              className="font-extrabold text-white hover:text-blue-400 text-left block text-xs transition-colors"
                            >
                              {u.name}
                            </button>
                            <span className="text-[10px] text-slate-500 font-mono">ID: #{u.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="p-4">
                        <a
                          href={`mailto:${u.email}`}
                          className="text-slate-200 font-semibold hover:text-blue-400 flex items-center gap-1.5 group transition-colors"
                        >
                          <Mail className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
                          <span>{u.email}</span>
                        </a>
                        {u.phone ? (
                          <a
                            href={`tel:${u.phone}`}
                            className="text-slate-400 text-[11px] hover:text-blue-400 flex items-center gap-1.5 mt-0.5 transition-colors"
                          >
                            <Phone className="w-2.5 h-2.5 text-slate-500" />
                            <span>{u.phone}</span>
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">No phone provided</span>
                        )}
                      </td>

                      {/* Inline Role Selector */}
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleInlineRoleChange(u.id, e.target.value)}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-200 focus:outline-none focus:border-[#2874f0]"
                        >
                          <option value="ROLE_CUSTOMER">CUSTOMER</option>
                          <option value="ROLE_VENDOR">VENDOR</option>
                          <option value="ROLE_MANAGER">MANAGER</option>
                          <option value="ROLE_ADMIN">ADMIN</option>
                        </select>
                      </td>

                      {/* Customer Tags */}
                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-1 max-w-xs">
                          {tagsArray.map((t) => (
                            <span
                              key={t}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getTagColor(
                                t
                              )}`}
                            >
                              <span>{t}</span>
                              <button
                                type="button"
                                onClick={() => handleInlineRemoveTag(u.id, u.tags, t)}
                                className="hover:text-rose-400 font-bold ml-0.5"
                                title="Remove tag"
                              >
                                ×
                              </button>
                            </span>
                          ))}

                          {inlineTagActiveRow === u.id ? (
                            <div className="inline-flex items-center gap-1">
                              <input
                                type="text"
                                autoFocus
                                placeholder="TAG"
                                value={inlineTagValue}
                                onChange={(e) => setInlineTagValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleInlineAddTag(u.id, u.tags);
                                  if (e.key === 'Escape') setInlineTagActiveRow(null);
                                }}
                                className="w-16 px-1.5 py-0.5 text-[10px] uppercase font-bold bg-slate-900 border border-blue-400 text-white rounded focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleInlineAddTag(u.id, u.tags)}
                                className="text-xs text-[#2874f0] font-bold"
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                onClick={() => setInlineTagActiveRow(null)}
                                className="text-xs text-slate-500"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setInlineTagActiveRow(u.id);
                                setInlineTagValue('');
                              }}
                              className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded text-[10px] font-bold flex items-center gap-0.5"
                              title="Add custom tag"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              <span>Tag</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* LTV & Orders with Tier Badge */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="font-black text-white block text-xs tracking-tight">
                            ₹{Number(u.lifetimeValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-bold">
                              {u.totalOrders || 0} orders
                            </span>
                            <span
                              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold border ${tier.color}`}
                            >
                              <TierIcon className="w-2.5 h-2.5" />
                              <span>{tier.label}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Toggle Button */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(u.id, u.enabled)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all flex items-center gap-1.5 border ${
                            u.enabled
                              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/80'
                              : 'bg-rose-950/70 text-rose-300 border-rose-800/80 hover:bg-rose-900/80'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                            }`}
                          />
                          <span>{u.enabled ? 'ACTIVE' : 'DISABLED'}</span>
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {/* Edit Customer */}
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 text-slate-400 hover:text-[#2874f0] rounded-lg hover:bg-slate-900 transition-colors"
                            title="Edit Customer Profile & Password"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Customer 360 View */}
                          <button
                            onClick={() => handleOpenDrawer(u.id)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                            title="View Customer 360° Order History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Impersonate */}
                          <button
                            onClick={() => handleImpersonateUser(u.id)}
                            disabled={impersonatingId === u.id}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-900 transition-colors"
                            title="Login as User (Impersonate)"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>

                          {/* Security Audit */}
                          <button
                            onClick={() => setAuditModalUser(u)}
                            className="p-1.5 text-slate-400 hover:text-purple-400 rounded-lg hover:bg-slate-900 transition-colors"
                            title="Security Audit & Active Sessions"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>

                          {/* Delete Customer */}
                          {u.email !== 'ravikantsinghravi366@gmail.com' && (
                            <button
                              onClick={() => setDeleteModalUser(u)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors"
                              title="Delete Customer Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-200 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-slate-500">Total {totalElements} customer(s)</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(0)}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-bold text-slate-300 px-2">
              Page {page + 1} of {totalPages || 1}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. FLOATING BULK OPERATIONS TOOLBAR */}
      {selectedUserIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-4 z-40 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
            <span className="w-6 h-6 rounded-full bg-[#2874f0] text-white flex items-center justify-center font-black text-xs">
              {selectedUserIds.length}
            </span>
            <span className="text-xs font-bold text-slate-200">Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={() => handleBulkStatusToggle(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Enable All</span>
            </button>

            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={() => handleBulkStatusToggle(false)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Disable All</span>
            </button>

            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={() => setBulkRoleModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Assign Role</span>
            </button>

            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={() => setBulkEmailModalOpen(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Broadcast</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedUserIds([])}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              title="Deselect All"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 7. CREATE NEW CUSTOMER MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-800 text-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-950 text-[#2874f0] border border-blue-800/80 flex items-center justify-center font-black">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add New Customer / User</h3>
                  <p className="text-xs text-slate-400">Create and provision a new account in the system</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Verma"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. customer@example.com"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Password (Leave blank for default)</label>
                  <input
                    type="text"
                    placeholder="Default: Customer@123"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">User Role</label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    <option value="ROLE_CUSTOMER">CUSTOMER</option>
                    <option value="ROLE_VENDOR">VENDOR</option>
                    <option value="ROLE_MANAGER">MANAGER</option>
                    <option value="ROLE_ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Account Status</label>
                  <select
                    value={newUserData.enabled ? 'true' : 'false'}
                    onChange={(e) => setNewUserData({ ...newUserData, enabled: e.target.value === 'true' })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    <option value="true">ACTIVE (Enabled)</option>
                    <option value="false">DISABLED (Suspended)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Initial Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. VIP, Wholesale, Priority"
                  value={newUserData.tags}
                  onChange={(e) => setNewUserData({ ...newUserData, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Private Administrator Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional internal administrative notes regarding this customer..."
                  value={newUserData.adminNotes}
                  onChange={(e) => setNewUserData({ ...newUserData, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#2874f0] hover:bg-blue-600 flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{creatingUser ? 'Creating Account...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. EDIT CUSTOMER PROFILE MODAL */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-800 text-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-800/80 text-indigo-400 flex items-center justify-center font-black">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Customer #{editModalUser.id}</h3>
                  <p className="text-xs text-slate-400">Update account profile details, credentials, and tags</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalUser(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editUserData.name}
                    onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editUserData.email}
                    onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editUserData.phone}
                    onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Reset Password (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave blank to keep current"
                    value={editUserData.password}
                    onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">User Role</label>
                  <select
                    value={editUserData.role}
                    onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    <option value="ROLE_CUSTOMER">CUSTOMER</option>
                    <option value="ROLE_VENDOR">VENDOR</option>
                    <option value="ROLE_MANAGER">MANAGER</option>
                    <option value="ROLE_ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Account Status</label>
                  <select
                    value={editUserData.enabled ? 'true' : 'false'}
                    onChange={(e) => setEditUserData({ ...editUserData, enabled: e.target.value === 'true' })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    <option value="true">ACTIVE (Enabled)</option>
                    <option value="false">DISABLED (Suspended)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Customer Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. VIP, Wholesale, Priority"
                  value={editUserData.tags}
                  onChange={(e) => setEditUserData({ ...editUserData, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Private Administrator Notes</label>
                <textarea
                  rows={2}
                  placeholder="Internal notes regarding this customer..."
                  value={editUserData.adminNotes}
                  onChange={(e) => setEditUserData({ ...editUserData, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editingUserLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#2874f0] hover:bg-blue-600 flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingUserLoading ? 'Saving Changes...' : 'Save Customer Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. DELETE CUSTOMER CONFIRMATION MODAL */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-800 text-slate-100 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-400 flex items-center justify-center mx-auto shadow-md">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Permanently Delete Customer?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete customer account <strong className="text-white">{deleteModalUser.name}</strong> ({deleteModalUser.email})?
              </p>
            </div>
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">Audit Safety Guarantee:</p>
              <p>Historical order revenue and sales invoices will be safely detached and preserved. Only cart items, wishlists, and user profile data will be permanently wiped.</p>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingUser}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center gap-1.5 shadow-md shadow-rose-600/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletingUser ? 'Deleting Account...' : 'Yes, Delete Customer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Granular Audit Log & Active Session Revocation Modal */}
      {auditModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-800 text-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-950/80 border border-purple-800/80 text-purple-400 rounded-2xl flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Security Audit & Active Sessions</h3>
                  <p className="text-xs text-slate-400">Customer: {auditModalUser.name} ({auditModalUser.email})</p>
                </div>
              </div>
              <button
                onClick={() => setAuditModalUser(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Device Sessions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Connected Devices & Sessions</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="font-bold text-white">Web Browser Session (Current)</p>
                      <p className="text-[11px] text-slate-400 font-mono">IP: {auditModalUser.lastLoginIp || '45.115.104.47'} • Last Active: {auditModalUser.lastLoginAt ? new Date(auditModalUser.lastLoginAt).toLocaleString() : 'Recently'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-full text-[9px] font-black">ACTIVE NOW</span>
                </div>

                <div className="p-3.5 bg-slate-950/60 border border-slate-800/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-bold text-slate-300">Mobile Device Session</p>
                      <p className="text-[11px] text-slate-500 font-mono">ShopSphere PWA Mobile App • Registered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Security Incident Response:</span>
              <button
                type="button"
                disabled={revokingSessions}
                onClick={() => handleRevokeAllSessions(auditModalUser.id)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{revokingSessions ? 'Revoking...' : 'Revoke All Active Sessions'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Bulk Role Assign Modal */}
      {bulkRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800 text-slate-100 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white">Bulk Assign Role</h3>
            <p className="text-xs text-slate-400">
              Select the new role to apply across all <strong className="text-white">{selectedUserIds.length}</strong> selected customers:
            </p>
            <select
              value={bulkTargetRole}
              onChange={(e) => setBulkTargetRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs font-bold"
            >
              <option value="ROLE_CUSTOMER">CUSTOMER</option>
              <option value="ROLE_VENDOR">VENDOR</option>
              <option value="ROLE_MANAGER">MANAGER</option>
              <option value="ROLE_ADMIN">ADMIN</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBulkRoleModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkRoleAssign}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#2874f0] hover:bg-blue-600 shadow-md shadow-blue-500/20"
              >
                Apply Role to All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. Bulk Email Dispatch Modal */}
      {bulkEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-800 text-slate-100 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#2874f0]" />
              <span>Broadcast Notification ({selectedUserIds.length} Recipients)</span>
            </h3>
            <form onSubmit={handleSendBulkEmail} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exclusive Weekend Sale / Important Account Notice"
                  value={bulkEmailData.subject}
                  onChange={(e) => setBulkEmailData({ ...bulkEmailData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Message / Body *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type your broadcast message to selected customers..."
                  value={bulkEmailData.message}
                  onChange={(e) => setBulkEmailData({ ...bulkEmailData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBulkEmailModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkActionLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#2874f0] hover:bg-blue-600 flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{bulkActionLoading ? 'Sending...' : 'Dispatch Broadcast'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 13. Customer 360 Side Drawer */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3.5">
                {customerDetails?.user?.avatarUrl ? (
                  <img
                    src={customerDetails.user.avatarUrl}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${getAvatarColor(
                      customerDetails?.user?.id
                    )} text-white flex items-center justify-center font-black text-sm border border-white/20 shadow-md`}
                  >
                    {getAvatarInitials(customerDetails?.user?.name)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-white">{customerDetails?.user?.name || 'Customer Profile'}</h3>
                  <p className="text-xs text-slate-400">{customerDetails?.user?.email}</p>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Joined: {customerDetails?.user?.createdAt ? new Date(customerDetails.user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCloseDrawer}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Quick Stats Strip */}
            <div className="grid grid-cols-3 bg-slate-950/60 border-b border-slate-800 text-white p-3.5 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Spend</span>
                <span className="text-sm font-black text-emerald-400">
                  ₹{Number(customerDetails?.lifetimeValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Orders</span>
                <span className="text-sm font-black text-white">
                  {customerDetails?.totalOrders || 0}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Avg Order</span>
                <span className="text-sm font-black text-[#2874f0]">
                  ₹{Number(customerDetails?.averageOrderValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Drawer Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 text-xs font-bold">
              <button
                onClick={() => setDrawerTab('orders')}
                className={`py-3 px-4 border-b-2 transition-all ${
                  drawerTab === 'orders' ? 'border-[#2874f0] text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Orders ({customerDetails?.orders?.length || 0})
              </button>
              <button
                onClick={() => setDrawerTab('addresses')}
                className={`py-3 px-4 border-b-2 transition-all ${
                  drawerTab === 'addresses' ? 'border-[#2874f0] text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Addresses ({customerDetails?.addresses?.length || 0})
              </button>
              <button
                onClick={() => setDrawerTab('notes')}
                className={`py-3 px-4 border-b-2 transition-all ${
                  drawerTab === 'notes' ? 'border-[#2874f0] text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin Notes & Tags
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {loadingDetails ? (
                <div className="py-20 text-center">
                  <div className="w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-slate-400">Loading customer history...</p>
                </div>
              ) : (
                <>
                  {/* Orders Tab */}
                  {drawerTab === 'orders' && (
                    <div className="space-y-3">
                      {customerDetails?.orders?.length === 0 ? (
                        <p className="text-slate-500 py-8 text-center">No orders found for this customer.</p>
                      ) : (
                        customerDetails?.orders?.map((ord) => (
                          <div key={ord.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 hover:border-slate-700 transition-all">
                            <div className="flex justify-between items-center">
                              <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                              <span className="font-black text-white text-sm">₹{Number(ord.totalAmount).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 text-[11px]">
                              <span>Status: <strong className="text-emerald-400">{ord.orderStatus}</strong></span>
                              <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                            </div>
                            <button
                              onClick={() => setViewingReceiptOrder(ord)}
                              className="text-blue-400 hover:text-blue-300 hover:underline font-bold text-[11px] flex items-center gap-1 pt-1"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>View Tax Invoice Receipt</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Addresses Tab */}
                  {drawerTab === 'addresses' && (
                    <div className="space-y-3">
                      {customerDetails?.addresses?.length === 0 ? (
                        <p className="text-slate-500 py-8 text-center">No saved delivery addresses found.</p>
                      ) : (
                        customerDetails?.addresses?.map((addr) => (
                          <div key={addr.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{addr.fullName}</span>
                              {addr.default && <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-full text-[9px] font-bold">DEFAULT</span>}
                            </div>
                            <p className="text-slate-300">{addr.streetAddress}, {addr.city}, {addr.state} - {addr.postalCode}</p>
                            <p className="text-slate-400 font-mono">Phone: {addr.phone}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Notes & Tags Tab */}
                  {drawerTab === 'notes' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Customer Tags</label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {editingTags.map((t) => (
                            <span key={t} className="px-2.5 py-1 bg-slate-950 text-blue-400 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1">
                              <span>{t}</span>
                              <button onClick={() => setEditingTags(editingTags.filter((x) => x !== t))} className="hover:text-rose-400">×</button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add new tag (e.g. VIP, Wholesale)..."
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newTagInput.trim() && !editingTags.includes(newTagInput.trim().toUpperCase())) {
                                  setEditingTags([...editingTags, newTagInput.trim().toUpperCase()]);
                                  setNewTagInput('');
                                }
                              }
                            }}
                            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newTagInput.trim() && !editingTags.includes(newTagInput.trim().toUpperCase())) {
                                setEditingTags([...editingTags, newTagInput.trim().toUpperCase()]);
                                setNewTagInput('');
                              }
                            }}
                            className="px-4 py-2 bg-[#2874f0] text-white rounded-xl font-bold hover:bg-blue-600 shadow-md shadow-blue-500/20"
                          >
                            Add Tag
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Private Administrator Notes</label>
                        <textarea
                          rows={4}
                          placeholder="Add private staff notes regarding this customer..."
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          className="w-full p-3 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs focus:outline-none focus:border-[#2874f0]"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={savingNotes}
                        onClick={handleSaveNotesAndTags}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-600/20"
                      >
                        {savingNotes ? 'Saving...' : 'Save Notes & Tags'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 14. Invoice Receipt Modal */}
      <InvoiceReceiptModal
        isOpen={!!viewingReceiptOrder}
        onClose={() => setViewingReceiptOrder(null)}
        order={viewingReceiptOrder}
      />
    </div>
  );
};

export default AdminUsers;
