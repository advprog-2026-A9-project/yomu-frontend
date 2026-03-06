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
    userId: string;
}

export interface deleteClanPayload {
    id: string;
    userId: string;
}

export async function createClan(data: CreateClanPayload): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return response.json();
}

export async function deleteClan(data: deleteClanPayload): Promise<any> {
    const response = await fetchWithTimeout(`${API_BASE}/${data.id}/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: data.userId
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    return response.text();
}