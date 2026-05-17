const API_BASE = "http://localhost:8080/api/clans";

async function parseJsonResponse<T>(response: Response, fallback: T): Promise<T> {
    const text = await response.text();

    if (!text.trim()) {
        return fallback;
    }

    return JSON.parse(text) as T;
}

function extractErrorMessage(text: string, fallback: string): string {
    if (!text || !text.trim()) {
        return fallback;
    }
    try {
        const parsed = JSON.parse(text);
        return parsed.message || parsed.error || text;
    } catch {
        return text;
    }
}

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

export interface LeaveClanPayload {
    id: string;
}

export interface JoinClanPayload {
    id: string;
}

export interface ClanResponse {
    id: string;
    name: string;
    description: string;
    leaderUserId: string;
    tier: string;
    score: number;
    effectiveScore?: number;
    memberCount: number;
    activeBuffs?: ClanModifier[];
    debuffs?: ClanModifier[];
}

export interface MyClanResponse {
    id: string;
    name: string;
    description: string;
    leaderUserId: string;
    role: string;
    tier: string;
    score: number;
    rank: number;
    members: { userId: string; username: string; role: string }[];
}

export interface ClanMember {
    userId: string;
    username: string;
    role: string;
    contribution: number;
    streak: number;
    isOnline: boolean;
}

export interface ClanModifier {
    name: string;
    multiplier: string;
    type: string;
    duration: string;
    description: string;
}

export interface ClanDetailResponse {
    id: string;
    name: string;
    description: string;
    leaderUserId: string;
    tier: string;
    rank: number;
    score: number;
    memberCount: number;
    maxMembers: number;
    avgAccuracy: number;
    members: ClanMember[];
    activeBuffs: ClanModifier[];
    debuffs: ClanModifier[];
}

export interface ClanJoinRequestResponse {
    id: number;
    clanId: string;
    userId: string;
    username: string;
    status: string;
    createdAt: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface SeasonStatusResponse {
    seasonNumber: number;
    status: string;
}

export interface SeasonClanSummary {
    clanId: string;
    clanName: string;
    tier: string;
    score: number;
    memberCount: number;
}

export interface SeasonTierSummary {
    tier: string;
    topClans: SeasonClanSummary[];
}

export interface SeasonEndResponse {
    processedSeasonNumber: number;
    newSeasonNumber: number;
    promotedClans: SeasonClanSummary[];
    relegatedClans: SeasonClanSummary[];
    unchangedClans: SeasonClanSummary[];
    tierSummaries: SeasonTierSummary[];
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
        throw new Error(extractErrorMessage(errorText, 'Gagal membuat clan'));
    }

    return parseJsonResponse(response, null);
}

export async function updateClan(clanId: String, data: CreateClanPayload): Promise<any> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/${clanId}/edit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(extractErrorMessage(errorText, 'Gagal mengedit clan'));
    }

    return parseJsonResponse(response, null);

}

export async function getAllClans(search?: string, random: boolean = false): Promise<ClanResponse[]> {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (random) params.append("random", "true");

    const response = await fetchWithTimeout(`${API_BASE}?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(extractErrorMessage(errorText, 'Gagal mengambil daftar clan'));
    }

    return parseJsonResponse(response, []);
}


export async function getMyClan(): Promise<MyClanResponse | null> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (response.status === 401 || response.status === 404) {
        return null;
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(extractErrorMessage(errorText, 'Gagal mengambil clan user'));
    }

    return parseJsonResponse<MyClanResponse | null>(response, null);
}

export async function getClanDetail(clanId: string): Promise<ClanDetailResponse> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/${clanId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil detail clan');
    }

    return parseJsonResponse(response, null as unknown as ClanDetailResponse);
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
        throw new Error(extractErrorMessage(errorText, 'Gagal menghapus clan'));
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
        throw new Error(extractErrorMessage(errorText, 'Gagal keluar dari clan'));
    }

    return response.text();
}

export async function joinClan(data: JoinClanPayload): Promise<any> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/${data.id}/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(extractErrorMessage(errorText, 'Gagal bergabung dengan clan'));
    }

    return response.text();
}

export async function getClanRequests(clanId: string, page: number = 0, size: number = 10): Promise<PageResponse<ClanJoinRequestResponse>> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/${clanId}/requests?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil daftar request');
    }

    return parseJsonResponse(response, { content: [], totalElements: 0, totalPages: 0, size: 10, number: 0 });
}

export async function acceptClanRequest(clanId: string, requestId: number): Promise<string> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/${clanId}/requests/${requestId}/accept`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(extractErrorMessage(errorText, 'Gagal menerima request'));
    }

    return response.text();
}

export async function rejectClanRequest(clanId: string, requestId: number): Promise<string> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/${clanId}/requests/${requestId}/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(extractErrorMessage(errorText, 'Gagal menolak request'));
    }

    return response.text();
}

export async function rejectAllClanRequests(clanId: string): Promise<string> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/${clanId}/requests/reject-all`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(extractErrorMessage(errorText, 'Gagal menolak semua request'));
    }

    return response.text();
}

export async function seedClanRequests(clanId: string, count: number): Promise<string> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/${clanId}/requests/seed/${count}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(extractErrorMessage(errorText, 'Gagal menambahkan seed request'));
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
    userEntry?: LeaderboardEntry;
}

export async function getLeaderboard(search?: string): Promise<LeaderboardByTier[]> {
    const token = localStorage.getItem("token");
    const url = search 
        ? `${API_BASE}/leaderboard?search=${encodeURIComponent(search)}`
        : `${API_BASE}/leaderboard`;

    const response = await fetchWithTimeout(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil leaderboard');
    }

    return parseJsonResponse(response, []);
}


export async function getCurrentSeason(): Promise<SeasonStatusResponse> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout("http://localhost:8080/api/seasons/current", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil status season');
    }

    return parseJsonResponse(response, { seasonNumber: 1, status: 'Active' });
}

export async function endSeason(): Promise<SeasonEndResponse> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout("http://localhost:8080/api/seasons/end", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        throw new Error('Gagal mengakhiri season');
    }

    return parseJsonResponse(response, {
        processedSeasonNumber: 1,
        newSeasonNumber: 2,
        promotedClans: [],
        relegatedClans: [],
        unchangedClans: [],
        tierSummaries: [],
    });
}
export async function kickMember(clanId: string, memberId: string): Promise<string> {
    const token = localStorage.getItem("token");
    const response = await fetchWithTimeout(`${API_BASE}/${clanId}/kick/${memberId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(extractErrorMessage(errorText, 'Gagal mengeluarkan anggota'));
    }

    return response.text();
}
