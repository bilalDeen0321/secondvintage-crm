import { useEffect, useState } from "react";

export function useCompare<T>(initData: T) {
    const [compare, setCompare] = useState(false);
    const [oldData, setOldData] = useState(initData);
    const [newData, setNewData] = useState(initData);

    useEffect(() => {

        const is_similar = JSON.stringify(oldData) === JSON.stringify(newData);

        setCompare(!is_similar);

    }, [newData, oldData]);

    // Call this to mark current newData as saved baseline
    const markSaved = () => {
        setOldData(newData);
        setCompare(false);
    };

    return { compare, setCompare, setNewData, markSaved };
}
