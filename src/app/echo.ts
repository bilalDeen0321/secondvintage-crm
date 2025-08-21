
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';



// if (import.meta.env.BROADCAST_DRIVER) {
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.Pusher = Pusher;
// }

export const echo = new Echo({
    broadcaster: 'pusher',
    key: 'f2699d64f893d67117f3',
    cluster: 'ap2',
    forceTLS: false,
    encrypted: true,
});

