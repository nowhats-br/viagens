import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Passenger, Seat, Reservation } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAdmin } from './AdminContext';

interface BookingContextType {
  passenger: Omit<Passenger, 'id' | 'created_at'> | null;
  setPassenger: (passenger: Omit<Passenger, 'id' | 'created_at'>) => void;
  seats: Seat[];
  loading: boolean;
  selectedSeats: string[];
  toggleSeatSelection: (seatId: string) => void;
  clearSelection: () => void;
  lastBookingDetails: { passenger: Passenger, reservation: Reservation, seats: Seat[] } | null;
  createBooking: (paymentMethod: string, installments: number) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const { settings } = useAdmin();
  const [passenger, setPassenger] = useState<Omit<Passenger, 'id' | 'created_at'> | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastBookingDetails, setLastBookingDetails] = useState<any>(null);

  const fetchSeats = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('seats').select('*').order('id', { ascending: true });
      if (error) throw error;
      setSeats(data || []);
    } catch (error) {
      console.error('Error fetching seats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  const toggleSeatSelection = (seatId: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };
  
  const clearSelection = () => {
    setSelectedSeats([]);
    setPassenger(null);
  };

  const createBooking = async (paymentMethod: string, installments: number) => {
    if (!passenger || selectedSeats.length === 0 || !settings) {
      throw new Error('Dados insuficientes para criar a reserva.');
    }

    // 1. Create Passenger
    const { data: passengerData, error: passengerError } = await supabase
      .from('passengers')
      .insert(passenger)
      .select()
      .single();

    if (passengerError || !passengerData) {
      throw new Error(`Erro ao criar passageiro: ${passengerError?.message}`);
    }

    // 2. Create Reservation
    const totalPrice = selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);

    const reservationToInsert = {
      passenger_id: passengerData.id,
      total_price: totalPrice,
      status: 'confirmed',
      payment_method: paymentMethod,
      installments: installments,
      expires_at: new Date(Date.now() + settings.reservation_timeout_hours * 60 * 60 * 1000).toISOString(),
    };

    const { data: reservationData, error: reservationError } = await supabase
      .from('reservations')
      .insert(reservationToInsert)
      .select()
      .single();
    
    if (reservationError || !reservationData) {
      throw new Error(`Erro ao criar reserva: ${reservationError?.message}`);
    }

    // 3. Link Seats to Reservation
    const reservationSeatsToInsert = selectedSeats.map(seatId => ({
      reservation_id: reservationData.id,
      seat_id: seatId,
    }));

    const { error: reservationSeatsError } = await supabase
      .from('reservation_seats')
      .insert(reservationSeatsToInsert);

    if (reservationSeatsError) {
      // TODO: Add rollback logic
      throw new Error(`Erro ao associar assentos: ${reservationSeatsError.message}`);
    }

    // 4. Update Seat Status
    const { error: seatUpdateError } = await supabase
      .from('seats')
      .update({ status: 'occupied' })
      .in('id', selectedSeats);

    if (seatUpdateError) {
       // TODO: Add rollback logic
      throw new Error(`Erro ao atualizar assentos: ${seatUpdateError.message}`);
    }
    
    // Store details for confirmation page
    const finalSeats = seats.filter(s => selectedSeats.includes(s.id));
    setLastBookingDetails({ passenger: passengerData, reservation: reservationData, seats: finalSeats });

    // Refresh seats for all users
    await fetchSeats();
  };

  return (
    <BookingContext.Provider
      value={{
        passenger,
        setPassenger,
        seats,
        loading,
        selectedSeats,
        toggleSeatSelection,
        clearSelection,
        createBooking,
        lastBookingDetails,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
