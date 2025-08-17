import { cn, formatRichText } from "@/lib/utils";
import React, { useRef } from "react";

interface EditableProps {
    name?: string;
    value: string;
    onChange: (val: string) => void;
    className?: string;
}

const RichTextarea: React.FC<EditableProps> = ({ name, value, onChange, className }) => {
    const divRef = useRef<HTMLDivElement>(null);

    return (
        <div
            title={name}
            ref={divRef}
            className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            contentEditable
            dangerouslySetInnerHTML={{ __html: formatRichText(value) }} // render HTML
            onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)} // update with HTML
        />
    );
};

export default RichTextarea;
