const API_BASE = "http://localhost:8080/api/clans";

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

export interface CreateClanPayload {
    name: string;
    description: string;
}

export interface deleteClanPayload {
    id: string;
}

export async function createClan(data: CreateClanPayload): Promise<any> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal membuat clan');
    }

    return response.json();
}

export async function deleteClan(data: deleteClanPayload): Promise<any> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/${data.id}/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    return response.text();
}

export async function leaveClan(data: LeaveClanPayload): Promise<any> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/${data.id}/leave`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Gagal keluar dari clan');
    }

    return response.text();
}

// Leaderboard types
export interface LeaderboardEntry {
    clanId: string;
    clanName: string;
    tier: string;
    score: number;
    rank: number;
    memberCount: number;
}

export interface LeaderboardByTier {
    tier: string;
    entries: LeaderboardEntry[];
}

export async function getLeaderboard(): Promise<LeaderboardByTier[]> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/leaderboard`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil leaderboard');
    }

    return response.json();
}


export async function endSeason(): Promise<string> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/admin/end-season`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error('Gagal mengakhiri season');
    }

    return response.text();
}

