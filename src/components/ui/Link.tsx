
import { cn } from "@/lib/utils";
import { Link as InertiaLink, InertiaLinkProps } from "@inertiajs/react";
import { ButtonProps, buttonVariants } from "./button";


interface LinkProps extends Omit<InertiaLinkProps, "size"> {
    size?: ButtonProps["size"];
    variant?: ButtonProps['variant']
}

export default function Link({ variant, size, className, ...props }: LinkProps) {
    return <InertiaLink {...props} className={cn(buttonVariants({ variant, size, className }))} />
}
