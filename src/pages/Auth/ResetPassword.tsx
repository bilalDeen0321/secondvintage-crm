import InputError from "@/components/built-in/InputError";
import InputLabel from "@/components/built-in/InputLabel";
import ShowPasswordButton from "@/components/custom/ShowPasswordButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GuestLayout from "@/layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-8 text-center">
                <h3 className="mb-2 text-3xl font-bold text-foreground">
                    Reset password
                </h3>
                <p className="text-muted-foreground">
                    Reset your password
                </p>
            </div>

            <form onSubmit={submit}>
                {/* <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div> */}

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            autoComplete="new-password"
                            onChange={(e) => setData("password", e.target.value)}
                        />
                        <ShowPasswordButton show={showPassword} setShow={setShowPassword} />
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <Input
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-between">
                    Remember password
                    <Link prefetch href={route("login")} className="text-sm text-primary hover:underline">
                        Login?
                    </Link>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Button type="submit" className="w-full" disabled={processing} >
                        Reset Password
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
