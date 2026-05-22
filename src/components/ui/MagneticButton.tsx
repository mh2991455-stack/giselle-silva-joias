"use client";

import React, { useRef, useState, useEffect } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  factor?: number;
  as?: "button" | "a" | "div";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  [key: string]: unknown;
}

export function MagneticButton({
  children,
  className = "",
  factor = 0.3,
  as: Tag = "button",
  ...props
}: MagneticButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    setHasHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    if (!hasHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * factor;
    const dy = (e.clientY - cy) * factor;
    ref.current.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function handleMouseLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
    ref.current.style.transition = "transform 0.4s ease";
  }

  function handleMouseEnter() {
    if (!ref.current) return;
    ref.current.style.transition = "transform 0.1s ease";
  }

  const El = Tag as "button";
  return (
    <El
      ref={ref}
      className={`inline-flex items-center justify-center ${className}`}
      onMouseMove={handleMouseMove as never}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      {...(props as React.ComponentPropsWithoutRef<"button">)}
    >
      {children}
    </El>
  );
}
