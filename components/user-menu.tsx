'use client';

import { useAuth } from 'components/auth/auth-context';
import LinkWithTransition from 'components/link-with-transition';
import { useLanguage } from 'components/providers/language-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiLogOut, FiPackage, FiUser } from 'react-icons/fi';

interface UserMenuProps {
  iconColor?: string;
}

export default function UserMenu({ iconColor = 'white' }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { customer, logout, isLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  if (isLoading) {
    return (
      <div className="p-2 rounded-full transition-all duration-200 opacity-50">
        <FiUser className="h-5 w-5" style={{ color: iconColor }} />
      </div>
    );
  }


  if (!customer) {
    return (
      <LinkWithTransition
        href="/login"
        className="p-2 rounded-full transition-all duration-200 hover:opacity-70"
      >
        <FiUser className="h-5 w-5" style={{ color: iconColor }} />
      </LinkWithTransition>
    );
  }


  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full transition-all duration-200 hover:opacity-70 relative"
        aria-label="User menu"
      >
        <FiUser className="h-5 w-5" style={{ color: iconColor }} />

        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      </button>


      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">

          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {customer.displayName || `${customer.firstName} ${customer.lastName}`}
            </p>
            <p className="text-xs text-gray-500 truncate">{customer.email}</p>
          </div>


          <div className="py-1">
            <LinkWithTransition
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            >
              <FiPackage className="h-4 w-4 mr-3 text-gray-400" />
              {t('userMenu.myOrders')}
            </LinkWithTransition>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            >
              <FiLogOut className="h-4 w-4 mr-3 text-gray-400" />
              {t('userMenu.logout')}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}
