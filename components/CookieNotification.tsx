"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  FileText,
  MessagesSquare,
  X,
} from "lucide-react";

const menuItems = [
  {
    href: "viber://chat?number=YOUR_NUMBER",
    label: "Viber",
    icon: Phone,
    className: "bg-[#7360F2] hover:bg-[#5F4DDB]",
  },
  {
    href: "https://wa.me/YOUR_NUMBER",
    label: "WhatsApp",
    icon: Phone,
    className: "bg-[#25D366] hover:bg-[#1FB855]",
  },
  {
    href: "#form",
    label: "Forma to'ldirish",
    icon: FileText,
    className: "bg-[#2563EB] hover:bg-[#1D4ED8]",
  },
  {
    href: "#chat",
    label: "Chat",
    icon: MessagesSquare,
    className: "bg-[#0EA5E9] hover:bg-[#0284C7]",
  },
];

export const CookieNotification: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const handleAccept = () => setIsAccepted(true);

  return (
    <>
      {/* Suzuvchi menyu */}
      <div className="fixed bottom-24 left-6 sm:left-10 z-50 flex flex-col-reverse gap-3">
        {menuItems.map(({ href, label, icon: Icon, className }, i) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            style={{ transitionDelay: isOpen ? `${i * 40}ms` : "0ms" }}
            className={`group relative w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg shadow-black/20 ring-1 ring-white/20 transition-all duration-300 ease-out ${className} ${
              isOpen
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 translate-y-3 scale-75 pointer-events-none"
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={2.25} />
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
              {label}
            </span>
          </a>
        ))}
      </div>

      {/* Asosiy tugma */}
      <div className="fixed bottom-6 left-6 sm:left-10 z-50">
        <button
          onClick={toggleMenu}
          aria-label={isOpen ? "Menyuni yopish" : "Menyuni ochish"}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-white transition-all duration-300 focus:outline-none focus-visible:ring-blue-300 ${
            isOpen
              ? "bg-gray-700 rotate-90"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
          }`}
        >
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-40" />
          )}
          {isOpen ? (
            <X className="w-6 h-6" strokeWidth={2.5} />
          ) : (
            <MessageCircle
              className="w-6 h-6"
              strokeWidth={2.25}
              fill="currentColor"
            />
          )}
        </button>
      </div>

      {/* Cookie banner */}
      {!isAccepted && (
        <div className="fixed bottom-0 left-0 right-0 z-40 w-full border-t border-gray-200/80 bg-white/95 backdrop-blur-sm py-4 px-4 sm:px-6 shadow-[0_-8px_24px_-4px_rgba(0,0,0,0.08)] animate-[slideUp_0.4s_ease-out]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pl-0 sm:pl-28">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Сайт использует Cookie
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Используя данный сайт, вы даёте согласие на использование файлов
                cookie, данных об IP-адресе и местоположении, помогающих нам
                сделать его удобнее для вас.{" "}
                <Link
                  href="/privecyPolicyPage"
                  className="text-[#0066cc] font-medium underline underline-offset-2 hover:text-blue-800 transition-colors"
                >
                  Подробнее
                </Link>
              </p>
            </div>

            <button
              onClick={handleAccept}
              className="w-full sm:w-auto flex-shrink-0 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-xl text-sm shadow-sm transition-all"
            >
              Принять
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default CookieNotification;
