export function validateSpotifyUrl(input: string): string | null {
    const value = input.trim();

    try {
        const url = new URL(value);

        if (url.protocol !== 'https:') {
            return null;
        }

        if (url.hostname !== 'open.spotify.com') {
            return null;
        }

        if (url.username || url.password) {
            return null;
        }

        if (url.port) {
            return null;
        }

        if (/[\r\n\t]/.test(value)) {
            return null;
        }

        return url.toString();
    } catch {
        return null;
    }
}
