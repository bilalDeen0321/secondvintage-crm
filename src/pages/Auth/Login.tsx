import config from "@/app/config";
import InputError from "@/components/InputError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { FormEventHandler, useState } from "react";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Head title="Login" />

            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <img
                        src={config.logo}
                        alt={config.name}
                        className="mx-auto mb-6 h-12"
                    />
                    <h1 className="mb-2 text-3xl font-bold text-foreground">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground">
                        Sign in to your account to continue
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="email"
                                id="email"
                                type="email"
                                autoComplete="email"
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

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="pl-10 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-sm">
                            <input
                                type="checkbox"
                                className="rounded border-input"
                            />
                            <span className="text-muted-foreground">
                                Remember me
                            </span>
                        </label>
                        <Link
                            href={route("password.request")}
                            className="text-sm text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={processing}
                    >
                        Sign In
                    </Button>
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
};

export default Login;
