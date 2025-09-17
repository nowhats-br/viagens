import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Seat } from '../types';

const BusLayout: React.FC = () => {
  const { seats, selectedSeats, toggleSeatSelection } = useBooking();

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    toggleSeatSelection(seat.id);
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.includes(seat.id)) return 'bg-yellow-500 border-yellow-600 text-white';
    switch (seat.status) {
      case 'available': return 'bg-green-500 hover:bg-green-600 border-green-600 text-white';
      case 'occupied': return 'bg-gray-400 border-gray-500 text-white cursor-not-allowed';
      default: return 'bg-gray-300 border-gray-400';
    }
  };

  const renderSeat = (seat: Seat) => {
    const isOccupied = seat.status === 'occupied';
    
    return (
      <button
        key={seat.id}
        onClick={() => handleSeatClick(seat)}
        className={`w-7 h-9 sm:w-8 sm:h-10 rounded-md text-xs font-bold transition-all border-2 relative ${getSeatColor(seat)}`}
        disabled={isOccupied}
        title={`Assento ${seat.seat_number} - ${seat.type} - R$ ${seat.price.toFixed(2)}`}
      >
        {isOccupied ? (
          <span className="text-white">×</span>
        ) : (
          <span className="text-[10px]">{seat.seat_number}</span>
        )}
      </button>
    );
  };

  const leitoSeats = seats.filter(seat => seat.type === 'leito').sort((a,b) => a.seat_number - b.seat_number);
  const semiLeitoSeats = seats.filter(seat => seat.type === 'semi-leito').sort((a,b) => a.seat_number - b.seat_number);

  return (
    <div className="bg-gray-50 p-2 sm:p-6">
      <div className="max-w-sm mx-auto bg-white rounded-lg border-2 border-gray-300 overflow-hidden shadow-lg">
        <div className="bg-gray-800 h-8 flex items-center justify-center text-xs font-bold text-white">
          MOTORISTA
        </div>

        <div className="p-2 sm:p-4 border-b-2 border-gray-200 bg-blue-50">
          <div className="text-center mb-4">
            <h4 className="text-[10px] sm:text-xs font-bold text-gray-700 bg-blue-200 rounded px-2 py-1 inline-block">
              ANDAR SUPERIOR - SEMI-LEITO (R$ 800,00)
            </h4>
          </div>
          
          <div className="space-y-1">
            {Array.from({ length: 11 }, (_, rowIndex) => (
              <div key={`upper-${rowIndex}`} className="flex justify-center items-center gap-1">
                <div className="flex gap-1">
                  {semiLeitoSeats
                    .slice(rowIndex * 4, rowIndex * 4 + 2)
                    .map(seat => renderSeat(seat))}
                </div>
                
                <div className="w-4 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
                  <div className="w-1 h-4 bg-gray-400 rounded"></div>
                </div>
                
                <div className="flex gap-1">
                  {semiLeitoSeats
                    .slice(rowIndex * 4 + 2, rowIndex * 4 + 4)
                    .map(seat => renderSeat(seat))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-2 sm:p-4 bg-green-50">
          <div className="text-center mb-4">
            <h4 className="text-[10px] sm:text-xs font-bold text-gray-700 bg-green-200 rounded px-2 py-1 inline-block">
              ANDAR INFERIOR - LEITO (R$ 950,00)
            </h4>
          </div>
          
          <div className="space-y-1">
            {Array.from({ length: 3 }, (_, rowIndex) => (
              <div key={`lower-${rowIndex}`} className="flex justify-center items-center gap-1">
                <div className="flex gap-1">
                  {leitoSeats
                    .slice(rowIndex * 4, rowIndex * 4 + 2)
                    .map(seat => renderSeat(seat))}
                </div>
                
                <div className="w-4 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
                  <div className="w-1 h-4 bg-gray-400 rounded"></div>
                </div>
                
                <div className="flex gap-1">
                  {leitoSeats
                    .slice(rowIndex * 4 + 2, rowIndex * 4 + 4)
                    .map(seat => renderSeat(seat))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 h-4"></div>
      </div>
    </div>
  );
};

export default BusLayout;
