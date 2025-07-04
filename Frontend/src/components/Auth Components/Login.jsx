import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setuserData } from "@/Redux/authSlice";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPw, setShowPw] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();


    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true); setError("");

        try {
            const { data } = await axios.post(
                "http://localhost:3000/api/v1/login",
                form,
                { withCredentials: true }
            );
            dispatch(setuserData(data?.user));
            toast.success("Welcome back!");
            navigate("/home");
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    // ────────────────────────────────────────── ui
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6 rounded-xl bg-card p-6 shadow-md dark:shadow-none"
            >
                <h1 className="text-center text-3xl font-semibold tracking-tight">
                    Zingagram
                </h1>

                {/* Email */}
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className="bg-muted/20 focus:bg-muted/30"
                        autoFocus
                    />
                </div>

                {/* Password with show / hide */}
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPw ? "text" : "password"}
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            className="pr-10 bg-muted/20 focus:bg-muted/30"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw((p) => !p)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                            tabIndex={-1}
                        >
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="rounded bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
                        {error}
                    </p>
                )}

                <Button type="submit" variant='ghost' className="w-full pointer bg-[#020618] border border-gray-400" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                    This is a clone. By continuing, you agree to our&nbsp;
                    <span className="underline">Terms</span> &nbsp;and&nbsp;
                    <span className="underline">Privacy</span>.
                </p>
            </form>

            <div className="flex items-center gap-1 text-sm">
                <span>No account yet?</span>
                <Link to="/signup">
                    <Button variant="link" className="h-auto p-0 text-primary pointer hover:text-blue-700">
                        Sign up
                    </Button>
                </Link>
            </div>
        </div>
    );
}
