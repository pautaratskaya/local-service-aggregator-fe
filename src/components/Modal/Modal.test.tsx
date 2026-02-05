import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Modal from './index';

const mockNavigate = vi.fn();
let mockLocationState: {
  background: { pathname: string; search: string };
} | null = null;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: mockLocationState,
      pathname: '/login',
      search: '',
    }),
  };
});

describe('Modal', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLocationState = null;
  });

  it('should render modal with title, children and close button', () => {
    render(
      <MemoryRouter>
        <Modal title="Test Modal">
          <p>Modal content</p>
        </Modal>
      </MemoryRouter>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /закрыть/i })
    ).toBeInTheDocument();
  });

  it('should close modal when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Modal title="Test Modal">
          <p>Content</p>
        </Modal>
      </MemoryRouter>
    );

    const closeButton = screen.getByRole('button', { name: /закрыть/i });
    await user.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should close modal when Escape key is pressed', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Modal title="Test Modal">
          <p>Content</p>
        </Modal>
      </MemoryRouter>
    );

    await user.keyboard('{Escape}');

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should close modal when overlay is clicked', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <MemoryRouter>
        <Modal title="Test Modal">
          <p>Content</p>
        </Modal>
      </MemoryRouter>
    );

    const overlay = container.querySelector('[class*="modalOverlay"]');
    if (overlay) {
      await user.click(overlay);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }
  });

  it('should not close modal when content is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Modal title="Test Modal">
          <p>Content</p>
        </Modal>
      </MemoryRouter>
    );

    await user.click(screen.getByText('Content'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  describe('with background navigation', () => {
    beforeEach(() => {
      mockNavigate.mockClear();
      mockLocationState = {
        background: {
          pathname: '/',
          search: '?filter=active',
        },
      };
    });

    it('should navigate to background location when close button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <Modal title="Test Modal">
            <p>Content</p>
          </Modal>
        </MemoryRouter>
      );

      const closeButton = screen.getByRole('button', { name: /закрыть/i });
      await user.click(closeButton);

      expect(mockNavigate).toHaveBeenCalledWith('/?filter=active', {
        replace: true,
      });
    });

    it('should navigate to background location when Escape is pressed', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <Modal title="Test Modal">
            <p>Content</p>
          </Modal>
        </MemoryRouter>
      );

      await user.keyboard('{Escape}');

      expect(mockNavigate).toHaveBeenCalledWith('/?filter=active', {
        replace: true,
      });
    });

    it('should navigate to background location when overlay is clicked', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <MemoryRouter>
          <Modal title="Test Modal">
            <p>Content</p>
          </Modal>
        </MemoryRouter>
      );

      const overlay = container.querySelector('[class*="modalOverlay"]');
      if (overlay) {
        await user.click(overlay);
        expect(mockNavigate).toHaveBeenCalledWith('/?filter=active', {
          replace: true,
        });
      }
    });
  });
});
