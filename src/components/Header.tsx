import React from 'react';
import { Bus, MapPin, Settings } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Bus className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Excursão Comadesma</h1>
              <p className="text-blue-200 text-sm">Goiânia → Açailândia MA</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-blue-200">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Convenção 2026</span>
            </div>
            
            <button
              onClick={onAdminClick}
              className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              title="Painel Administrativo"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
