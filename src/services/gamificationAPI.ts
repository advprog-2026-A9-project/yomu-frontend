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

export interface DailyMissionProgress {
    dailyMissionId: string;
    dailyMissionName: string;
    missionType: string;
    milestone: string;
    targetCount: number;
    progressValue: number;
    completed: boolean;
    rewardDescription: string;
}

export interface AchievementProgress {
    achievementId: string;
    achievementName: string;
    milestone: string;
    milestoneType: string;
    milestoneThreshold: number;
    progressValue: number;
    unlocked: boolean;
    tier: string;
}

export async function getTodayMissions(userId: string): Promise<DailyMissionProgress[]> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/progress/daily-missions/today?userId=${userId}`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil misi harian');
    }

    return response.json();
}

export async function getMyAchievements(userId: string): Promise<AchievementProgress[]> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/progress/achievements?userId=${userId}`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil achievement');
    }

    return response.json();
}

export async function getShowcase(userId: string): Promise<string[]> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/showcase?userId=${userId}`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil showcase');
    }

    return response.json();
}

export async function updateShowcase(userId: string, achievementIds: string[]): Promise<void> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/showcase`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ userId, achievementIds }),
    });

    if (!response.ok) {
        throw new Error('Gagal menyimpan showcase');
    }
}
