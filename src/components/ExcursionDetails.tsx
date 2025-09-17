import React from 'react';
import { Calendar, Clock, MapPin, Users, Info, ArrowRight, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExcursionDetailsProps {
  onComplete: () => void;
}

const ExcursionDetails: React.FC<ExcursionDetailsProps> = ({ onComplete }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 md:p-8 mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Convenção Comadesma 2026
        </h1>
        <p className="text-base sm:text-lg text-blue-100 mb-6">
          Junte-se a nós nesta jornada especial de fé e comunhão
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-blue-200" />
            <div>
              <p className="text-blue-200 text-xs">Origem</p>
              <p className="font-semibold">Goiânia, GO</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <ArrowRight className="w-5 h-5 text-blue-200" />
            <div>
              <p className="text-blue-200 text-xs">Destino</p>
              <p className="font-semibold">Açailândia, MA</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-blue-200" />
            <div>
              <p className="text-blue-200 text-xs">Período</p>
              <p className="font-semibold">06 a 10/01/2026</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detalhes da Viagem */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Detalhes da Excursão</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-4 text-sm">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Embarques (06/01)</p>
                <p className="text-gray-600">Setor Orlando de Moraes: 21:00</p>
                <p className="text-gray-600">Jardim Novo Mundo: 22:00</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Duração da Viagem</p>
                <p className="text-gray-600">Aproximadamente 22 horas</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Navigation className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Distância</p>
                <p className="text-gray-600">Aproximadamente 1.470 km</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Capacidade</p>
                <p className="text-gray-600">56 passageiros</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3">Incluso na Excursão:</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Transporte ida e volta</li>
              <li>Ônibus com ar condicionado</li>
              <li>Poltronas reclináveis</li>
              <li>Wi-Fi a bordo</li>
              <li>Água mineral</li>
              <li>Seguro viagem</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Preços */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Valores</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Andar Inferior - Leito</h3>
            <p className="text-gray-600 text-sm mb-3">Poltronas totalmente reclináveis</p>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">R$ 950,00</div>
            <p className="text-xs text-gray-500 mt-1">12 assentos disponíveis</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Andar Superior - Semi-Leito</h3>
            <p className="text-gray-600 text-sm mb-3">Poltronas confortáveis</p>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">R$ 800,00</div>
            <p className="text-xs text-gray-500 mt-1">44 assentos disponíveis</p>
          </div>
        </div>
      </motion.div>

      {/* Informações Importantes */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8"
      >
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Informações Importantes</h3>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>Embarques: Setor Orlando de Moraes (21h) e Jardim Novo Mundo (22h).</li>
              <li>Apresente-se no local de embarque 30 minutos antes.</li>
              <li>Documento de identidade com foto é obrigatório.</li>
              <li>Reserva válida por 24 horas para pagamento.</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Botão de Continuar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <button
          onClick={onComplete}
          className="bg-gradient-to-r from-yellow-500 via-comadesma-gold to-orange-500 text-white px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
        >
          Escolher Assentos
        </button>
      </motion.div>
    </div>
  );
};

export default ExcursionDetails;
