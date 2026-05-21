const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = 10000
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

const authHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export interface ReadingStats {
    completedTexts: number;
    totalMinutes: number;
    quizAccuracy: number;
}

export interface ShowcaseAchievement {
    id: string;
    name: string;
    description: string;
    tier: string;
}

export interface UserProfile {
    userId: string;
    username: string;
    displayName: string;
    bio: string;
    joinedDate: string;
    clanName?: string;
    clanTier?: string;
    readingStats: ReadingStats;
    showcaseAchievements: ShowcaseAchievement[];
}

export async function getUserProfile(identifier: string): Promise<UserProfile> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/profile/${identifier}`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil profil user');
    }

    return response.json();
}

export async function updateMyBio(bio: string): Promise<UserProfile> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/profile/bio`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ bio }),
    });

    if (!response.ok) {
        throw new Error('Gagal memperbarui bio');
    }

    return response.json();
}

export async function updateMyProfile(data: {
    username?: string;
    displayName?: string;
    oldPassword?: string;
    newPassword?: string;
}): Promise<void> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/auth/account`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Gagal memperbarui profil');
    }
}