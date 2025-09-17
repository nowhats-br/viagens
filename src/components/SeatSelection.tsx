import React from 'react';
import { useBooking } from '../context/BookingContext';
import BusLayout from './BusLayout';

interface SeatSelectionProps {
  onComplete: () => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ onComplete }) => {
  const { selectedSeats, seats } = useBooking();

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Por favor, selecione pelo menos um assento');
      return;
    }
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-center flex-shrink-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-blue-600 tracking-tighter">JAN</div>
              <div className="text-xs sm:text-sm font-medium text-gray-500 -mt-1">2026</div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Goiânia, GO → Açailândia, MA
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Ida: 06/JAN • Embarques a partir das 21:00 • Duração: ~22h
              </p>
            </div>
          </div>
          <div className="text-right sm:text-right">
            <p className="text-xs sm:text-sm text-gray-500">Total</p>
            <span className="text-lg sm:text-2xl font-bold text-blue-600">
              R$ {getTotalPrice() > 0 ? getTotalPrice().toFixed(2).replace('.',',') : '0,00'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <BusLayout />
        
        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-600"></div>
              <span>Livre</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded border-2 border-yellow-600"></div>
              <span>Selecionado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-400 rounded border-2 border-gray-500 flex items-center justify-center">
                <span className="text-white text-xs">×</span>
              </div>
              <span>Ocupado</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4">
          {selectedSeats.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Seus assentos</h3>
              <div className="mt-2 text-sm sm:text-base">
                <span className="font-medium">Assentos selecionados: </span>
                <span>
                  {selectedSeats.map(seatId => {
                    const seat = seats.find(s => s.id === seatId);
                    return seat?.seat_number;
                  }).join(', ')}
                </span>
              </div>
            </div>
          )}
          
          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className="w-full bg-gradient-to-r from-yellow-500 via-comadesma-gold to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continuar reserva
          </button>
          
          <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-4 pt-4 border-t text-xs sm:text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-purple-600">📱</span>
              <span>Passagem no celular</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-green-600">🛡️</span>
              <span>Segurança Reforçada</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-blue-600">🖨️</span>
              <span>Passagem impressa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
