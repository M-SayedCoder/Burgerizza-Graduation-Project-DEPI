import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { addressSchema, type AddressFormValues } from '../../utils/validators';
import { profileService } from '../../services/profileService';
import type { Address as AddressType } from '../../types/profile.types';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import './Address.css';

export const Address: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromCheckout = location.state?.fromCheckout;

  const [currentPage, setCurrentPage] = useState<1 | 2 | 3>(1);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<'home' | 'work' | 'other'>('home');
  const [darkTheme, setDarkTheme] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleEnableLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setCurrentPage(2);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setValue('street', `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`);
        setCurrentPage(2);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Permission denied. Please enter address manually.');
        setCurrentPage(2);
      }
    );
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: '',
      postCode: '',
      apartment: '',
      label: 'home',
    },
  });

  useEffect(() => {
    register('label');
    setValue('label', 'home');
  }, [register, setValue]);

  useEffect(() => {
    // Load existing theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkTheme(true);
      document.body.classList.add('dark');
    }
    
    // Load user addresses
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const profile = await profileService.getProfile();
        setAddresses(profile.addresses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const toggleTheme = () => {
    const newVal = !darkTheme;
    setDarkTheme(newVal);
    if (newVal) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleStartEdit = (addr: AddressType) => {
    setEditingAddressId(addr.id);
    setSelectedLabel(addr.label);
    setValue('street', addr.street);
    setValue('postCode', addr.postCode);
    setValue('apartment', addr.apartment);
    setValue('label', addr.label);
    setCurrentPage(2);
  };

  const handleStartCreate = () => {
    setEditingAddressId(null);
    reset({
      street: '',
      postCode: '',
      apartment: '',
    });
    setSelectedLabel('home');
    setLocationError(null);
    setCurrentPage(2);
  };

  const handleLocationSubmit = async (data: AddressFormValues) => {
    try {
      if (editingAddressId) {
        await profileService.deleteAddress(editingAddressId);
      }
      const added = await profileService.addAddress({
        street: data.street,
        postCode: data.postCode,
        apartment: data.apartment,
        label: selectedLabel,
      });
      if (editingAddressId) {
        setAddresses((prev) => prev.map((a) => a.id === editingAddressId ? added : a));
        setEditingAddressId(null);
      } else {
        setAddresses((prev) => [...prev, added]);
      }
      setShowSuccessModal(true);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await profileService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    if (fromCheckout) {
      navigate('/checkout');
    } else {
      setCurrentPage(3); // Go to my addresses tab
    }
  };

  if (loading) return <Spinner size="lg" className="vh-100" />;

  return (
    <div className="wrapper mx-auto animate-fade-in py-5">
      {/* Theme Toggle Button */}
      <button
        type="button"
        className="theme-toggle border-0 bg-transparent"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
      >
        {darkTheme ? '☀️' : '🌙'}
      </button>

      {/* Progress Bar Indicator */}
      <div className="progress-container">
        <div
          className="progress-bar bg-orange transition-all"
          style={{ width: `${currentPage * 33.3}%` }}
        />
      </div>

      <div className="pages-container mt-4">
        {/* Step 1: ACCESS LOCATION */}
        {currentPage === 1 && (
          <div className="page active" id="page1">
            <div className="page-card text-center p-4 shadow bg-white rounded-4">
              <div className="access-icon fs-1 mb-3">📍</div>
              <h1 className="fw-bold fs-4 mb-3">ACCESS LOCATION</h1>
              <div className="access-message text-muted mb-4">
                Burgerizza will access your location while using the app to find restaurants near you.
              </div>
              <button
                type="button"
                className="btn btn-orange w-100 py-2.5 rounded-pill fw-bold"
                onClick={handleEnableLocation}
              >
                Enable Location
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Add Address */}
        {currentPage === 2 && (
          <div className="page active" id="page2">
            <div className="page-card p-4 shadow bg-white rounded-4">
              <h2 className="fw-bold fs-4 mb-4 text-center">Add Address</h2>
              
              <form id="address-form" onSubmit={handleSubmit(handleLocationSubmit)}>
                {locationError && (
                  <div className="alert alert-warning py-2 px-3 text-center mb-3 small" role="alert">
                    <i className="bi bi-geo-alt-fill me-1" />
                    {locationError}
                  </div>
                )}
                <div className="mb-3">
                  <label className="input-label fw-semibold text-muted fs-8 mb-1 d-block">Street</label>
                  <input
                    className={`input-field ${errors.street ? 'is-invalid' : ''}`}
                    type="text"
                    {...register('street')}
                  />
                  {errors.street && <div className="invalid-feedback">{errors.street.message}</div>}
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="input-label fw-semibold text-muted fs-8 mb-1 d-block">Post Code</label>
                    <input
                      className="input-field"
                      type="text"
                      {...register('postCode')}
                    />
                  </div>
                  <div className="col-6">
                    <label className="input-label fw-semibold text-muted fs-8 mb-1 d-block">Apartment</label>
                    <input
                      className="input-field"
                      type="text"
                      {...register('apartment')}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="input-label fw-semibold text-muted fs-8 mb-2 d-block">Label As</label>
                  <div className="label-group d-flex gap-2">
                    {(['home', 'work', 'other'] as const).map((lbl) => (
                      <span
                        key={lbl}
                        className={`label-chip cursor-pointer badge px-3 py-2 border rounded-pill ${
                          selectedLabel === lbl
                            ? 'bg-orange text-white border-orange'
                            : 'bg-light text-dark'
                        }`}
                        onClick={() => {
                          setSelectedLabel(lbl);
                          setValue('label', lbl);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {lbl.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <Button type="submit" variant="orange" className="w-100 py-2.5 rounded-pill fw-bold">
                  Save Location
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: My Addresses */}
        {currentPage === 3 && (
          <div className="page active" id="page3">
            <div className="page-card p-4 shadow bg-white rounded-4">
              <h2 className="fw-bold fs-4 mb-4 text-center">My Addresses</h2>
              
              {addresses.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-geo-alt text-muted fs-1" />
                  <p className="text-muted mt-2">No addresses saved yet.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3 mb-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="address-item p-3 border rounded-3 d-flex justify-content-between align-items-center bg-light"
                    >
                      <div className="d-flex flex-column gap-1">
                        <span className={`badge ${
                          addr.label === 'work' ? 'bg-info text-white' : 'bg-orange text-white'
                        } align-self-start`}>
                          {addr.label.toUpperCase()}
                        </span>
                        <div className="text-dark small mt-1">{addr.street}</div>
                      </div>
                      <div className="address-actions d-flex gap-2 cursor-pointer">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary p-1 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => handleStartEdit(addr)}
                          title="Edit address"
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger p-1 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => handleDeleteAddress(addr.id)}
                          title="Delete address"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="add-new w-100 border border-dashed text-center py-3 rounded-3 cursor-pointer text-orange fw-bold bg-transparent"
                onClick={handleStartCreate}
                style={{ cursor: 'pointer' }}
              >
                <span>Add New Address</span> <i className="bi bi-plus" />
              </button>

              <div className="footer text-center text-muted small mt-4">
                Burgerizza • fresh delivery
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Steps Navigation Buttons */}
      <div className="nav-buttons d-flex justify-content-between mt-4">
        <button
          type="button"
          className="btn btn-secondary px-4 py-2"
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage((prev) => (prev - 1) as any);
            }
          }}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {currentPage === 2 ? (
          <button
            type="submit"
            form="address-form"
            className="btn btn-orange px-4 py-2"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-orange px-4 py-2"
            onClick={() => {
              if (currentPage < 3) {
                setCurrentPage((prev) => (prev + 1) as any);
              }
            }}
            disabled={currentPage === 3}
          >
            Next
          </button>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
          onClick={handleCloseModal}
        />
      )}
      <div
        className={`success-modal modal fade ${showSuccessModal ? 'show d-block' : ''}`}
        tabIndex={-1}
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center p-5 rounded-4 border-0">
            <div
              className="check text-white bg-success rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
              style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
            >
              ✔
            </div>
            <h3 className="fw-bold fs-4 mb-3">Location Saved Successfully</h3>
            <button
              type="button"
              className="btn btn-orange px-4 py-2.5 rounded-pill fw-bold"
              onClick={handleCloseModal}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
