export default class Status {

    //define all status
    static readonly SOLD = 'sold';
    static readonly DRAFT = 'draft';
    static readonly REVIEW = 'review';
    static readonly APPROVED = 'approved';
    static readonly PLATFORM_REVIEW = 'platform_review';
    static readonly LISTING = 'ready_for_listing';
    static readonly LISTED = 'listed';
    static readonly RESERVED = 'reserved';
    static readonly PROBLEM = 'defect_problem';
    static readonly STANDBY = 'standby';

    static statuses = [
        Status.DRAFT,
        Status.REVIEW,
        Status.APPROVED,
        Status.PLATFORM_REVIEW,
        Status.LISTING,
        Status.LISTED,
        Status.RESERVED,
        Status.SOLD,
        Status.PROBLEM,
        Status.STANDBY,
    ] as const;

    static allStatuses(): string[] {
        return [
            Status.DRAFT,
            Status.REVIEW,
            Status.APPROVED,
            Status.PLATFORM_REVIEW,
            Status.LISTING,
            Status.LISTED,
            Status.RESERVED,
            Status.SOLD,
            Status.PROBLEM,
            Status.STANDBY,
        ];
    }

    static toHuman(status: string) {

        // Map from your Status constants to display names
        const statuses: Record<string, string> = {
            all: 'All',
            [Status.SOLD]: 'Sold',
            [Status.DRAFT]: 'Draft',
            [Status.LISTED]: 'Listed',
            [Status.REVIEW]: 'Review',
            [Status.LISTING]: 'Ready for listing',
            [Status.APPROVED]: 'Approved',
            [Status.RESERVED]: 'Reserved',
            [Status.PLATFORM_REVIEW]: 'Platform Review',
            [Status.STANDBY]: 'Standby', // if you want to use literal key
            [Status.PROBLEM]: 'Defect/Problem',
        };

        return statuses[status] ?? status;
    }


    static toColorClass(status: string) {

        // Map from Status constants to display color class
        const statuses: Record<string, string> = {
            [Status.SOLD]: 'bg-slate-300 text-slate-800',
            [Status.DRAFT]: 'bg-gray-100 text-gray-800',
            [Status.LISTED]: 'bg-green-600 text-white',
            [Status.REVIEW]: 'bg-blue-100 text-blue-800',
            [Status.APPROVED]: 'bg-green-100 text-green-800',
            [Status.LISTING]: 'bg-green-100 text-green-800',
            [Status.RESERVED]: 'bg-purple-100 text-purple-800',
            [Status.PLATFORM_REVIEW]: 'bg-blue-600 text-white',
            [Status.STANDBY]: 'bg-amber-100 text-amber-800', // if you want to use literal key
            [Status.PROBLEM]: 'bg-red-100 text-red-800',
        };


        return statuses[status] ?? 'bg-gray-100 text-gray-800';
    }


    static toDatabase(key: string): typeof Status.statuses[number] | null {

        const statuses: Record<string, typeof Status.statuses[number]> = {
            "Draft": Status.DRAFT,
            "Approved": Status.APPROVED,
            "Listed": Status.LISTED,
            "Ready for listing": Status.LISTING,
            "Review": Status.REVIEW,
            "Sold": Status.SOLD,
            "Reserved": Status.RESERVED,
            "Platform Review": Status.PLATFORM_REVIEW,
            "Standby": Status.STANDBY,
            "Defect/Problem": Status.PROBLEM,
        };

        return statuses[key] ?? null; // return null if not found
    }

}
