import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className = "", onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 rounded-2xl ${
        onClick ? "cursor-pointer active:scale-[0.98]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
