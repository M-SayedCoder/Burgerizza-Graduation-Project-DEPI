import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { profileService } from '../../services/profileService';
import { profileSchema, type ProfileFormValues } from '../../utils/validators';
import { ROUTES } from '../../constants/routes';
import { formatDate, formatCurrency } from '../../utils/formatters';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import './Profile.css';

export const Profile: React.FC = () => {
  useAuth();
  const { orders, loading: ordersLoading } = useOrders();
  
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');
  const [profileLoading, setProfileLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      bio: '',
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const profile = await profileService.getProfile();
        setValue('name', profile.name);
        setValue('email', profile.email);
        setValue('phone', profile.phone || '');
        setValue('bio', profile.bio || '');
        setAvatar(profile.avatar || '');
      } catch (err) {
        console.error('Failed to load profile details:', err);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    setSuccessMsg(null);
    try {
      await profileService.updateProfile(data);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarChange = () => {
    // Mock image swap
    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80'
    ];
    const rand = avatars[Math.floor(Math.random() * avatars.length)];
    setAvatar(rand);
  };

  if (profileLoading) return <Spinner size="lg" className="vh-100" />;

  return (
    <div className="container-fluid edit-bg animate-fade-in py-5">
      <div className="profile-wrapper shadow-lg bg-white rounded-4 p-3 p-md-5">
        
        {/* Header Back Link */}
        <div className="d-flex align-items-center mb-4">
          <Link to={ROUTES.HOME} className="btn btn-light rounded-circle p-2 shadow-sm d-inline-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
            ←
          </Link>
          <h5 className="mb-0 fw-bold">My Profile</h5>
        </div>

        {/* Tab Selection */}
        <div className="d-flex border-bottom mb-4">
          <button
            className={`btn border-0 py-2.5 px-4 fw-bold ${activeTab === 'info' ? 'text-orange border-bottom border-2 border-orange' : 'text-muted'}`}
            onClick={() => setActiveTab('info')}
          >
            Profile Info
          </button>
          <button
            className={`btn border-0 py-2.5 px-4 fw-bold ${activeTab === 'orders' ? 'text-orange border-bottom border-2 border-orange' : 'text-muted'}`}
            onClick={() => setActiveTab('orders')}
          >
            Order History
          </button>
        </div>

        {activeTab === 'info' ? (
          <div>
            {/* Avatar section */}
            <div className="profile-img-wrapper mb-4 text-center">
              <div
                className="profile-img shadow-sm border border-3 border-white overflow-hidden mx-auto"
                style={{ width: '130px', height: '130px', borderRadius: '50%' }}
              >
                <img
                  src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
                  alt="Avatar"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <button
                type="button"
                className="edit-btn shadow btn btn-orange btn-sm mt-2 rounded-circle"
                onClick={handleAvatarChange}
                style={{ width: '36px', height: '36px' }}
              >
                <i className="bi bi-pencil" />
              </button>
            </div>

            {/* Success Alert */}
            {successMsg && (
              <div className="alert alert-success py-2 px-3 fs-7 mb-3 text-center" role="alert">
                {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label text-uppercase fs-8 text-muted fw-bold mb-1">
                  <i className="bi bi-person me-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  className={`form-control custom-input ${errors.name ? 'is-invalid' : ''}`}
                  {...register('name')}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label text-uppercase fs-8 text-muted fw-bold mb-1">
                  <i className="bi bi-envelope me-2" />
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control custom-input ${errors.email ? 'is-invalid' : ''}`}
                  {...register('email')}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label text-uppercase fs-8 text-muted fw-bold mb-1">
                  <i className="bi bi-telephone me-2" />
                  Phone Number
                </label>
                <input
                  type="text"
                  className={`form-control custom-input ${errors.phone ? 'is-invalid' : ''}`}
                  {...register('phone')}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label text-uppercase fs-8 text-muted fw-bold mb-1">
                  <i className="bi bi-chat-left-text me-2" />
                  Bio
                </label>
                <textarea
                  className={`form-control custom-input ${errors.bio ? 'is-invalid' : ''}`}
                  style={{ height: '100px' }}
                  {...register('bio')}
                />
                {errors.bio && <div className="invalid-feedback">{errors.bio.message}</div>}
              </div>

              <div className="d-grid mt-4">
                <Button type="submit" variant="orange" size="lg" className="rounded-pill">
                  SAVE
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h5 className="fw-bold mb-3">Order History</h5>
            {ordersLoading ? (
              <Spinner />
            ) : orders.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }} />
                <p className="text-muted mt-3">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {orders.map((order) => (
                  <div key={order.id} className="card border p-3 rounded-3 shadow-sm bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-dark">{order.id}</span>
                      <span className={`badge ${
                        order.status === 'delivered' ? 'bg-success' : 'bg-warning text-dark'
                      } px-3 py-1.5 rounded-pill text-uppercase`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="small text-muted mb-2">
                      Ordered on: {formatDate(order.createdAt)}
                    </div>
                    <div className="small mb-3">
                      {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                    </div>
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <span className="fw-bold">Total:</span>
                      <span className="text-orange fw-bold">{formatCurrency(order.total || 15.00)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;