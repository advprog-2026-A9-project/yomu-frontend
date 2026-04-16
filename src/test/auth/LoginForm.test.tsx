import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginForm from '../../components/auth/LoginForm';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        login: vi.fn(),
    }),
}));

describe('LoginForm', () => {

    test('menampilkan form login', () => {
        render(<LoginForm />);
        expect(screen.getByPlaceholderText('Username / Email / Nomor HP')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    test('menampilkan error jika identifier kosong', async () => {
        render(<LoginForm />);
        await userEvent.click(screen.getByRole('button', { name: 'Login' }));
        expect(screen.getByText('Username/Email/HP harus diisi')).toBeInTheDocument();
    });

    test('menampilkan error jika password kosong', async () => {
        render(<LoginForm />);
        await userEvent.type(screen.getByPlaceholderText('Username / Email / Nomor HP'), 'mizukitest');
        await userEvent.click(screen.getByRole('button', { name: 'Login' }));
        expect(screen.getByText('Password harus diisi')).toBeInTheDocument();
    });
});