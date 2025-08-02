import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export function useLocation() {
    const { url } = usePage();

    return useMemo(() => {
        const [pathname, search = ''] = url.split('?');
        return {
            pathname,
            search: search ? `?${search}` : '',
            hash: '', // Inertia doesn't provide hash, but you can add support if needed
            href: url,
        };
    }, [url]);
}
