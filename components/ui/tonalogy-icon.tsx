import React from 'react'
import { cn } from '@/lib/utils'

interface TonalogyIconProps {
  size?: number
  className?: string
}

export function TonalogyIcon({ size = 24, className }: TonalogyIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 121 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
    >
      {/* Background - uses current background color */}
      <path d="M0 0h120.274v112.416H0z" fill="hsl(var(--background))"/>
      
      {/* Black stroke elements */}
      <path d="M46 63h9" stroke="currentColor" strokeWidth="4"/>
      
      {/* Blue filled shape (top right) */}
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M104.02 58 99 60.54v7.64h10.04v-7.64z" 
        fill="#A5D8FF"
      />
      <path 
        d="M104.02 58c-1.26.64-2.51 1.27-5.02 2.54m5.02-2.54c-1.03.52-2.06 1.04-5.02 2.54m5.02-2.54c1.42.72 3.22 1.63 5.02 2.54M104.02 58c1.43.73 3.22 1.64 5.02 2.54m-10.04 0v7.64h10.04v-7.64" 
        stroke="#4DABF7" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* Small white element with background color */}
      <path 
        d="M14.208 97.422v.03l-.01.01-.01.01-.01.01c-.01 0-.01 0-.01.01h-.04c0 .01-.01.01-.01.01-.01 0-.01 0-.02-.01h-.03c-.01-.01-.01-.01-.02-.01 0 0 0-.01-.01-.01 0 0 0-.01-.01-.01v-.01l-.01-.01v-.03s0-.01.01-.01v-.01l.01-.01.01-.01c.01-.01.01-.01.02-.01 0 0 .01 0 .01-.01h.07c.01.01.01.01.02.01l.01.01s.01 0 .01.01c0 0 .01 0 .01.01 0 0 .01 0 .01.01z" 
        fill="hsl(var(--background))"
      />
      
      {/* Blue lines and strokes */}
      <path d="M29 96V34" stroke="#4DABF7" strokeWidth="4"/>
      
      {/* Black stroke element */}
      <path d="M18 81h21" stroke="currentColor" strokeWidth="4"/>
      
      {/* Pentagon shape */}
      <path d="M48.51 58.617 41.076 81H16.924L9.49 58.617 29 44.75z" stroke="#4DABF7" strokeWidth="4"/>
      
      {/* Main ellipse with background fill */}
      <path 
        d="M44 9c3.763 0 7.466 2.427 10.328 6.974C57.174 20.494 59 26.862 59 34s-1.826 13.506-4.672 18.026C51.466 56.573 47.763 59 44 59s-7.466-2.427-10.328-6.974C30.826 47.506 29 41.138 29 34s1.826-13.506 4.672-18.026C36.534 11.427 40.237 9 44 9Z" 
        fill="hsl(var(--background))" 
        stroke="#4DABF7" 
        strokeWidth="4"
      />
      
      {/* White fill rectangles - now use background color */}
      <path fill="hsl(var(--background))" d="M31 34h41v27H31z"/>
      <path fill="hsl(var(--background))" d="M44 7h28v31H44z"/>
      
      {/* Circle stroke only */}
      <path d="M22 89a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z" stroke="#4DABF7" strokeWidth="4"/>
      
      {/* White fill rectangle */}
      <path d="M13 85h14v11H13z" fill="hsl(var(--background))"/>
      
      {/* Blue stroke lines */}
      <path d="M46 63h9" stroke="#4DABF7" strokeWidth="4"/>
      
      {/* Orange stroke line */}
      <path d="M66 63h11" stroke="#FFA94D" strokeWidth="4"/>
      
      {/* Blue stroke lines */}
      <path d="M58 36h11" stroke="#4DABF7" strokeWidth="4"/>
      
      {/* Green stroke line */}
      <path d="M67 88h20" stroke="#69DB7C" strokeWidth="4"/>
      
      {/* More blue stroke lines */}
      <path d="M88 63h9M42.512 24.682 29.207 46.149M42 10v16" stroke="#4DABF7" strokeWidth="4"/>
      
      {/* Small white rectangle */}
      <path fill="hsl(var(--background))" d="M44 25h1v2h-1z"/>
      
      {/* Green circle */}
      <circle cx="92" cy="88" r="5" fill="#B2F2BB" stroke="#69DB7C" strokeWidth="4"/>
      
      {/* Blue circle */}
      <circle cx="71" cy="36" r="5" fill="#A5D8FF" stroke="#4DABF7" strokeWidth="4"/>
      
      {/* Orange diamond shape */}
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="m77 58 1.504 5L77 68h7.002L87 63l-2.998-5z" 
        fill="#FFD8A8"
      />
      <path 
        d="M77 58c.558 1.847 1.106 3.694 1.504 5M77 58a1649 1649 0 0 0 1.504 5M77 58h7.002m-5.498 5c-.408 1.346-.807 2.692-1.504 5m1.504-5c-.518 1.72-1.036 3.448-1.504 5m0 0h7.002m0 0L87 63m-2.998 5c1.126-1.876 2.241-3.743 2.998-5m0 0c-.667-1.11-1.325-2.21-2.998-5M87 63c-.916-1.523-1.833-3.055-2.998-5" 
        stroke="#FFA94D" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* Green stroke lines */}
      <path d="M60 88V66" stroke="#69DB7C" strokeWidth="4"/>
      
      {/* Blue stroke line */}
      <path d="M60 63V34" stroke="#4DABF7" strokeWidth="4"/>
      
      {/* Orange circle */}
      <circle cx="60" cy="63" r="5" fill="#FFD8A8" stroke="#FFA94D" strokeWidth="4"/>
      
      {/* Green hexagon shape */}
      <path 
        d="m62.719 83.5 2.698 4.5-2.698 4.5h-6.047l1.31-4.356.044-.144-.044-.144-1.31-4.356z" 
        fill="#B2F2BB" 
        stroke="#69DB7C"
      />
      
      {/* Green diamond fill (complex path) */}
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M56 83c.349 1.15.687 2.308 1.504 5Zm0 0c.388 1.277.767 2.564 1.504 5Zm1.504 5A700 700 0 0 0 56 93Zm0 0c-.548 1.798-1.086 3.605-1.504 5ZM56 93h7.002Zm0 0h7.002Zm7.002 0c.906-1.513 1.803-3.016 2.998-5Zm0 0c.717-1.198 1.434-2.407 2.998-5ZM66 88a1343 1343 0 0 1-2.998-5Zm0 0c-.757-1.267-1.524-2.534-2.998-5Zm-2.998-5H56Zm0 0H56Z" 
        fill="#B2F2BB"
      />
      
      {/* Green diamond stroke */}
      <path 
        d="M56 83c.349 1.15.687 2.308 1.504 5M56 83c.388 1.277.767 2.564 1.504 5M56 83h7.002m-5.498 5A700 700 0 0 0 56 93m1.504-5c-.548 1.798-1.086 3.605-1.504 5m0 0h7.002m0 0c.906-1.513 1.803-3.016 2.998-5m-2.998 5c.717-1.198 1.434-2.407 2.998-5m0 0a1343 1343 0 0 1-2.998-5M66 88c-.757-1.267-1.524-2.534-2.998-5" 
        stroke="#69DB7C" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
    </svg>
  )
}
