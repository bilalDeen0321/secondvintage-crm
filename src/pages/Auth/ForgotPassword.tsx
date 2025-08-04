import config from "@/app/config";
import InputError from "@/components/InputError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, Link, useForm } from "@inertiajs/react";
import { User } from "lucide-react";
import { FormEventHandler } from "react";

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Head title="Forgot Password" />

            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <img
                        src={config.logo}
                        alt={config.name}
                        className="mx-auto mb-6 h-12"
                    />
                    <h1 className="mb-2 text-3xl font-bold text-foreground">
                        Forgot Password
                    </h1>
                    <p className="text-muted-foreground">
                        Forgot your password? No problem. Just let us know your
                        email address and we will email you a password reset
                        link that will allow you to choose a new one.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="pl-10"
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={processing}
                    >
                        Email Password Reset Link
                    </Button>

                    <div className="flex items-center justify-between">
                        Remember Your password
                        <Link
                            prefetch
                            href={route("login")}
                            className="text-sm text-primary hover:underline"
                        >
                            Login?
                        </Link>
                    </div>
                </form>

                <div className="mt-8 text-center text-xs text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} Second Vintage. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
