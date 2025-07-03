# Glass Design System - Complete Extraction

This document contains the comprehensive glassmorphism design system extracted from your RAG visualization project. The design features sophisticated layered glass effects with backdrop blur, transparency, shadows, and gradient overlays.

## Core Glass Design Principles

Your glass design system is built on these key characteristics:

1. **Backdrop Blur + Saturation**: `backdrop-filter: blur(16px-24px) saturate(150%-180%)`
2. **Semi-transparent Backgrounds**: `rgba(255, 255, 255, 0.05-0.12)`
3. **Layered Shadows**: Outer shadows + inset highlights for depth
4. **Gradient Overlays**: `::before` pseudo-elements with gradients
5. **Smooth Interactions**: Enhanced blur and lighting on hover
6. **Mobile Optimization**: Stronger effects for better visibility

## 1. Core Glass Node Design

### Primary Glass Container
```css
.glass-node {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  padding: 1.5rem;
  border-radius: 16px;
  backdrop-filter: blur(20px) saturate(150%);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3), 
    0 8px 24px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.glass-node::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: inherit;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.glass-node:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-3px) scale(1.01);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4), 
    0 12px 30px rgba(0, 0, 0, 0.3),
    0 4px 12px rgba(255, 255, 255, 0.15) inset,
    0 0 30px rgba(255, 255, 255, 0.1);
}

.glass-node:hover::before {
  opacity: 1;
}
```

## 2. Glass Button System

### Base Glass Button
```css
.glass-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-family: var(--font-inter), sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(16px) saturate(150%);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15), 
    0 2px 6px rgba(255, 255, 255, 0.1) inset;
  overflow: hidden;
  cursor: pointer;
}

.glass-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: inherit;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.2), 
    0 4px 12px rgba(255, 255, 255, 0.15) inset,
    0 0 20px rgba(255, 255, 255, 0.1);
}

.glass-button:hover::before {
  opacity: 0.8;
}

.glass-button:active {
  transform: translateY(-1px) scale(0.98);
}
```

### Color Variants
```css
/* Success State (Green Accent) */
.glass-button--success {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.4);
  box-shadow: 
    0 4px 12px rgba(34, 197, 94, 0.2), 
    0 2px 6px rgba(255, 255, 255, 0.1) inset,
    0 0 20px rgba(34, 197, 94, 0.1);
}

.glass-button--success::before {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, transparent 50%, rgba(34, 197, 94, 0.1) 100%);
}

/* Danger State (Red Accent) */
.glass-button--danger {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  box-shadow: 
    0 4px 12px rgba(239, 68, 68, 0.2), 
    0 2px 6px rgba(255, 255, 255, 0.1) inset,
    0 0 20px rgba(239, 68, 68, 0.1);
}

.glass-button--danger::before {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, transparent 50%, rgba(239, 68, 68, 0.1) 100%);
}

/* Primary State (Blue Accent) */
.glass-button--primary {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 
    0 4px 12px rgba(59, 130, 246, 0.2), 
    0 2px 6px rgba(255, 255, 255, 0.1) inset,
    0 0 20px rgba(59, 130, 246, 0.1);
}

.glass-button--primary::before {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, transparent 50%, rgba(59, 130, 246, 0.1) 100%);
}
```

## 3. Glass Modal System

### Modal Backdrop
```css
.glass-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px) saturate(150%);
}
```

### Main Modal Container
```css
.glass-modal {
  position: relative;
  width: 100%;
  max-width: 2xl; /* 672px */
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(32px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.5),
    0 16px 32px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(255, 255, 255, 0.1) inset;
  overflow: hidden;
}

.glass-modal::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 70%, rgba(255, 255, 255, 0.05) 100%);
  opacity: 0.5;
  pointer-events: none;
}
```

### Modal Content Cards
```css
.glass-modal-card {
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.glass-modal-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.02);
}
```

## 4. Glass Dropdown System

### Dropdown Container
```css
.glass-dropdown {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  backdrop-filter: blur(20px) saturate(150%);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3), 
    0 8px 24px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(255, 255, 255, 0.1) inset;
  z-index: 1001;
  overflow: hidden;
  animation: glassDropdownSlideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes glassDropdownSlideDown {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### Dropdown Items
```css
.glass-dropdown-item {
  position: relative;
  display: block;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.glass-dropdown-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.glass-dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(2px);
}

.glass-dropdown-item:hover::before {
  opacity: 1;
}

.glass-dropdown-item:first-child {
  border-radius: 16px 16px 0 0;
}

.glass-dropdown-item:last-child {
  border-radius: 0 0 16px 16px;
}

.glass-dropdown-item:only-child {
  border-radius: 16px;
}

/* Active State */
.glass-dropdown-item--active {
  background: rgba(59, 130, 246, 0.4);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2) inset;
}

.glass-dropdown-item--active::before {
  background: rgba(59, 130, 246, 0.2);
  opacity: 1;
}
```

## 5. Glass Homepage Buttons (Tailwind Classes)

```html
<!-- Try Demo Button -->
<button class="group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-green-400/30 text-white/90 font-medium text-sm tracking-tight transition-all duration-200 ease-out hover:bg-white/10 hover:border-green-400/50 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400/50 active:scale-95 backdrop-blur-xl backdrop-saturate-150 pointer-events-auto shadow-lg shadow-green-400/20 hover:shadow-green-400/40 hover:shadow-xl before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-50">
  <span>Try Demo</span>
  <div class="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center transition-all duration-200 group-hover:bg-white/30 group-hover:translate-x-0.5">
    <!-- Icon -->
  </div>
</button>

<!-- Info Button -->
<button class="group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/20 text-white/90 font-medium text-sm tracking-tight transition-all duration-200 ease-out hover:bg-white/10 hover:border-white/30 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 backdrop-blur-xl backdrop-saturate-150 pointer-events-auto shadow-lg shadow-black/20 hover:shadow-black/40 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-50">
  <span>What can I do?</span>
</button>
```

## 6. React Component Examples

### Glass Button Component
```jsx
import React from 'react';

interface GlassButtonProps {
  variant?: 'default' | 'success' | 'danger' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'default',
  size = 'md',
  children,
  onClick,
  className = ''
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2
    border font-medium transition-all duration-300 
    backdrop-blur-xl backdrop-saturate-150 cursor-pointer
    overflow-hidden
    before:absolute before:inset-0 before:border-radius-inherit
    before:bg-gradient-to-br before:from-white/10 before:via-transparent 
    before:to-white/5 before:opacity-80 before:transition-opacity
    hover:before:opacity-100
  `;
  
  const variants = {
    default: 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30',
    success: 'bg-green-500/15 border-green-400/40 text-white hover:bg-green-500/25 hover:border-green-400/60',
    danger: 'bg-red-500/15 border-red-400/40 text-white hover:bg-red-500/25 hover:border-red-400/60',
    primary: 'bg-blue-500/15 border-blue-400/40 text-white hover:bg-blue-500/25 hover:border-blue-400/60'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-2xl'
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
```

### Glass Modal Component
```jsx
import React from 'react';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  children,
  title
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md backdrop-saturate-150"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white/5 backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-3xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:opacity-50">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/20 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all duration-200 z-50 backdrop-blur-xl"
        >
          ×
        </button>

        {/* Content */}
        <div className="overflow-y-auto p-8 relative z-10">
          {title && (
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent mb-6">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
```

## 7. Mobile Responsive Optimizations

```css
/* Enhanced mobile visibility */
@media (max-width: 768px) {
  .glass-node {
    border-radius: 14px;
    backdrop-filter: blur(24px) saturate(180%);
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.4), 
      0 12px 30px rgba(0, 0, 0, 0.3),
      0 4px 12px rgba(255, 255, 255, 0.15) inset;
  }
  
  .glass-button {
    backdrop-filter: blur(18px) saturate(160%);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.25);
    /* Enhanced touch targets */
    min-height: 44px;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  
  .glass-dropdown {
    backdrop-filter: blur(24px) saturate(180%);
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
}
```

## 8. CSS Custom Properties Setup

```css
:root {
  /* Glass design system */
  --glass-bg-primary: rgba(255, 255, 255, 0.08);
  --glass-bg-secondary: rgba(255, 255, 255, 0.05);
  --glass-bg-tertiary: rgba(255, 255, 255, 0.03);
  
  --glass-border-primary: rgba(255, 255, 255, 0.25);
  --glass-border-secondary: rgba(255, 255, 255, 0.2);
  --glass-border-tertiary: rgba(255, 255, 255, 0.15);
  
  --glass-blur-light: blur(16px) saturate(150%);
  --glass-blur-medium: blur(20px) saturate(150%);
  --glass-blur-heavy: blur(24px) saturate(180%);
  
  /* Shadows */
  --glass-shadow-light: 
    0 4px 12px rgba(0, 0, 0, 0.15), 
    0 2px 6px rgba(255, 255, 255, 0.1) inset;
    
  --glass-shadow-medium: 
    0 20px 40px rgba(0, 0, 0, 0.3), 
    0 8px 24px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(255, 255, 255, 0.1) inset;
    
  --glass-shadow-heavy: 
    0 25px 50px rgba(0, 0, 0, 0.4), 
    0 12px 30px rgba(0, 0, 0, 0.3),
    0 4px 12px rgba(255, 255, 255, 0.15) inset;
}
```

## 9. Utility Classes (Tailwind-style)

```css
/* Background utilities */
.glass-bg-1 { background: var(--glass-bg-primary); }
.glass-bg-2 { background: var(--glass-bg-secondary); }
.glass-bg-3 { background: var(--glass-bg-tertiary); }

/* Border utilities */
.glass-border-1 { border: 1px solid var(--glass-border-primary); }
.glass-border-2 { border: 1px solid var(--glass-border-secondary); }
.glass-border-3 { border: 1px solid var(--glass-border-tertiary); }

/* Backdrop utilities */
.glass-blur-light { backdrop-filter: var(--glass-blur-light); }
.glass-blur-medium { backdrop-filter: var(--glass-blur-medium); }
.glass-blur-heavy { backdrop-filter: var(--glass-blur-heavy); }

/* Shadow utilities */
.glass-shadow-1 { box-shadow: var(--glass-shadow-light); }
.glass-shadow-2 { box-shadow: var(--glass-shadow-medium); }
.glass-shadow-3 { box-shadow: var(--glass-shadow-heavy); }

/* Combined glass utilities */
.glass-light {
  background: var(--glass-bg-secondary);
  border: 1px solid var(--glass-border-secondary);
  backdrop-filter: var(--glass-blur-light);
  box-shadow: var(--glass-shadow-light);
}

.glass-medium {
  background: var(--glass-bg-primary);
  border: 1px solid var(--glass-border-primary);
  backdrop-filter: var(--glass-blur-medium);
  box-shadow: var(--glass-shadow-medium);
}

.glass-heavy {
  background: var(--glass-bg-primary);
  border: 1px solid var(--glass-border-primary);
  backdrop-filter: var(--glass-blur-heavy);
  box-shadow: var(--glass-shadow-heavy);
}
```

## Summary

This glass design system provides:

- **Sophisticated layered effects** with backdrop blur and saturation
- **Comprehensive component library** (buttons, modals, dropdowns, containers)
- **Color-coded variants** for different states and purposes
- **Mobile-optimized versions** with enhanced visibility
- **Smooth animations** and hover interactions
- **Reusable CSS patterns** and utility classes
- **React component examples** for easy integration

The design creates a premium, modern feel with excellent depth perception while maintaining excellent usability across all device types.