"use client"

import * as React from "react"
import Link from "next/link"
import { Copy, Share, Send, BookmarkIcon as BookmarkSimple } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PopoverAction({
  children,
  align = "end",
  sideOffset = 5,
  menuItems = [],
  onItemClick,
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleItemClick = (item, index, e) => {
    if (e?.stopPropagation) {
      e.stopPropagation();
    }
  
    if (onItemClick && !item.href) {
      onItemClick(item, index, e); // Ensure event is passed
    }

    // Only close the popover for button actions, not for links
    // Links will navigate away naturally
    if (!item.href) {
      setIsOpen(false);
    }
  };

  // Common styles for both buttons and links
  const itemStyles =
    "justify-start text-xs rounded-none text-[var(--white)] hover:bg-gray-700/10 hover:text-[var(--white)]"

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="max-w-max !p-0 bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden"
        align={align}
        sideOffset={sideOffset}
      >
        <div className="flex flex-col overflow-hidden">
          {menuItems.map((item, index) => {
            // If the item has an href, render it as a link
            if (item.href) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(buttonVariants({ variant: "ghost" }), itemStyles)}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={() => handleItemClick(item, index)}
                >
                  {item.icon && <item.icon size={15} />}
                  <span>{item.label}</span>
                </Link>
              )
            }

            // Otherwise render it as a button
            return (
              <Button key={index} variant="ghost" className={itemStyles} onClick={(e) => handleItemClick(item, index, e)}>
                {item.icon && <item.icon />}
                <span>{item.label}</span>
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

