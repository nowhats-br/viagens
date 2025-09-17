import React from 'react';
import { CheckCircle, Download, ArrowLeft, MessageCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAdmin } from '../context/AdminContext';

interface ConfirmationProps {
  onRestart: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ onRestart }) => {
  const { lastBookingDetails } = useBooking();
  const { settings } = useAdmin();

  if (!lastBookingDetails || !settings) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">Carregando dados da confirmação...</h2>
        <p className="text-gray-600 mt-2">Se esta mensagem persistir, por favor, volte e tente novamente.</p>
        <button onClick={onRestart} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Voltar ao Início
        </button>
      </div>
    );
  }

  const { passenger, reservation, seats } = lastBookingDetails;

  const sendWhatsAppMessage = () => {
    const seatNumbers = seats.map(seat => seat.seat_number).join(', ');

    const message = `🎫 *COMPROVANTE DE RESERVA - COMADESMA 2026*

✅ *Reserva Confirmada!*

👤 *Passageiro:* ${passenger.name}
📧 *E-mail:* ${passenger.email}
📱 *Telefone:* ${passenger.phone}

🎟️ *Número da Reserva:* ${reservation.id.split('-')[0].toUpperCase()}
🪑 *Assentos:* ${seatNumbers}
💰 *Valor Pago:* R$ ${reservation.total_price.toFixed(2).replace('.',',')}

🚌 *DETALHES DA VIAGEM*
📍 *Origem:* Goiânia, GO
📍 *Destino:* Açailândia, MA
⏳ *Duração:* Aprox. 22 horas

*EMBARQUE (IDA): 06/01/2026*
- *21:00:* Setor Orlando de Moraes
- *22:00:* Jardim Novo Mundo

*RETORNO (VOLTA): 10/01/2026*
- *22:00:* Saída de Açailândia, MA

⚠️ *IMPORTANTE:*
• Apresentar-se 30 min antes do seu embarque
• Documento de identidade obrigatório
• Guarde este comprovante

🙏 Que Deus abençoe sua viagem!

*Excursão Comadesma 2026*`;

    const whatsappUrl = `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">Reserva Confirmada!</h2>
        <p className="text-gray-600">Sua vaga na Convenção Comadesma 2026 foi garantida com sucesso!</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-6">
        <div className="border-b border-blue-400 pb-4 mb-4">
          <h3 className="text-lg sm:text-xl font-bold">Convenção Comadesma 2026</h3>
          <p className="text-blue-200">Comprovante de Reserva</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-blue-200">Passageiro</p><p className="font-semibold">{passenger.name}</p></div>
          <div><p className="text-blue-200">Nº da Reserva</p><p className="font-semibold">{reservation.id.split('-')[0].toUpperCase()}</p></div>
          <div><p className="text-blue-200">Assentos</p><p className="font-semibold">{seats.map(s => s.seat_number).join(', ')}</p></div>
          <div className="col-span-2 pt-4 border-t border-blue-400">
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Total Pago</span>
              <span className="text-lg sm:text-xl font-bold">R$ {reservation.total_price.toFixed(2).replace('.',',')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={sendWhatsAppMessage} className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Enviar no WhatsApp
        </button>
        <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
          <Download className="w-5 h-5 mr-2" />
          Baixar Comprovante
        </button>
        <button onClick={onRestart} className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-medium flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Nova Reserva
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
