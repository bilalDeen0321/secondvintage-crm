import WatchDescription from '@/pages/watches/components/WatchDescription'
import { WatchResource } from '@/types/resources/watch'

export default function WatchTableDescription({ watch }: { watch: WatchResource }) {
    return <div
        className="line-clamp-2 text-xs leading-tight text-slate-600"
        style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
        }}
        title={watch.description}
    >
        <WatchDescription watch={watch} />
    </div>
}
