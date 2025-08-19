
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';



// if (import.meta.env.BROADCAST_DRIVER) {
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.Pusher = Pusher;
// }

export const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: false,
    encrypted: true,
});

