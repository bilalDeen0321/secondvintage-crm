import { debounce } from "@/app/utils";
import { WatchResource } from "@/types/resources/watch";
import { router } from "@inertiajs/react";
import qs from 'qs';

export type SortField =
    | "name"
    | "sku"
    | "brand"
    | "acquisitionCost"
    | "batchGroup"
    | "status"
    | "location";
export type SortDirection = "asc" | "desc";

export interface ModalState {
    platformDataModal: {
        isOpen: boolean;
        watch: WatchResource | null;
        platform: string;
    };
    singleViewModal: {
        isOpen: boolean;
        watch: WatchResource | null;
        selectedImageIndex: number;
    };
}

export interface HandlerParams {
    watches: WatchResource[];
    selectedWatches: string[];
    watchPlatforms: Record<string, string>;
    sortField: SortField;
    sortDirection: SortDirection;
    platformDataModal: ModalState['platformDataModal'];
    setSelectedWatches: React.Dispatch<React.SetStateAction<string[]>>;
    setWatchPlatforms: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    setProcessingWatches: React.Dispatch<React.SetStateAction<Set<string>>>;
    setSortField: React.Dispatch<React.SetStateAction<SortField>>;
    setSortDirection: React.Dispatch<React.SetStateAction<SortDirection>>;
    setPlatformDataModal: React.Dispatch<React.SetStateAction<ModalState['platformDataModal']>>;
    setSingleViewModal: React.Dispatch<React.SetStateAction<ModalState['singleViewModal']>>;
}

export const createHandlers = (params: HandlerParams) => {
    const {
        watches,
        selectedWatches,
        watchPlatforms,
        sortField,
        sortDirection,
        platformDataModal,
        setSelectedWatches,
        setWatchPlatforms,
        setProcessingWatches,
        setSortField,
        setSortDirection,
        setPlatformDataModal,
        setSingleViewModal,
    } = params;

    const handleSelectWatch = (watchId: string, checked: boolean) => {
        if (checked) {
            setSelectedWatches([...selectedWatches, watchId]);
        } else {
            setSelectedWatches(selectedWatches.filter((id) => id !== watchId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedWatches(watches.map((w) => String(w.id)));
        } else {
            setSelectedWatches([]);
        }
    };

    const handleSelectByStatus = (status: string) => {
        const watchesByStatus = watches.filter((w) => w.status === status);
        const statusWatchIds = watchesByStatus.map((w) => String(w.id));
        setSelectedWatches([
            ...new Set([...selectedWatches, ...statusWatchIds]),
        ]);
    };

    const handlePlatformChange = (watchId: string, platform: string) => {
        // Add the watch to processing state
        setProcessingWatches((prev) => new Set([...prev, watchId]));

        // Update the platform immediately
        setWatchPlatforms((prev) => ({
            ...prev,
            [watchId]: platform,
        }));

        // Remove from processing state after 3 seconds
        setTimeout(() => {
            setProcessingWatches((prev) => {
                const newSet = new Set(prev);
                newSet.delete(watchId);
                return newSet;
            });
        }, 3000);
    };

    const handleBulkPlatformChange = (newPlatform: string) => {
        const updates: Record<string, string> = {};
        selectedWatches.forEach((watchId) => {
            updates[watchId] = newPlatform;
            // Add each watch to processing state
            setProcessingWatches((prev) => new Set([...prev, watchId]));
        });
        setWatchPlatforms((prev) => ({
            ...prev,
            ...updates,
        }));

        // Remove all from processing state after 3 seconds
        setTimeout(() => {
            setProcessingWatches((prev) => {
                const newSet = new Set(prev);
                selectedWatches.forEach((watchId) => newSet.delete(watchId));
                return newSet;
            });
        }, 3000);
    };

    const handleViewPlatformData = (watch: WatchResource, platform: string) => {
        setPlatformDataModal({
            isOpen: true,
            watch,
            platform,
        });
    };

    const closePlatformDataModal = () => {
        setPlatformDataModal({
            isOpen: false,
            watch: null,
            platform: "",
        });
    };

    const handleModalNext = () => {
        if (!platformDataModal.watch) return;

        const currentIndex = watches.findIndex(
            (w) => w.id === platformDataModal.watch!.id
        );
        const nextIndex = (currentIndex + 1) % watches.length;
        const nextWatch = watches[nextIndex];
        const nextPlatform = watchPlatforms[nextWatch.id] || "None";

        if (nextPlatform !== "None") {
            setPlatformDataModal({
                isOpen: true,
                watch: nextWatch,
                platform: nextPlatform,
            });
        }
    };

    const handleModalPrevious = () => {
        if (!platformDataModal.watch) return;

        const currentIndex = watches.findIndex(
            (w) => w.id === platformDataModal.watch!.id
        );
        const prevIndex =
            currentIndex === 0 ? watches.length - 1 : currentIndex - 1;
        const prevWatch = watches[prevIndex];
        const prevPlatform = watchPlatforms[prevWatch.id] || "None";

        if (prevPlatform !== "None") {
            setPlatformDataModal({
                isOpen: true,
                watch: prevWatch,
                platform: prevPlatform,
            });
        }
    };

    const handleOpenSingleView = (watch: WatchResource) => {
        setSingleViewModal({
            isOpen: true,
            watch,
            selectedImageIndex: 0,
        });
    };

    const closeSingleViewModal = () => {
        setSingleViewModal({
            isOpen: false,
            watch: null,
            selectedImageIndex: 0,
        });
    };

    const handleThumbnailClick = (index: number) => {
        setSingleViewModal((prev) => ({
            ...prev,
            selectedImageIndex: index,
        }));
    };

    const handleSort = (column: string, dir: "asc" | "desc" = 'desc') => {

        if (sortField === column) {
            dir = sortDirection === "asc" ? "desc" : "asc";
        }

        setSortField(column as SortField);
        setSortDirection(dir);

        const current = qs.parse(window.location.search, {
            ignoreQueryPrefix: true,
        });

        const params = { ...current, order: { column, dir } };

        debouncedNavigate(params);
    };

    return {
        handleSelectWatch,
        handleSelectAll,
        handleSelectByStatus,
        handlePlatformChange,
        handleBulkPlatformChange,
        handleViewPlatformData,
        closePlatformDataModal,
        handleModalNext,
        handleModalPrevious,
        handleOpenSingleView,
        closeSingleViewModal,
        handleThumbnailClick,
        handleSort,
    };
};

// Create a debounced router call once
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debouncedNavigate = debounce((params: Record<string, any>) => {
    router.get(route("sales.index"), params, {
        preserveScroll: true,
        preserveState: true,
        replace: true,
    });
}, 300);