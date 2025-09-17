export interface Passenger {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birth_date: string;
  created_at?: string;
}

export interface Seat {
  id: string;
  seat_number: number;
  type: 'leito' | 'semi-leito';
  floor: 'inferior' | 'superior';
  status: 'available' | 'reserved' | 'occupied';
  price: number;
}

export interface ReservationSeat {
  reservation_id: string;
  seat_id: string;
  seats: Seat; // The nested seat object
}

export interface Reservation {
  id: string;
  passenger_id: string;
  total_price: number;
  status: 'reserved' | 'confirmed' | 'expired';
  payment_method: string;
  installments: number;
  created_at: string;
  expires_at?: string;
  passengers?: Passenger; // For joined data
  reservation_seats?: ReservationSeat[]; // For joined data
}

export interface AdminSettings {
  id?: number;
  logo_url: string;
  whatsapp_number: string;
  reservation_timeout_hours: number;
  email_notifications: boolean;
  sms_notifications: boolean;
}
