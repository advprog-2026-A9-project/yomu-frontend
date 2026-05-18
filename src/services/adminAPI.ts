const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
            throw new Error('Request timeout. Mohon cek koneksi internet Anda.');
        }

        if (!navigator.onLine) {
            throw new Error('Tidak ada koneksi internet. Mohon cek koneksi Anda.');
        }

        throw new Error('Network error. Mohon coba lagi.');
    }
}

export interface AchievementAdminRecord {
    id: string;
    name: string;
    milestone: string;
    milestoneType: string;
    milestoneThreshold: number;
    tier?: string | null;
    earnedCount: number;
    active: boolean;
}

export interface DailyMissionAdminRecord {
    id: string;
    name: string;
    milestone: string;
    missionType: string;
    targetCount: number;
    rewardDescription: string;
    activeFrom: string | null;
    activeUntil: string | null;
    active: boolean;
}

export interface AchievementAdminPayload {
    name: string;
    milestone: string;
    milestoneType: string;
    milestoneThreshold: number;
    tier?: string | null;
}

export interface DailyMissionAdminPayload {
    name: string;
    milestone: string;
    missionType: string;
    targetCount: number;
    rewardDescription: string;
    activeFrom?: string | null;
    activeUntil?: string | null;
}

const authHeaders = () => {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export async function getAchievements(): Promise<AchievementAdminRecord[]> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/admin/achievements`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil daftar achievement');
    }

    return response.json();
}

export async function createAchievement(payload: AchievementAdminPayload): Promise<AchievementAdminRecord> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/admin/achievements`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal membuat achievement');
    }

    return response.json();
}

export async function updateAchievement(id: string, payload: AchievementAdminPayload): Promise<AchievementAdminRecord> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/admin/achievements/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal mengubah achievement');
    }

    return response.json();
}

export async function deleteAchievement(id: string): Promise<void> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/admin/achievements/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal menghapus achievement');
    }
}

export async function getDailyMissions(): Promise<DailyMissionAdminRecord[]> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/admin/daily-missions`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil daftar daily mission');
    }

    return response.json();
}

export async function createDailyMission(payload: DailyMissionAdminPayload): Promise<DailyMissionAdminRecord> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/admin/daily-missions`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal membuat daily mission');
    }

    return response.json();
}

export async function updateDailyMission(id: string, payload: DailyMissionAdminPayload): Promise<DailyMissionAdminRecord> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/admin/daily-missions/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal mengubah daily mission');
    }

    return response.json();
}

export async function deleteDailyMission(id: string): Promise<void> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/admin/daily-missions/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal menghapus daily mission');
    }
}

export async function selectDailyMissions(missionIds: string[]): Promise<void> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/admin/daily-missions/select`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(missionIds),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal menetapkan misi harian');
    }
}

export async function randomizeDailyMissions(): Promise<void> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/admin/daily-missions/randomize`, {
        method: 'POST',
        headers: authHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal merotasi misi secara acak');
    }
}
