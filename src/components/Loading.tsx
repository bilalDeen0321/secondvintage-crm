export default function Loading({ text }: { text?: string }) {
    return (
        <div className="flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
            {text && <span className="ml-2">{text}</span>}
        </div>
    );
}
