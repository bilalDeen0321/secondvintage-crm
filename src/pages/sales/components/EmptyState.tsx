import React from "react";

const EmptyState: React.FC = () => {
    return (
        <div className="py-12 text-center">
            <div className="mb-4 text-6xl">⌚</div>
            <h3 className="mb-2 text-xl font-medium text-slate-900">
                No watches found
            </h3>
            <p className="text-slate-600">
                Try adjusting your search or filters
            </p>
        </div>
    );
};

export default EmptyState;