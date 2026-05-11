import { describe, expect, it, vi } from 'vitest'
import {
  ApiValidationError,
  applyValidationErrorsToForm,
  extractValidationErrors,
  flattenValidationErrors,
  isApiValidationError
} from '~/utils/apiValidation'

describe('utils/apiValidation', () => {
  describe('ApiValidationError', () => {
    it('has name, statusCode, errors, data', () => {
      const err = new ApiValidationError('Validation failed', { name: ['Required'] })
      expect(err.name).toBe('ApiValidationError')
      expect(err.message).toBe('Validation failed')
      expect(err.statusCode).toBe(422)
      expect(err.errors).toEqual({ name: ['Required'] })
      expect(err.data).toBeUndefined()
    })

    it('stores optional data', () => {
      const data = { message: 'Bad request' }
      const err = new ApiValidationError('Fail', { x: ['Error'] }, data)
      expect(err.data).toBe(data)
    })
  })

  it('isApiValidationError detects ApiValidationError', () => {
    const err = new ApiValidationError('Validation failed', { name: ['Required'] })
    expect(isApiValidationError(err)).toBe(true)
  })

  it('isApiValidationError rejects plain Error', () => {
    expect(isApiValidationError(new Error('x'))).toBe(false)
    expect(isApiValidationError(null)).toBe(false)
  })

  it('flattenValidationErrors returns first message per field', () => {
    const flat = flattenValidationErrors({
      name: ['Required', 'Other'],
      email: ['Invalid']
    })

    expect(flat).toEqual({
      name: 'Required',
      email: 'Invalid'
    })
  })

  it('flattenValidationErrors skips empty or non-array messages', () => {
    const flat = flattenValidationErrors({
      a: [],
      b: ['Only'],
      c: 'not-array' as any
    })
    expect(flat).toEqual({ b: 'Only' })
  })

  it('extractValidationErrors returns errors from ApiValidationError', () => {
    const err = new ApiValidationError('Fail', { field: ['Msg'] })
    expect(extractValidationErrors(err)).toEqual({ field: ['Msg'] })
  })

  it('extractValidationErrors returns null for null or undefined', () => {
    expect(extractValidationErrors(null)).toBe(null)
    expect(extractValidationErrors(undefined)).toBe(null)
  })

  it('extractValidationErrors returns null for non-422', () => {
    expect(extractValidationErrors({ statusCode: 500 })).toBe(null)
    expect(extractValidationErrors({ statusCode: 404, data: {} })).toBe(null)
  })

  it('extractValidationErrors supports FetchError-like shape', () => {
    const err = {
      statusCode: 422,
      data: {
        errors: { name: ['Required'] }
      }
    }

    expect(extractValidationErrors(err)).toEqual({ name: ['Required'] })
  })

  it('extractValidationErrors reads status from response.status when statusCode absent', () => {
    const err = {
      response: {
        status: 422,
        _data: { errors: { email: ['Invalid'] } }
      }
    }
    expect(extractValidationErrors(err)).toEqual({ email: ['Invalid'] })
  })

  it('extractValidationErrors reads data from response._data when data absent', () => {
    const err = {
      statusCode: 422,
      response: {
        _data: { errors: { phone: ['Required'] } }
      }
    }
    expect(extractValidationErrors(err)).toEqual({ phone: ['Required'] })
  })

  it('applyValidationErrorsToForm sets errors and returns true', () => {
    const setErrors = vi.fn()

    const err = {
      statusCode: 422,
      data: {
        errors: { name: ['Required'] }
      }
    }

    const applied = applyValidationErrorsToForm(err, setErrors)

    expect(applied).toBe(true)
    expect(setErrors).toHaveBeenCalledWith({ name: 'Required' })
  })

  it('applyValidationErrorsToForm returns false when no validation errors', () => {
    const setErrors = vi.fn()
    expect(applyValidationErrorsToForm(null, setErrors)).toBe(false)
    expect(applyValidationErrorsToForm({ statusCode: 500 }, setErrors)).toBe(false)
    expect(setErrors).not.toHaveBeenCalled()
  })
})
