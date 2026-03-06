import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginForm from '../../components/auth/LoginForm';

vi.mock('../../services/authAPI', () => ({
    loginUser: vi.fn(),
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