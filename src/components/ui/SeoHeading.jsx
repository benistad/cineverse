import React from 'react';

/**
 * SeoHeading component for consistent heading tags across the site
 * Ensures proper semantic HTML while maintaining styling
 */
export default function SeoHeading({ 
  level = 1, 
  children, 
  className = "", 
  id = "",
  ...props 
}) {
  // Default styling based on heading level
  const defaultStyles = {
    1: "text-3xl md:text-4xl font-bold mb-4",
    2: "text-2xl md:text-3xl font-bold mb-3",
    3: "text-xl md:text-2xl font-semibold mb-2",
    4: "text-lg md:text-xl font-semibold mb-2",
    5: "text-base md:text-lg font-medium mb-1",
    6: "text-sm md:text-base font-medium mb-1"
  };

  // Combine default styles with custom className
  const combinedClassName = `${defaultStyles[level] || ""} ${className}`.trim();
  
  // Create the appropriate heading element based on level
  const HeadingTag = `h${level}`;
  
  return (
    <HeadingTag className={combinedClassName} id={id} {...props}>
      {children}
    </HeadingTag>
  );
}
