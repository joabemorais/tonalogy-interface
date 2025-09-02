import React from 'react'

export default function ScrollbarTest() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-bold">Scrollbar Style Test</h1>
      
      {/* Test 1: Always visible scrollbar */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Always Visible Scrollbar</h2>
        <div className="h-32 overflow-y-auto custom-scrollbar border rounded-lg p-4 bg-card">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="py-2 border-b last:border-b-0">
              Item {i + 1}: This is a scrollable item with always visible scrollbar
            </div>
          ))}
        </div>
      </div>

      {/* Test 2: Auto-hide scrollbar */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Auto-Hide Scrollbar (hover to show)</h2>
        <div className="h-32 overflow-y-auto custom-scrollbar-autohide border rounded-lg p-4 bg-card">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="py-2 border-b last:border-b-0">
              Item {i + 1}: This scrollbar only appears on hover for a cleaner look
            </div>
          ))}
        </div>
      </div>

      {/* Test 3: Horizontal scrollbar */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Horizontal Scrollbar</h2>
        <div className="w-full overflow-x-auto custom-scrollbar border rounded-lg p-4 bg-card">
          <div className="flex gap-4 w-max">
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} className="min-w-[200px] p-4 bg-secondary rounded-lg">
                Card {i + 1}: Wide content that requires horizontal scrolling
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
