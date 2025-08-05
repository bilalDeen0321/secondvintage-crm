import ApplicationLogo from "@/components/built-in/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <>

            <div className="flex min-h-screen items-center justify-center bg-background p-4">



                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <Link href="/">
                            <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                        </Link>
                    </div>

                    {children}

                    <div className="mt-8 text-center text-xs text-muted-foreground">
                        <p>
                            © {new Date().getFullYear()} Second Vintage. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
