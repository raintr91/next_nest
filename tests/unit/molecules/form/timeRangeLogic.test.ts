import { describe, expect, it } from 'vitest'
import {
  pad2,
  parseTime,
  formatTime,
  splitDateTime,
  joinDateTime
} from '~/components/molecules/form/timeRangeLogic'

describe('molecules/form/timeRangeLogic', () => {
  describe('pad2', () => {
    it('pads to 2 digits', () => {
      expect(pad2(0)).toBe('00')
      expect(pad2(9)).toBe('09')
      expect(pad2(23)).toBe('23')
    })
  })

  describe('parseTime', () => {
    it('parses HH', () => {
      expect(parseTime('9')).toEqual({ h: 9, m: 0, s: 0 })
      expect(parseTime('23')).toEqual({ h: 23, m: 0, s: 0 })
    })
    it('parses HH:MM', () => {
      expect(parseTime('09:30')).toEqual({ h: 9, m: 30, s: 0 })
    })
    it('parses HH:MM:SS', () => {
      expect(parseTime('09:30:45')).toEqual({ h: 9, m: 30, s: 45 })
    })
    it('clamps to valid range', () => {
      expect(parseTime('25:00')).toEqual({ h: 23, m: 0, s: 0 })
      expect(parseTime('00:70')).toEqual({ h: 0, m: 59, s: 0 })
      expect(parseTime('-1:10:-5')).toEqual({ h: 0, m: 10, s: 0 })
    })
    it('returns zeros for empty', () => {
      expect(parseTime('')).toEqual({ h: 0, m: 0, s: 0 })
    })

    it('handles missing hour segment and missing minute segment', () => {
      expect(parseTime(':10')).toEqual({ h: 0, m: 10, s: 0 })
      expect(parseTime('9')).toEqual({ h: 9, m: 0, s: 0 })
    })
  })

  describe('formatTime', () => {
    it('format h returns HH', () => {
      expect(formatTime(9, 0, 0, 'h')).toBe('09')
    })
    it('format h:m returns HH:MM', () => {
      expect(formatTime(9, 30, 0, 'h:m')).toBe('09:30')
    })
    it('format h:m:s returns HH:MM:SS', () => {
      expect(formatTime(9, 30, 45, 'h:m:s')).toBe('09:30:45')
    })
  })

  describe('splitDateTime', () => {
    it('returns empty for undefined', () => {
      expect(splitDateTime(undefined)).toEqual({ date: '', time: '00:00' })
    })
    it('splits ISO to date and time', () => {
      const r = splitDateTime('2025-01-15T09:30:00Z')
      expect(r.date).toBe('2025-01-15')
      expect(r.time).toMatch(/^\d{2}:\d{2}:\d{2}$/)
    })
    it('returns empty for invalid date', () => {
      expect(splitDateTime('invalid')).toEqual({ date: '', time: '00:00' })
    })
  })

  describe('joinDateTime', () => {
    it('returns empty when no date', () => {
      expect(joinDateTime('', '09:00')).toBe('')
    })
    it('joins date and time', () => {
      expect(joinDateTime('2025-01-15', '09:30')).toBe('2025-01-15T09:30:00')
    })
    it('pads time parts', () => {
      expect(joinDateTime('2025-01-15', '9:5')).toBe('2025-01-15T09:05:00')
    })

    it('uses 00:00:00 when time is empty', () => {
      expect(joinDateTime('2025-01-15', '')).toBe('2025-01-15T00:00:00')
    })

    it('uses defaults when minute and second are missing', () => {
      expect(joinDateTime('2025-01-15', '9')).toBe('2025-01-15T09:00:00')
    })
  })
})
