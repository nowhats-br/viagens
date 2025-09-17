import React, { useState, ChangeEvent, useEffect } from 'react';
import { Save, Phone, Clock, Mail, MessageSquare, Image, Upload, Loader } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { AdminSettings as AdminSettingsType } from '../types';

const AdminSettings: React.FC = () => {
  const { settings, updateSettings, loading } = useAdmin();
  const [formData, setFormData] = useState<Partial<AdminSettingsType>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setPreviewUrl(settings.logo_url);
    }
  }, [settings]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData, logoFile);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error(error);
      alert(`Erro ao salvar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
      setLogoFile(null);
    }
  };

  const formatPhoneNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '+$1 ($2').replace(/(\d{2})(\d)/, '$1) $2').replace(/(\d{4})(\d)/, '$1-$2').replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3').replace(/(-\d{4})\d+?$/, '$1');
  };

  if (loading || !settings) {
    return <div className="flex justify-center p-8"><Loader className="animate-spin" /></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Configurações do Sistema</h3>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Image className="w-4 h-4 mr-2 text-purple-600" /> Logo da Excursão
          </label>
          <div className="flex items-center space-x-4">
            {previewUrl && <img src={previewUrl} alt="Preview" className="w-20 h-20 object-contain rounded-md bg-gray-100 p-1" />}
            <label htmlFor="logo-upload" className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
              <Upload className="w-4 h-4 mr-2" /> Fazer Upload
            </label>
            <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-green-600" /> Número do WhatsApp
          </label>
          <input type="text" value={formData.whatsapp_number || ''} onChange={(e) => setFormData({ ...formData, whatsapp_number: formatPhoneNumber(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="+55 (62) 99999-9999" maxLength={20} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-600" /> Tempo Limite para Pagamento (horas)
          </label>
          <select value={formData.reservation_timeout_hours || 24} onChange={(e) => setFormData({ ...formData, reservation_timeout_hours: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
            {[1, 2, 6, 12, 24, 48].map(h => <option key={h} value={h}>{h} hora{h > 1 ? 's' : ''}</option>)}
          </select>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Notificações</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" checked={formData.email_notifications || false} onChange={(e) => setFormData({ ...formData, email_notifications: e.target.checked })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <Mail className="w-4 h-4 ml-2 mr-2 text-gray-600" />
              <span className="text-sm text-gray-700">Notificações por E-mail</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={formData.sms_notifications || false} onChange={(e) => setFormData({ ...formData, sms_notifications: e.target.checked })} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <MessageSquare className="w-4 h-4 ml-2 mr-2 text-gray-600" />
              <span className="text-sm text-gray-700">Notificações por SMS</span>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium disabled:bg-gray-400 flex items-center">
            {isSaving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
