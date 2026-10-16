import React, { useState, useEffect, useCallback } from 'react'
import { boutiqueSoundEngine } from '../audio/AllTheStarsSoundscape'
import { triggerHaptic } from '../utils/haptics'

export interface PhotoArchiveMetadata {
  title: string
  archiveRef: string
  date: string
  digicamStamp: string
  medium: string
  colorProfile?: string
  iso?: string
}

export function copyArchivalMetadata(photo: PhotoArchiveMetadata): boolean {
  if (typeof window === 'undefined') return false

  const text = `================================================
R ALICE MYSTICA — THE CREATIVE ARCHIVE
ARCHIVAL PHOTOGRAPHY RECORD
================================================
Title:         ${photo.title}
Ref Identifier:${photo.archiveRef}
Quartz Stamp:  ${photo.digicamStamp}
Date Captured: ${photo.date}
Medium Sensor: ${photo.medium}
Color Profile: ${photo.colorProfile || 'Archival Vintage Tone'}
Lens Exposure: ${photo.iso || 'Natural Lighting'}
Preservation:  Authentic User-Provided Photograph
Portfolio:     https://github.com/JanSteve/alice-mystica-portfolio
================================================`

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
      return true
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    }
  } catch {
    return false
  }
}

export interface DigicamShutterFlashProps {
  isFlashing: boolean
  onFlashEnd?: () => void
}

export function DigicamShutterFlash({ isFlashing, onFlashEnd }: DigicamShutterFlashProps) {
  useEffect(() => {
    if (!isFlashing) return
    const timer = setTimeout(() => {
      onFlashEnd?.()
    }, 280)
    return () => clearTimeout(timer)
  }, [isFlashing, onFlashEnd])

  if (!isFlashing) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-white pointer-events-none anim-shutter-flash"
    />
  )
}
