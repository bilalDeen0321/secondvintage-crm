
export default function Loading(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className="flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
        </div>
    );
}
