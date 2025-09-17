import React, { useState } from 'react';
import { ArrowLeft, Users, DollarSign, Clock, Settings, AlertTriangle, FileText, Loader } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import AdminSettings from './AdminSettings';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Reservation as ReservationType } from '../types';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reservations' | 'settings'>('dashboard');
  const { reservations, loading, getRevenue, refreshAdminData } = useAdmin();

  const generatePassengerListPDF = () => {
    const doc = new jsPDF();
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
    
    const tableColumn = ["Nome", "CPF", "Telefone", "Assento(s)"];
    const tableRows: any[] = [];

    confirmedReservations.forEach(res => {
      const passenger = res.passengers;
      if (passenger) {
        const seatNumbers = res.reservation_seats?.map(rs => rs.seats.seat_number).join(', ') || 'N/A';
        const passengerData = [
          passenger.name,
          passenger.cpf,
          passenger.phone,
          seatNumbers
        ];
        tableRows.push(passengerData);
      }
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      didDrawPage: (data: any) => {
        doc.text("Lista de Passageiros - Convenção Comadesma 2026", data.settings.margin.left, 15);
      }
    });
    
    doc.save("lista_passageiros_comadesma_2026.pdf");
  };

  const pendingPayments = reservations.filter(r => r.status === 'reserved');
  const expiredReservations = reservations.filter(r => r.status === 'expired');
  const revenue = getRevenue();
  const totalReservations = reservations.length;
  const occupiedSeats = reservations.filter(r => r.status === 'confirmed').reduce((acc, r) => acc + (r.reservation_seats?.length || 0), 0);
  const totalSeats = 56;
  const availableSeats = totalSeats - occupiedSeats;

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const TabButton: React.FC<{ id: string; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center space-x-2 px-3 py-2 text-sm sm:px-4 rounded-lg transition-colors ${activeTab === id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Painel Administrativo</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refreshAdminData} className="p-2 hover:bg-gray-100 rounded-lg" title="Atualizar dados">
                <Loader className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={generatePassengerListPDF} className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg bg-comadesma-gold text-white hover:bg-yellow-600">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Gerar PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton id="dashboard" label="Dashboard" icon={<Users className="w-4 h-4" />} />
          <TabButton id="reservations" label="Reservas" icon={<Clock className="w-4 h-4" />} />
          <TabButton id="settings" label="Configurações" icon={<Settings className="w-4 h-4" />} />
        </div>

        {loading ? <div className="flex justify-center items-center p-10"><Loader className="w-8 h-8 animate-spin" /></div> : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg shadow p-4"><div className="flex items-center"><div className="p-2 bg-blue-100 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div><div className="ml-3"><p className="text-xs font-medium text-gray-600">Total Reservas</p><p className="text-lg sm:text-xl font-bold">{totalReservations}</p></div></div></div>
                  <div className="bg-white rounded-lg shadow p-4"><div className="flex items-center"><div className="p-2 bg-green-100 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div><div className="ml-3"><p className="text-xs font-medium text-gray-600">Receita</p><p className="text-lg sm:text-xl font-bold">{formatCurrency(revenue)}</p></div></div></div>
                  <div className="bg-white rounded-lg shadow p-4"><div className="flex items-center"><div className="p-2 bg-yellow-100 rounded-lg"><Clock className="w-5 h-5 text-yellow-600" /></div><div className="ml-3"><p className="text-xs font-medium text-gray-600">Pendentes</p><p className="text-lg sm:text-xl font-bold">{pendingPayments.length}</p></div></div></div>
                  <div className="bg-white rounded-lg shadow p-4"><div className="flex items-center"><div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div><div className="ml-3"><p className="text-xs font-medium text-gray-600">Expiradas</p><p className="text-lg sm:text-xl font-bold">{expiredReservations.length}</p></div></div></div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">Ocupação dos Assentos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center"><div className="text-xl sm:text-3xl font-bold text-green-600">{occupiedSeats}</div><div className="text-xs sm:text-sm text-gray-600">Assentos Vendidos</div></div>
                    <div className="text-center"><div className="text-xl sm:text-3xl font-bold text-blue-600">{availableSeats}</div><div className="text-xs sm:text-sm text-gray-600">Disponíveis</div></div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${(occupiedSeats / totalSeats) * 100}%` }}></div></div>
                    <div className="text-center text-sm text-gray-600 mt-2">{((occupiedSeats / totalSeats) * 100).toFixed(1)}% ocupado</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reservations' && (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passageiro</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assentos</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservations.map((reservation: ReservationType) => (
                      <tr key={reservation.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{reservation.passengers?.name || 'N/A'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">{reservation.reservation_seats?.map(rs => rs.seats.seat_number).join(', ') || 'N/A'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">{formatCurrency(reservation.total_price)}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : reservation.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {reservation.status === 'confirmed' ? 'Confirmada' : reservation.status === 'reserved' ? 'Pendente' : 'Expirada'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'settings' && <AdminSettings />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
