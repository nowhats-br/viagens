import React, { useState } from 'react';
import { CreditCard, Clock, QrCode, Copy, BarChart3, Loader } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

interface PaymentProps {
  onComplete: () => void;
}

const Payment: React.FC<PaymentProps> = ({ onComplete }) => {
  const { passenger, selectedSeats, seats, createBooking } = useBooking();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [pixType, setPixType] = useState<'single' | 'installments'>('single');
  const [installments, setInstallments] = useState(1);
  
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
  });

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const calculateInstallmentPrice = (total: number, numInstallments: number) => {
    if (numInstallments === 1) return total;
    const interestRate = 0.0199;
    const totalWithInterest = total * Math.pow(1 + interestRate, numInstallments);
    return totalWithInterest / numInstallments;
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
  };

  const generatePixCode = () => `00020126580014BR.GOV.BCB.PIX...`;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const finalPaymentMethod = paymentMethod === 'pix' ? `pix_${pixType}` : 'card';
      const finalInstallments = paymentMethod === 'card' ? installments : (pixType === 'installments' ? 3 : 1);
      
      await createBooking(finalPaymentMethod, finalInstallments);
      onComplete();
    } catch (error) {
      console.error(error);
      alert(`Ocorreu um erro ao processar sua reserva: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(generatePixCode());
    alert('Código PIX copiado para a área de transferência!');
  };

  const totalPrice = getTotalPrice();
  const installmentPrice = calculateInstallmentPrice(totalPrice, installments);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Finalizar Pagamento</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Forma de Pagamento</h3>
          
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 p-4 border rounded-lg transition-colors ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-gray-400'}`}
            >
              <CreditCard className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Cartão de Crédito</div>
            </button>
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`flex-1 p-4 border rounded-lg transition-colors ${paymentMethod === 'pix' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-300 hover:border-gray-400'}`}
            >
              <QrCode className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-medium">PIX</div>
            </button>
          </div>

          {paymentMethod === 'card' && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número do Cartão</label>
                <input type="text" required value={cardForm.cardNumber} onChange={(e) => setCardForm({ ...cardForm, cardNumber: formatCardNumber(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0000 0000 0000 0000" maxLength={19}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Validade</label>
                  <input type="text" required value={cardForm.expiryDate} onChange={(e) => setCardForm({ ...cardForm, expiryDate: formatExpiryDate(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="MM/AA" maxLength={5}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input type="text" required value={cardForm.cvv} onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="000" maxLength={4}/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Portador</label>
                <input type="text" required value={cardForm.holderName} onChange={(e) => setCardForm({ ...cardForm, holderName: e.target.value.toUpperCase() })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="NOME CONFORME CARTÃO"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parcelamento</label>
                <select value={installments} onChange={(e) => setInstallments(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num}x de R$ {calculateInstallmentPrice(totalPrice, num).toFixed(2).replace('.',',')} {num > 1 ? `(Total: R$ ${(calculateInstallmentPrice(totalPrice, num) * num).toFixed(2).replace('.',',')})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                {isProcessing && <Loader className="w-5 h-5 mr-2 animate-spin" />}
                {isProcessing ? 'Processando...' : `Pagar ${installments}x de R$ ${installmentPrice.toFixed(2).replace('.',',')}`}
              </button>
            </form>
          )}

          {paymentMethod === 'pix' && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="flex space-x-2 rounded-lg bg-gray-100 p-1">
                <button type="button" onClick={() => setPixType('single')} className={`w-full rounded-md py-2 text-sm font-medium ${pixType === 'single' ? 'bg-white shadow text-green-700' : 'text-gray-600'}`}>PIX à Vista</button>
                <button type="button" onClick={() => setPixType('installments')} className={`w-full rounded-md py-2 text-sm font-medium ${pixType === 'installments' ? 'bg-white shadow text-green-700' : 'text-gray-600'}`}>PIX Parcelado 3x</button>
              </div>
              
              {pixType === 'single' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Pagamento via PIX à Vista</h4>
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-green-300 text-center mb-4"><QrCode className="w-32 h-32 mx-auto text-green-600" /></div>
                  <div className="bg-white rounded border p-3"><div className="flex items-center justify-between"><span className="text-xs text-gray-600 break-all">{generatePixCode().substring(0, 50)}...</span><button type="button" onClick={copyPixCode} className="ml-2 bg-green-600 text-white p-2 rounded hover:bg-green-700"><Copy className="w-4 h-4" /></button></div></div>
                </div>
              )}

              {pixType === 'installments' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Pagamento via PIX Parcelado</h4>
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-green-300 text-center mb-4">
                    <BarChart3 className="w-16 h-16 mx-auto text-green-600 mb-2" />
                    <p className="font-bold text-lg">1ª Parcela de 3</p>
                    <p className="text-2xl font-bold text-green-700">R$ {(totalPrice / 3).toFixed(2).replace('.',',')}</p>
                  </div>
                  <div className="bg-white rounded border p-3"><div className="flex items-center justify-between"><span className="text-xs text-gray-600 break-all">{generatePixCode().substring(0, 50)}...</span><button type="button" onClick={copyPixCode} className="ml-2 bg-green-600 text-white p-2 rounded hover:bg-green-700"><Copy className="w-4 h-4" /></button></div></div>
                </div>
              )}

              <button type="submit" disabled={isProcessing} className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                {isProcessing && <Loader className="w-5 h-5 mr-2 animate-spin" />}
                {isProcessing ? 'Verificando...' : pixType === 'single' ? 'Confirmar Pagamento PIX' : 'Pagar 1ª Parcela'}
              </button>
            </form>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Resumo da Reserva</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Passageiro:</span><span className="font-medium">{passenger?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Assentos:</span><span className="font-medium">{selectedSeats.map(seatId => seats.find(s => s.id === seatId)?.seat_number).join(', ')}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Quantidade:</span><span className="font-medium">{selectedSeats.length} passageiro(s)</span></div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-bold text-blue-600"><span>Total:</span><span>R$ {totalPrice.toFixed(2).replace('.',',')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
