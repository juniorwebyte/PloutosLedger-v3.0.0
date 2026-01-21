/**
 * PloutosLedger Design System v3.0
 * Centralização de tokens visuais para garantir consistência startup-grade.
 */

export const theme = {
  colors: {
    primary: {
      light: '#34d399', // emerald-400
      main: '#10b981',  // emerald-500
      dark: '#059669',  // emerald-600
    },
    secondary: {
      light: '#60a5fa', // blue-400
      main: '#3b82f6',  // blue-500
      dark: '#2563eb',  // blue-600
    },
    danger: {
      light: '#f87171', // red-400
      main: '#ef4444',  // red-500
      dark: '#dc2626',  // red-600
    },
    warning: {
      light: '#fbbf24', // amber-400
      main: '#f59e0b',  // amber-500
      dark: '#d97706',  // amber-600
    },
    background: {
      default: '#f9fafb', // gray-50
      paper: '#ffffff',
      dark: '#111827',    // gray-900
    },
    text: {
      primary: '#111827',   // gray-900
      secondary: '#4b5563', // gray-600
      disabled: '#9ca3af',  // gray-400
      contrast: '#ffffff',
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  }
};

export const commonStyles = {
  card: `bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden`,
  button: {
    base: `px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`,
    primary: `bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500`,
    secondary: `bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500`,
    outline: `border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500`,
    danger: `bg-red-500 text-white hover:bg-red-600 focus:ring-red-500`,
  },
  input: `w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all`,
  heading: {
    h1: `text-3xl font-bold text-gray-900`,
    h2: `text-2xl font-semibold text-gray-800`,
    h3: `text-xl font-medium text-gray-700`,
  }
};
