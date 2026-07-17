import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReservations } from '../../hooks/useReservations';
import { reservationSchema } from '../../utils/validators';
import { formatDate } from '../../utils/formatters';
import type { ReservationStatus } from '../../types/reservation.types';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export const ReservationPage: React.FC = () => {
  const { reservations, loading, error, makeReservation, cancelReservation, editReservation } = useReservations();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [editingReservationId, setEditingReservationId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      notes: '',
    },
  });

  const getStatusVariant = (status: ReservationStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'dark';
    }
  };

  const handleStartEdit = (res: any) => {
    setEditingReservationId(res.id);
    setValue('name', res.name);
    setValue('phone', res.phone);
    setValue('date', res.date);
    setValue('time', res.time);
    setValue('guests', res.guests);
    setValue('notes', res.notes);
  };

  const onSubmit = async (data: any) => {
    setSuccessMsg(null);
    try {
      if (editingReservationId) {
        await editReservation(editingReservationId, data);
        setSuccessMsg('Reservation updated successfully!');
        setEditingReservationId(null);
      } else {
        await makeReservation(data);
        setSuccessMsg('Table booked successfully! Pending confirmation.');
      }
      reset();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="fw-bold mb-2">Book A Table</h1>
          <p className="text-muted">Reserve a spot for a wonderful dining experience</p>
        </div>
      </div>

      <div className="row g-5">
        {/* Reservation Booking Form */}
        <div className="col-12 col-lg-5">
          <Card hoverable={false} className="p-4 p-md-5 border bg-white">
            <h4 className="fw-bold mb-4">Reservation Form</h4>
            
            {successMsg && (
              <div className="alert alert-success py-2 px-3 text-center mb-4" role="alert">
                {successMsg}
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger py-2 px-3 text-center mb-4" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className={`form-control custom-input ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter full name"
                  {...register('name')}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Phone Number</label>
                <input
                  type="tel"
                  className={`form-control custom-input ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="E.g., +1 234 567 890"
                  {...register('phone')}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold">Date</label>
                  <input
                    type="date"
                    className={`form-control custom-input ${errors.date ? 'is-invalid' : ''}`}
                    {...register('date')}
                  />
                  {errors.date && <div className="invalid-feedback">{errors.date.message}</div>}
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">Time</label>
                  <input
                    type="time"
                    className={`form-control custom-input ${errors.time ? 'is-invalid' : ''}`}
                    {...register('time')}
                  />
                  {errors.time && <div className="invalid-feedback">{errors.time.message}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Guests</label>
                <input
                  type="number"
                  className={`form-control custom-input ${errors.guests ? 'is-invalid' : ''}`}
                  placeholder="Number of guests"
                  {...register('guests', { valueAsNumber: true })}
                />
                {errors.guests && <div className="invalid-feedback">{errors.guests.message}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Special Notes (Optional)</label>
                <textarea
                  rows={2}
                  className="form-control custom-input"
                  placeholder="E.g., Window seat, birthday occasion..."
                  {...register('notes')}
                />
              </div>

              <Button type="submit" variant="orange" size="lg" fullWidth isLoading={loading}>
                Book Now
              </Button>
            </form>
          </Card>
        </div>

        {/* Booking History list */}
        <div className="col-12 col-lg-7">
          <h4 className="fw-bold mb-4">Reservation History</h4>
          {loading && reservations.length === 0 ? (
            <Spinner size="lg" />
          ) : reservations.length === 0 ? (
            <Card hoverable={false} className="text-center py-5">
              <i className="bi bi-calendar-event text-muted" style={{ fontSize: '3rem' }} />
              <p className="text-muted mt-3">You don't have any past reservations yet.</p>
            </Card>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reservations.map((res) => (
                <Card key={res.id} className="p-4 border d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="fw-bold mb-1 text-dark">Reservation {res.id}</h5>
                      <span className="small text-muted">Booked: {formatDate(res.createdAt)}</span>
                    </div>
                    <Badge variant={getStatusVariant(res.status)}>
                      {(res.status || '').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="bg-light p-3 rounded-3 mb-3">
                    <div className="row g-2 text-dark small">
                      <div className="col-6 col-sm-4">
                        <span className="text-muted d-block">Guests:</span>
                        <span className="fw-bold">{res.guests} people</span>
                      </div>
                      <div className="col-6 col-sm-4">
                        <span className="text-muted d-block">Date:</span>
                        <span className="fw-bold">{res.date}</span>
                      </div>
                      <div className="col-12 col-sm-4">
                        <span className="text-muted d-block">Time:</span>
                        <span className="fw-bold">{res.time}</span>
                      </div>
                    </div>
                  </div>

                  {res.notes && (
                    <div className="small text-muted mb-3 italic">
                      " {res.notes} "
                    </div>
                  )}

                  {res.status === 'pending' && (
                    <div className="d-flex justify-content-end gap-2 border-top pt-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm rounded-pill px-4"
                        onClick={() => handleStartEdit(res)}
                      >
                        Edit Details
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill px-4"
                        onClick={() => cancelReservation(res.id)}
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
