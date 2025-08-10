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

    public name: string;

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
            [Status.RESERVED]: 'Reserved',
            [Status.PLATFORM_REVIEW]: 'Platform Review',
            [Status.STANDBY]: 'Standby', // if you want to use literal key
            [Status.PROBLEM]: 'Defect/Problem',
        };


        return statuses[status] ?? status;
    }

    static toDatabase(key: string): typeof Status.statuses[number] | null {

        const statuses: Record<string, typeof Status.statuses[number]> = {
            "Draft": Status.DRAFT,
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
