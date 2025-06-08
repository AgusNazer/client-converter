'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPaymentPreference } from '../../../lib/api';
import { CreditCard, DollarSign, FileText, Loader2 } from 'lucide-react';

const paymentSchema = z.object({
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  description: z.string().min(1, 'La descripción es requerida'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function PaymentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = async (data: PaymentFormData) => {
    setIsLoading(true);
    setError(null);
    setPaymentUrl(null);

    try {
      console.log('Enviando datos:', data);
      const response = await createPaymentPreference(data);
      console.log('Respuesta:', response);
      
      setPaymentUrl(response.init_point);
    } catch (err: any) {
      console.error('Error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Error al crear la preferencia de pago'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPayment = () => {
    setPaymentUrl(null);
    setError(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            {/* <CreditCard className="w-8 h-8 text-white" /> */}
            <span className="w-8 h-8 text-white">💳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Crear Pago
          </h1>
          <p className="text-gray-600">
            Genera tu preferencia de MercadoPago
          </p>
        </div>

        {!paymentUrl ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Monto
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Campo Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Descripción
              </label>
              <textarea
                placeholder="Describe el producto o servicio..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Creando preferencia...
                </>
              ) : (
                'Crear Preferencia de Pago'
              )}
            </button>
          </form>
        ) : (
          /* Success State */
          <div className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ¡Preferencia creada exitosamente!
              </h3>
              <p className="text-green-700 text-sm mb-4">
                Tu enlace de pago está listo
              </p>
            </div>

            {/* Payment Button */}
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center"
            >
              🚀 Ir a MercadoPago para pagar
            </a>

            {/* New Payment Button */}
            <button
              onClick={handleNewPayment}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Crear nuevo pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}