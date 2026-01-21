import React from 'react';
import { Lock, Crown } from 'lucide-react';

interface SidebarProps {
  menuItems: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarVisible: boolean;
  accessControl: any;
  handlePremiumFeatureClick: (feature: string) => void;
  getColorClasses: (color: string) => string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  activeTab,
  setActiveTab,
  sidebarVisible,
  accessControl,
  handlePremiumFeatureClick,
  getColorClasses
}) => {
  return (
    <aside className={`${sidebarVisible ? 'hidden lg:block' : 'hidden'} w-64 bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-100 min-h-screen sticky top-0`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const requiresAccess = item.requiresAccess;
            const hasAccess = !requiresAccess || accessControl.canAccessFeature(requiresAccess);
            const isLocked = requiresAccess && !hasAccess;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (isLocked) {
                      handlePremiumFeatureClick(item.requiresAccess);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${getColorClasses(item.color)} text-white shadow-lg transform scale-105`
                      : isLocked 
                        ? 'text-amber-500 hover:bg-amber-50 border border-amber-200 relative' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : isLocked ? 'text-amber-500' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                  {isLocked && <Lock className="w-3 h-3 ml-auto text-amber-400" />}
                  {item.premium && !isLocked && <Crown className="w-3 h-3 ml-auto text-amber-500" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
