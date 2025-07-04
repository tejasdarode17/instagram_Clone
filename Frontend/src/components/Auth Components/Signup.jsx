import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        fullname: "",
        username: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axios.post(
                "http://localhost:3000/api/v1/signup",
                form,
                { withCredentials: true }
            );

            toast.success("Welcome to Zingagram!");
            setForm({ email: "", password: "", fullname: "", username: "" });
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
            toast.error(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6 rounded-lg p-6 shadow-md dark:shadow-none"
            >
                <h1 className="text-center text-3xl font-semibold">Zingagram</h1>

                {/* Email */}
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="bg-muted dark:bg-muted/40"   /* ← keeps muted bg */
                        value={form.email}
                        onChange={handleChange}
                        autoFocus
                    />
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>

                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPwd ? "text" : "password"}
                            placeholder="••••••••"
                            className="pr-10 bg-muted dark:bg-muted/40"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                    <Label htmlFor="fullname">Full name</Label>
                    <Input
                        id="fullname"
                        name="fullname"
                        type="text"
                        placeholder="Full name"
                        className="bg-muted dark:bg-muted/40"
                        value={form.fullname}
                        onChange={handleChange}
                    />
                </div>

                {/* Username */}
                <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        className="bg-muted dark:bg-muted/40"
                        value={form.username}
                        onChange={handleChange}
                    />
                </div>

                {/* Error */}
                {error && (
                    <p className="rounded bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
                        {error}
                    </p>
                )}

                {/* Submit */}
                <Button type="submit" variant='ghost' className="w-full pointer border border-gray-400 bg-[#020618]" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing up…
                        </>
                    ) : (
                        "Sign up"
                    )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                    This is a clone. By continuing, you agree to our{" "}
                    <span className="underline">Terms</span> &
                    <span className="underline"> Privacy</span>.
                </p>
            </form>

            <div className="flex items-center gap-2 text-sm">
                <span>Have an account?</span>
                <Link to="/">
                    <Button variant="link" className="px-0 text-primary pointer">
                        Log in
                    </Button>
                </Link>
            </div>
        </div>
    );
}
