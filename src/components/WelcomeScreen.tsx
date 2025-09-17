import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { settings } = useAdmin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 flex items-center justify-center">
            {settings?.logo_url && <img src={settings.logo_url} alt="Logo Comadesma" className="w-full h-full object-contain" />}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-comadesma-gold to-yellow-400 bg-clip-text text-transparent">
            COMADESMA
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
            Convenção 2026
          </h2>
          <p className="text-base sm:text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            A área 62 Goiás unidos em ação
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            <MapPin className="w-8 h-8 text-comadesma-gold mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Trajeto</h3>
            <p className="text-sm sm:text-base text-blue-200">Goiânia → Açailândia MA</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            <Calendar className="w-8 h-8 text-comadesma-gold mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Datas</h3>
            <p className="text-sm sm:text-base text-blue-200">06/01 a 10/01/2026</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            <Users className="w-8 h-8 text-comadesma-gold mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Vagas</h3>
            <p className="text-sm sm:text-base text-blue-200">56 assentos disponíveis</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
            onClick={onComplete}
            className="bg-gradient-to-r from-yellow-500 via-comadesma-gold to-orange-500 text-white text-lg sm:text-xl font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-2xl flex items-center mx-auto"
          >
            Reservar Minha Vaga
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-3" />
          </button>
          
          <p className="mt-4 text-blue-200 text-xs sm:text-sm">
            Vagas limitadas • Reserve agora e garante sua participação
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
