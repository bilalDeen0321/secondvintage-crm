import InputError from "@/components/InputError";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Option = string | { id: string | number; label: string };

type Props = {
    label?: string;
    data: Option[];
    error?: string;
} & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

export default function RawSelect(props: Props) {

    const { data, label, error, className, name, multiple = false, ...params } = props;

    return (
        <div className="space-y-2">
            {label && <Label htmlFor={name}>{label || name}</Label>}
            <select
                multiple={multiple}
                name={name}
                id={name}
                className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize", className,
                )}

                {...params}
            >
                {!multiple && (
                    <option value="">
                        Select {multiple ? "options" : "option"}
                    </option>
                )}
                {data.map((option, index) =>
                    typeof option === "string" ? (
                        <option key={`${option}-${index}`} value={option}>
                            {option}
                        </option>
                    ) : (
                        <option key={`${option.id}-${index}`} value={option.id}>
                            {option.label}
                        </option>
                    ),
                )}
            </select>
            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
}
