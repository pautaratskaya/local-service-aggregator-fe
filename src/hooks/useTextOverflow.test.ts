import { renderHook } from '@testing-library/react';
import { useTextOverflow } from './useTextOverflow';
import { createRef, type RefObject } from 'react';
import { describe, it, expect } from 'vitest';

describe('useTextOverflow', () => {
  it('should return false when element is null', () => {
    const ref = createRef<HTMLDivElement>();
    const { result } = renderHook(() => useTextOverflow(ref, 'test text'));

    expect(result.current).toBe(false);
  });

  it('should return false when text is not overflowing', () => {
    const ref = createRef<HTMLDivElement>();
    const element = document.createElement('div');

    // Mock element dimensions - not overflowing
    Object.defineProperty(element, 'scrollWidth', {
      value: 100,
      configurable: true,
    });
    Object.defineProperty(element, 'clientWidth', {
      value: 100,
      configurable: true,
    });

    (ref as RefObject<HTMLDivElement>).current = element;

    const { result } = renderHook(() => useTextOverflow(ref, 'test text'));

    expect(result.current).toBe(false);
  });

  it('should return true when text is overflowing', () => {
    const ref = createRef<HTMLDivElement>();
    const element = document.createElement('div');

    // Mock element dimensions - overflowing
    Object.defineProperty(element, 'scrollWidth', {
      value: 200,
      configurable: true,
    });
    Object.defineProperty(element, 'clientWidth', {
      value: 100,
      configurable: true,
    });

    (ref as RefObject<HTMLDivElement>).current = element;

    const { result } = renderHook(() =>
      useTextOverflow(ref, 'very long text that overflows')
    );

    expect(result.current).toBe(true);
  });
});
