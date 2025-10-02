import { Head, usePage, useForm  } from "@inertiajs/react";
import {
    Bell,
    Globe,
    Lock,
    Palette,
    Settings as SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import Layout from "../components/Layout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs";
import { ColorTheme, useTheme } from "../contexts/ThemeContext";
import axios from 'axios'

const colorThemes = [
    { id: "default" as ColorTheme, name: "Default", color: "#d97706" },
    { id: "blue" as ColorTheme, name: "Blue", color: "#3b82f6" },
    { id: "green" as ColorTheme, name: "Green", color: "#10b981" },
    { id: "purple" as ColorTheme, name: "Purple", color: "#8b5cf6" },
    { id: "red" as ColorTheme, name: "Red", color: "#ef4444" },
    { id: "orange" as ColorTheme, name: "Orange", color: "#f97316" },
    { id: "pink" as ColorTheme, name: "Pink", color: "#ec4899" },
    { id: "indigo" as ColorTheme, name: "Indigo", color: "#6366f1" },
    { id: "teal" as ColorTheme, name: "Teal", color: "#14b8a6" },
    { id: "slate" as ColorTheme, name: "Slate", color: "#475569" },
    { id: "emerald" as ColorTheme, name: "Emerald", color: "#047857" },
    { id: "violet" as ColorTheme, name: "Violet", color: "#7c3aed" },
    { id: "dark-blue" as ColorTheme, name: "Dark Blue", color: "#1e40af" },
    { id: "dark-slate" as ColorTheme, name: "Dark Slate", color: "#475569" },
    { id: "dark-green" as ColorTheme, name: "Dark Green", color: "#059669" },
];
interface Currency {
  id: number
  code: string
  name: string
}
                
const Settings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [autoBackup, setAutoBackup] = useState(true);
    const { colorTheme, setColorTheme } = useTheme();
      
   const { props } = usePage()
   const currencies = (props.currencies as Currency[]) ?? []
   const user = props.user

  const generalForm = useForm({
    name: user.name || "",
    currency: user.currency || "",
    form_type: "general",
  });
const passwordForm = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
    form_type: "password",
  });

  function submitGeneral(e: React.FormEvent) {
    e.preventDefault();
     generalForm.put(`/settings/${user.id}`, {
      preserveScroll: true,
    });
  }

  function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    passwordForm.put(`/settings/${user.id}`, {
      preserveScroll: true,
      onSuccess: () => passwordForm.reset(),
    });
  }
    return (
        <Layout>
            <Head title="SV - Settings" />
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your application preferences and configuration
                    </p>
                </div>

                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="general">General</TabsTrigger>
                         <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                        <TabsTrigger value="notifications" disabled="disabled">
                            Notifications
                        </TabsTrigger>
                       
                        <TabsTrigger value="integrations" disabled="disabled">
                            Integrations
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                         <form onSubmit={submitGeneral}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <SettingsIcon className="mr-2 h-5 w-5" />
                                    General Settings
                                </CardTitle>
                                <CardDescription>
                                    Basic application settings and preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="full-name">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="full-name"
                                            value={generalForm.data.name}
                                            onChange={(e) =>
                                            generalForm.setData("name", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company-email">
                                            Company Email
                                        </Label>
                                        <Input
                                            id="company-email"
                                            type="email"
                                           value={user.email}
                                                disabled
                                            />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">
                                            Timezone
                                        </Label>
                                        <select
                                            id="timezone"
                                            disabled="disabled"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option>UTC+1 (Copenhagen)</option>
                                            <option>UTC+0 (London)</option>
                                            <option>UTC-5 (New York)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">
                                            Default Currency
                                        </Label>
                                         <select
                                            id="currency"
                                            value={generalForm.data.currency}
                                            onChange={(e) =>
                                            generalForm.setData("currency", e.target.value)
                                            }
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="">Select a currency</option>
                                            {currencies.map((c) => (
                                            <option key={c.code} value={c.code}>
                                                {c.code} - {c.name}
                                            </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                               <Button type="submit" disabled={generalForm.processing}>
                                    Save Changes
                                </Button>
                            </CardContent>
                        </Card>
                        </form>
                    </TabsContent>

  <TabsContent value="security" className="space-y-6">
      <form onSubmit={submitPassword}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Lock className="mr-2 h-5 w-5" />
                                    Security Settings
                                </CardTitle>
                                <CardDescription>
                                    Manage account security and access
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="current-password">
                                            Current Password
                                        </Label>
                                        <Input
                                            id="current-password"
                                            type="password" 
                                            onChange={e =>  passwordForm.setData("current_password", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="new-password">
                                            New Password
                                        </Label>
                                        <Input
                                            id="new-password"
                                            type="password" 
                                            onChange={e => passwordForm.setData("password", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="confirm-password">
                                            Confirm New Password
                                        </Label>
                                        <Input
                                            id="confirm-password"
                                            type="password" 
                                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Two-Factor Authentication</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Add an extra layer of security
                                        </p>
                                    </div>
                                    <Badge variant="outline">Not Enabled</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Auto Backup</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Automatically backup data daily
                                        </p>
                                    </div>
                                    <Switch
                                        // checked={autoBackup}
                                        checked={false}
                                        disabled="disabled"
                                        onCheckedChange={setAutoBackup}
                                    />
                                </div>
                                <div className="space-y-2">
                                     <Button type="submit" disabled={passwordForm.processing}>Update Password</Button>
                                    <Button variant="outline" disabled="disabled">
                                        Enable 2FA
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        </form>
                    </TabsContent>
                    <TabsContent value="appearance" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Palette className="mr-2 h-5 w-5" />
                                    Appearance Settings
                                </CardTitle>
                                <CardDescription>
                                    Customize the look and feel of your
                                    application
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-base font-medium">
                                            Color Theme
                                        </Label>
                                        <p className="mb-4 text-sm text-muted-foreground">
                                            Choose a color theme for your
                                            application
                                        </p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {colorThemes.map((theme) => (
                                                <button
                                                    key={theme.id}
                                                    onClick={() =>
                                                        setColorTheme(theme.id)
                                                    }
                                                    className={`flex items-center justify-between rounded-lg border-2 p-3 transition-all ${
                                                        colorTheme === theme.id
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:border-primary/50"
                                                    }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className="h-6 w-6 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    theme.color,
                                                            }}
                                                        />
                                                        <span className="font-medium">
                                                            {theme.name}
                                                        </span>
                                                    </div>
                                                    {colorTheme ===
                                                        theme.id && (
                                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <Button>Save Appearance Settings</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Bell className="mr-2 h-5 w-5" />
                                    Notification Preferences
                                </CardTitle>
                                <CardDescription>
                                    Configure how you receive notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="email-notifications">
                                                Email Notifications
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receive notifications via email
                                            </p>
                                        </div>
                                        <Switch
                                            id="email-notifications"
                                            checked={emailNotifications}
                                            onCheckedChange={
                                                setEmailNotifications
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="push-notifications">
                                                Push Notifications
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receive browser push
                                                notifications
                                            </p>
                                        </div>
                                        <Switch
                                            id="push-notifications"
                                            checked={pushNotifications}
                                            onCheckedChange={
                                                setPushNotifications
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label>Notification Types</Label>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="sales-notifications"
                                                defaultChecked
                                            />
                                            <Label htmlFor="sales-notifications">
                                                New sales and orders
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="inventory-notifications"
                                                defaultChecked
                                            />
                                            <Label htmlFor="inventory-notifications">
                                                Low inventory alerts
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="payment-notifications"
                                                defaultChecked
                                            />
                                            <Label htmlFor="payment-notifications">
                                                Payment confirmations
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                                <Button>Update Notifications</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                  

                    <TabsContent value="integrations" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Globe className="mr-2 h-5 w-5" />
                                    Integrations
                                </CardTitle>
                                <CardDescription>
                                    Connect with external services and platforms
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <h3 className="font-medium">
                                                eBay API
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Sync listings and sales data
                                            </p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">
                                            Connected
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <h3 className="font-medium">
                                                Chrono24 API
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Import watch listings
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Connect
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <h3 className="font-medium">
                                                PayPal
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Payment processing
                                            </p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">
                                            Connected
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <h3 className="font-medium">
                                                Stripe
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Credit card processing
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Connect
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

export default Settings;
