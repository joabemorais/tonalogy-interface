'use client'

import React, { useState } from 'react'
import { VisualChordInput } from '@/components/visual-chord-input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ChordInputDemo() {
  const [chords, setChords] = useState<string[]>(['Am', 'F', 'G', 'C'])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Visual Chord Input Demo</h1>
          <p className="text-muted-foreground">
            Test the new visual chord input component for triads only
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chord Progression Builder</CardTitle>
            <CardDescription>
              Click on chord buttons to open the visual builder. Select note, accidental, and chord type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VisualChordInput
              chords={chords}
              onChange={setChords}
              maxChords={8}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Chords:</div>
              <div className="text-lg font-mono">
                {chords.filter(c => c.trim()).join(' - ') || 'No chords selected'}
              </div>
              <div className="text-sm text-muted-foreground">
                Array: {JSON.stringify(chords)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
