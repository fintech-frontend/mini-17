'use client';

import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { useCreateLeadMutation } from '@/lib/api/contentApi';

interface OneClickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productId?: number;
}

export default function OneClickOrderModal({
  isOpen,
  onClose,
  productTitle,
  productId,
}: OneClickOrderModalProps) {
  const [createLead, { isLoading }] = useCreateLeadMutation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Modal ochiq bo'lganda sahifa skrollini bloklash
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Telefon raqamini +7 (___) ___-__-__ formatida yozish
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, '');

    if (digits.startsWith('7')) digits = digits.slice(1);
    if (digits.startsWith('8')) digits = digits.slice(1);
    digits = digits.slice(0, 10);

    let formatted = '+7';
    if (digits.length > 0) formatted += ` (${digits.slice(0, 3)}`;
    if (digits.length >= 3) formatted += `) `;
    if (digits.length > 3) formatted += digits.slice(3, 6);
    if (digits.length > 6) formatted += `-${digits.slice(6, 8)}`;
    if (digits.length > 8) formatted += `-${digits.slice(8, 10)}`;

    setPhone(formatted);
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setAgreed(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || phone.replace(/\D/g, '').length < 11) {
      toast.error('Пожалуйста, заполните все поля корректно');
      return;
    }
    if (!agreed) {
      toast.error('Подтвердите согласие с обработкой персональных данных');
      return;
    }

    try {
      // POST /leads/
      await createLead({
        type: 'one_click',
        name: name.trim(),
        phone,
        product: productId ?? null,
        consent: agreed,
      }).unwrap();
    } catch {
      toast.error('Не удалось отправить заявку. Попробуйте ещё раз.');
      return;
    }

    toast.success('Ваш заказ принят! Мы скоро свяжемся с вами.', {
      style: {
        background: '#10B981',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '12px',
        fontWeight: '500',
      },
    });

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[430px] bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-[fadeIn_0.15s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Yopish tugmasi */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Закрыть"
          className="absolute -top-12 right-0 sm:top-0 sm:-right-12 w-10 h-10 flex items-center justify-center rounded-full bg-white sm:bg-transparent text-gray-700 hover:text-gray-900 transition-colors shadow-sm sm:shadow-none"
        >
          <IoClose size={26} />
        </button>

        {/* Sarlavha */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
          Заказать в 1 клик
        </h2>
        <p className="text-sm sm:text-base text-gray-700 text-center mb-6 leading-snug">
          {productTitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-800 mb-1.5">
              Ваше имя <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться?"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-800 mb-1.5">
              Номер телефона <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+7 (   )    -    -"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
              required
            />
          </div>

          <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
            />
            <span className="text-xs text-gray-500 leading-snug">
              Согласен с обработкой персональных данных в соответствии с политикой
              конфиденциальности
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm text-sm tracking-wide mt-2"
          >
            {isLoading ? 'ОТПРАВКА...' : 'КУПИТЬ'}
          </button>
        </form>
      </div>
    </div>
  );
}