import { countries, currencies, currencies_with_lebel } from "@/app/data";
import InputError from "@/components/InputError";
import RawSelect from "@/components/mixed/RawSelect";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";

export default function AddNewUser({ show, setShow }) {
    const pageProps = usePage().props;
    const roles = Array.isArray(pageProps.roles) ? pageProps.roles : [];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        role: "",
        country: "Denmark",
        currency: "USD",
        password: "",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddUser = (e: any) => {
        e.preventDefault();
        post(route("users.store"), {
            onFinish: () => reset("password"),
            onSuccess: () => {
                reset(
                    "name",
                    "email",
                    "password",
                    "country",
                    "role",
                    "currency",
                );
                setShow(false);
            },
        });
    };

    return (
        <>
            <Dialog open={show} onOpenChange={setShow}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Create a new user account for the system.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <h3 className="border-b pb-2 text-lg font-semibold">
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Enter full name"
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="Enter email address"
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Enter password"
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <RawSelect
                                    data={countries}
                                    name="country"
                                    label="Country"
                                    value={data.country}
                                    error={errors.country}
                                    onChange={(e) =>
                                        setData("country", e.target.value)
                                    }
                                />

                                <RawSelect
                                    data={currencies_with_lebel}
                                    name="currency"
                                    label="Currency"
                                    value={data.currency}
                                    error={errors.currency}
                                    onChange={(e) => setData("currency", e.target.value)}
                                >
                                    {currencies_with_lebel.map((currency, index) => (
                                        <option key={index} value={currency.id}>
                                            {currency.id} - {currency.name}
                                        </option>
                                    ))}
                                </RawSelect>

                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <select
                                        name="currency"
                                        id="currency"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={data.currency}
                                        onChange={(e) =>
                                            setData("currency", e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Select currency...
                                        </option>
                                        {currencies.map((currency) => (
                                            <option
                                                key={currency}
                                                value={currency}
                                            >
                                                {currency}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.currency}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Role & Access Section */}
                        <div className="space-y-4">
                            <h3 className="border-b pb-2 text-lg font-semibold">
                                Role & Access Level
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="role">User Role</Label>
                                <select
                                    name="role"
                                    id="role"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                >
                                    <option value="">Select option</option>
                                    {roles.map((role, index) => (
                                        <option key={index} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.role}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={processing}
                            onClick={handleAddUser}
                        >
                            {processing ? "Loading.." : "Create User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
