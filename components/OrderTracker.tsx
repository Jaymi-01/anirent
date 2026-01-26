"use client"

import { Check, Package, Truck, CircleDot, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTrackerProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  className?: string;
}

export function OrderTracker({ status, className }: OrderTrackerProps) {
  if (status === 'cancelled') {
    return (
      <div className={cn("w-full p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive", className)}>
        <p className="font-semibold flex items-center gap-2">
          <CircleDot className="h-5 w-5" />
          Order Cancelled
        </p>
        <p className="text-sm opacity-80 mt-1">This order has been cancelled and will not be processed.</p>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Check },
  ];

  const getCurrentStepIndex = () => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className={cn("w-full py-6", className)}>
      <div className="relative flex justify-between">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-0 w-full h-1 bg-muted -z-10" />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-5 left-0 h-1 bg-primary transition-all duration-500 -z-10" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background transition-all duration-300",
                  isActive ? "border-primary text-primary" : "border-muted text-muted-foreground",
                  isCurrent && "ring-4 ring-primary/20 scale-110",
                  isCompleted && "bg-primary text-primary-foreground border-primary"
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors duration-300",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
