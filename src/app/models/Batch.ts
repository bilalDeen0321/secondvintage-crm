export class Batch {
    // Constants
    static readonly STATUS_PENDING = 'pending';
    static readonly STATUS_PREPARING = 'preparing';
    static readonly STATUS_SHIPPED = 'shipped';
    static readonly STATUS_IN_TRANSIT = 'in_transit';
    static readonly STATUS_CUSTOMS = 'customs';
    static readonly STATUS_DELIVERED = 'delivered';

    static readonly STATUSES = [
        Batch.STATUS_PENDING,
        Batch.STATUS_PREPARING,
        Batch.STATUS_SHIPPED,
        Batch.STATUS_IN_TRANSIT,
        Batch.STATUS_CUSTOMS,
        Batch.STATUS_DELIVERED,
    ] as const;

    static allStatuses(): string[] {
        return [
            Batch.STATUS_PENDING,
            Batch.STATUS_PREPARING,
            Batch.STATUS_SHIPPED,
            Batch.STATUS_IN_TRANSIT,
            Batch.STATUS_CUSTOMS,
            Batch.STATUS_DELIVERED,
        ];
    }

    static toHuman(status: string) {
        const statuses: Record<string, string> = {
            [Batch.STATUS_PENDING]: 'Pending',
            [Batch.STATUS_PREPARING]: 'Preparing',
            [Batch.STATUS_SHIPPED]: 'Shipped',
            [Batch.STATUS_IN_TRANSIT]: 'In Transit',
            [Batch.STATUS_CUSTOMS]: 'Customs',
            [Batch.STATUS_DELIVERED]: 'Delivered',
        };

        return statuses[status] ?? status;
    }

    static toColorClass(status: string) {
        const statuses: Record<string, string> = {
            [Batch.STATUS_PENDING]: 'bg-gray-100 text-gray-800',
            [Batch.STATUS_PREPARING]: 'bg-blue-100 text-blue-800',
            [Batch.STATUS_SHIPPED]: 'bg-yellow-100 text-yellow-800',
            [Batch.STATUS_IN_TRANSIT]: 'bg-purple-100 text-purple-800',
            [Batch.STATUS_CUSTOMS]: 'bg-orange-100 text-orange-800',
            [Batch.STATUS_DELIVERED]: 'bg-green-100 text-green-800',
        };

        return statuses[status] ?? 'bg-gray-100 text-gray-800';
    }

    static toDatabase(key: string): typeof Batch.STATUSES[number] | null {
        const statuses: Record<string, typeof Batch.STATUSES[number]> = {
            "Pending": Batch.STATUS_PENDING,
            "Preparing": Batch.STATUS_PREPARING,
            "Shipped": Batch.STATUS_SHIPPED,
            "In Transit": Batch.STATUS_IN_TRANSIT,
            "Customs": Batch.STATUS_CUSTOMS,
            "Delivered": Batch.STATUS_DELIVERED,
        };

        return statuses[key] ?? null;
    }
}