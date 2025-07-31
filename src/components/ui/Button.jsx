import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import Icon from '../AppIcon';

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/25 hover:scale-105 active:scale-95",
                outline: "border border-input hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:scale-105 active:scale-95",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 active:scale-95",
                ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95",
                link: "text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95",
                success: "bg-success text-success-foreground hover:bg-success/90 hover:shadow-lg hover:shadow-success/25 hover:scale-105 active:scale-95",
                warning: "bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-lg hover:shadow-warning/25 hover:scale-105 active:scale-95",
                danger: "bg-error text-error-foreground hover:bg-error/90 hover:shadow-lg hover:shadow-error/25 hover:scale-105 active:scale-95",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
                xs: "h-8 rounded-md px-2 text-xs",
                xl: "h-12 rounded-md px-10 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({
    className,
    variant,
    size,
    asChild = false,
    children,
    loading = false,
    iconName = null,
    iconPosition = 'left',
    iconSize = null,
    fullWidth = false,
    disabled = false,
    ...props
}, ref) => {
    const Comp = asChild ? Slot : "button";

    // Icon size mapping based on button size
    const iconSizeMap = {
        xs: 12,
        sm: 14,
        default: 16,
        lg: 18,
        xl: 20,
        icon: 16,
    };

    const calculatedIconSize = iconSize || iconSizeMap[size] || 16;

    // Enhanced loading spinner with animation
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );

    // Icon rendering with enhanced animations
    const renderIcon = () => {
        if (!iconName) return null;

        return (
            <Icon
                name={iconName}
                size={calculatedIconSize}
                className={cn(
                    "transition-all duration-200",
                    children && iconPosition === 'left' && "mr-2",
                    children && iconPosition === 'right' && "ml-2",
                    loading && "animate-pulse"
                )}
            />
        );
    };

    return (
        <Comp
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full",
                "group cursor-pointer",
                // Add ripple effect base
                "before:absolute before:inset-0 before:rounded-md before:bg-white/20 before:opacity-0 before:scale-0 before:transition-all before:duration-300",
                "hover:before:opacity-100 hover:before:scale-100 active:before:scale-95"
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out" />
            
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            <span className="relative z-10 transition-all duration-200 group-hover:scale-105">
                {children}
            </span>
            {iconName && iconPosition === 'right' && renderIcon()}
        </Comp>
    );
});

Button.displayName = "Button";

export default Button;