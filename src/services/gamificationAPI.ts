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

export interface DailyMissionProgress {
    dailyMissionId: string;
    dailyMissionName: string;
    missionType: string;
    milestone: string;
    targetCount?: number | null;
    accuracyThreshold?: number | null;
    requiredCount?: number | null;
    progressValue: number;
    completed: boolean;
    rewardScore: number;
}

export interface AchievementProgress {
    achievementId: string;
    achievementName: string;
    milestone: string;
    milestoneType: string;
    milestoneThreshold: number;
    accuracyThreshold?: number | null;
    progressValue: number;
    unlocked: boolean;
    tier: string;
    targetTier?: string | null;
}

export async function getTodayMissions(username: string): Promise<DailyMissionProgress[]> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/progress/daily-missions/today?username=${username}`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil misi harian');
    }

    return response.json();
}

export async function getMyAchievements(username: string): Promise<AchievementProgress[]> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/progress/achievements?username=${username}`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil achievement');
    }

    return response.json();
}

export async function getShowcase(username: string): Promise<string[]> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/showcase?username=${username}`, {
        method: 'GET',
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil showcase');
    }

    return response.json();
}

export async function updateShowcase(username: string, achievementIds: string[]): Promise<void> {
    const response = await fetchWithTimeout(`${BASE_URL}/api/gamification/showcase`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ username, achievementIds }),
    });

    if (!response.ok) {
        throw new Error('Gagal menyimpan showcase');
    }
}
