import React, { useState } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ExcursionDetails from './components/ExcursionDetails';
import SeatSelection from './components/SeatSelection';
import PassengerForm from './components/PassengerForm';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import AdminPanel from './components/AdminPanel';
import { Loader } from 'lucide-react';

type Step = 'welcome' | 'excursion' | 'seats' | 'passenger' | 'payment' | 'confirmation' | 'admin';

function AppContent() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const { loading: adminLoading } = useAdmin();
  const { loading: bookingLoading, clearSelection } = useBooking();

  if (adminLoading || bookingLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <Loader className="w-12 h-12 animate-spin text-comadesma-gold mb-4" />
        <p className="text-lg">Carregando sistema...</p>
      </div>
    );
  }

  const nextStep = () => {
    const steps: Step[] = ['welcome', 'excursion', 'seats', 'passenger', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const restart = () => {
    clearSelection();
    setCurrentStep('welcome');
  };

  const goToAdmin = () => {
    setCurrentStep('admin');
  };

  const backToApp = () => {
    setCurrentStep('welcome');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {currentStep !== 'welcome' && currentStep !== 'admin' && <Header onAdminClick={goToAdmin} />}
      
      <main className={`${currentStep === 'welcome' || currentStep === 'admin' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {currentStep === 'welcome' && <WelcomeScreen onComplete={nextStep} />}
        {currentStep === 'excursion' && <ExcursionDetails onComplete={nextStep} />}
        {currentStep === 'seats' && <SeatSelection onComplete={nextStep} />}
        {currentStep === 'passenger' && <PassengerForm onComplete={nextStep} />}
        {currentStep === 'payment' && <Payment onComplete={nextStep} />}
        {currentStep === 'confirmation' && <Confirmation onRestart={restart} />}
        {currentStep === 'admin' && <AdminPanel onBack={backToApp} />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </AdminProvider>
  );
}

export default App;
