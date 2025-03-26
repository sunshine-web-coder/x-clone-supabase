"use client"

import { useEffect, useRef } from "react"

export function AutoGrowingTextarea({ 
  value, 
  onChange, 
  placeholder, 
  className = "", 
  maxHeight = "none",
  ...props 
}) {
  const textareaRef = useRef(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'
    
    // Calculate new height
    const newHeight = Math.min(
      textarea.scrollHeight,
      maxHeight === "none" ? Infinity : maxHeight
    )
    
    // Set the new height
    textarea.style.height = `${newHeight}px`
  }

  // Adjust height when content changes
  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight]) // Added adjustHeight to dependencies

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange(e)
        adjustHeight()
      }}
      placeholder={placeholder}
      className={`w-full resize-none text-[var(--white)] overflow-hidden bg-transparent outline-none ${className}`}
      rows={1}
      {...props}
    />
  )
}
