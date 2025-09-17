import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { Trip } from '../types';

interface TripSelectionProps {
  onComplete: () => void;
}

const TripSelection: React.FC<TripSelectionProps> = ({ onComplete }) => {
  const { trips, setSelectedTrip, passenger } = useBooking();
  const [searchDate, setSearchDate] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const filteredTrips = trips.filter(trip => {
    const matchesDate = !searchDate || trip.date === searchDate;
    const matchesOrigin = !origin || trip.origin.toLowerCase().includes(origin.toLowerCase());
    const matchesDestination = !destination || trip.destination.toLowerCase().includes(destination.toLowerCase());
    return matchesDate && matchesOrigin && matchesDestination;
  });

  const handleTripSelect = (trip: Trip) => {
    setSelectedTrip(trip);
    onComplete();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Olá, {passenger?.name}! Selecione sua viagem
        </h2>
        <p className="text-gray-600">Escolha a data e destino da sua viagem</p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data da Viagem
          </label>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Origem
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Cidade de origem"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destino
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Cidade de destino"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Lista de Viagens */}
      <div className="space-y-4">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma viagem encontrada para os filtros selecionados.</p>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleTripSelect(trip)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center text-lg font-semibold text-gray-800">
                      <MapPin className="w-5 h-5 mr-1 text-blue-600" />
                      {trip.origin}
                      <ArrowRight className="w-5 h-5 mx-2 text-gray-400" />
                      {trip.destination}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(trip.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {trip.time} - Duração: {trip.duration}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    R$ {trip.basePrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">a partir de</div>
                  <button className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Selecionar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TripSelection;
