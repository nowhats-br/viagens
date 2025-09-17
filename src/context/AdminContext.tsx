import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Reservation, Passenger, AdminSettings } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AdminContextType {
  reservations: Reservation[];
  passengers: Passenger[];
  settings: AdminSettings | null;
  loading: boolean;
  updateSettings: (newSettings: Partial<AdminSettings>, newLogoFile?: File | null) => Promise<void>;
  refreshAdminData: () => void;
  getRevenue: () => number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsError) throw settingsError;
      setSettings(settingsData);

      // 2. Fetch Reservations with Passengers (Simpler Query)
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select(`*, passengers(*)`);

      if (reservationsError) throw reservationsError;

      // 3. Fetch Reservation-Seat links with Seat details
      const { data: reservationSeatsData, error: reservationSeatsError } = await supabase
        .from('reservation_seats')
        .select(`*, seats(*)`);
      
      if (reservationSeatsError) throw reservationSeatsError;

      // 4. Combine the data in JavaScript to build the final structure
      const combinedReservations = (reservationsData || []).map(reservation => {
        const seatsForThisReservation = (reservationSeatsData || []).filter(
          rs => rs.reservation_id === reservation.id
        );
        return {
          ...reservation,
          reservation_seats: seatsForThisReservation,
        };
      });

      setReservations(combinedReservations);

      // 5. Fetch all passengers for the general list
      const { data: passengersData, error: passengersError } = await supabase
        .from('passengers')
        .select('*');

      if (passengersError) throw passengersError;
      setPassengers(passengersData || []);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const updateSettings = async (newSettings: Partial<AdminSettings>, newLogoFile?: File | null) => {
    if (!settings) return;

    let finalLogoUrl = newSettings.logo_url || settings.logo_url;

    if (newLogoFile) {
      const oldLogoPath = settings.logo_url?.split('/assets/')[1];
      if (oldLogoPath) {
        await supabase.storage.from('assets').remove([oldLogoPath]);
      }

      const fileName = `public/logo-${Date.now()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, newLogoFile, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        throw new Error(`Erro ao fazer upload da nova logo: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(uploadData.path);
      finalLogoUrl = publicUrl;
    }

    const settingsToUpdate = { ...newSettings, logo_url: finalLogoUrl };

    const { data, error } = await supabase
      .from('settings')
      .update(settingsToUpdate)
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      console.error('Error updating settings:', error);
      throw new Error(`Erro ao salvar configurações: ${error.message}`);
    }

    setSettings(data);
  };
  
  const getRevenue = () => {
    return reservations
      .filter(reservation => reservation.status === 'confirmed')
      .reduce((total, reservation) => total + reservation.total_price, 0);
  };

  return (
    <AdminContext.Provider
      value={{
        reservations,
        passengers,
        settings,
        loading,
        updateSettings,
        refreshAdminData: fetchAdminData,
        getRevenue,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
