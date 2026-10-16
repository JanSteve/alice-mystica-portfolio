// =========================================================================
// MOBILE HAPTIC FEEDBACK UTILITY
// Provides tactile micro-vibrations for modern mobile touch interactions
// =========================================================================

export type HapticType = 'light' | 'medium' | 'heavy' | 'shutter' | 'success' | 'selection'

export function triggerHaptic(type: HapticType | number | number[] = 'light'): void {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return

  try {
    if (typeof type === 'number' || Array.isArray(type)) {
      navigator.vibrate?.(type)
      return
    }

    switch (type) {
      case 'selection':
      case 'light':
        navigator.vibrate?.(12)
        break
      case 'medium':
        navigator.vibrate?.(24)
        break
      case 'heavy':
        navigator.vibrate?.(40)
        break
      case 'shutter':
        // Double-click pulse mirroring mechanical shutter actuation
        navigator.vibrate?.([18, 35, 22])
        break
      case 'success':
        navigator.vibrate?.([15, 40, 30])
        break
    }
  } catch {
    // Vibration may be blocked by browser policy; silently fail
  }
}
