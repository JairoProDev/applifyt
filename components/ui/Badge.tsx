import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'primary' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Badge({ 
  variant = 'gray', 
  size = 'md',
  className, 
  children,
  ...props 
}: BadgeProps) {
  const baseClasses = 'badge'
  
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    primary: 'badge-primary',
    gray: 'badge-gray',
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

interface StatusBadgeProps extends BadgeProps {
  status: 'active' | 'completed' | 'paused' | 'cancelled' | 'pending'
}

export function StatusBadge({ status, children, ...props }: StatusBadgeProps) {
  const statusVariants = {
    active: 'success',
    completed: 'primary',
    paused: 'warning',
    cancelled: 'danger',
    pending: 'gray',
  } as const

  return (
    <Badge variant={statusVariants[status]} {...props}>
      {children || status}
    </Badge>
  )
}
