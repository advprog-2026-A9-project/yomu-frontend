import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../../components/auth/RegisterForm';

describe('RegisterForm', () => {

    test('menampilkan form register', () => {
        render(<RegisterForm />);
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email (opsional jika pakai HP)')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Nomor HP (opsional jika pakai email)')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Display Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Daftar')).toBeInTheDocument();
    });

    test('menampilkan error jika email dan HP kosong', async () => {
        render(<RegisterForm />);
        await userEvent.type(screen.getByPlaceholderText('Username'), 'mizukitest');
        await userEvent.click(screen.getByText('Daftar'));
        expect(screen.getByText('Email atau nomor HP harus diisi')).toBeInTheDocument();
    });

    test('menampilkan error jika username kosong', async () => {
        render(<RegisterForm />);
        await userEvent.type(screen.getByPlaceholderText('Email (opsional jika pakai HP)'), 'test@test.com');
        await userEvent.click(screen.getByText('Daftar'));
        expect(screen.getByText('Username harus diisi')).toBeInTheDocument();
    });

    test('menampilkan error jika format email tidak valid', async () => {
        render(<RegisterForm />);
        await userEvent.type(screen.getByPlaceholderText('Username'), 'mizukitest');
        await userEvent.type(screen.getByPlaceholderText('Email (opsional jika pakai HP)'), 'invalid-email');
        await userEvent.click(screen.getByText('Daftar'));
        expect(screen.getByText('Format email tidak valid. Contoh: example@gmail.com')).toBeInTheDocument();
    });
});