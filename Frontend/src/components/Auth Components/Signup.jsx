import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Signup() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        fullname: "",
        username: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await axios.post("http://localhost:3000/api/v1/signup", form,
                { withCredentials: true }
            );

            setForm({
                email: "",
                password: "",
                fullname: "",
                username: ""
            })

            toast.success("everything is working fine")

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
            <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-md flex-col items-center gap-4"
            >
                <p className="text-3xl font-semibold">Zingagram</p>

                <Input
                    autoFocus
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />
                <Input
                    name="fullname"
                    type="text"
                    placeholder="Full Name"
                    value={form.fullname}
                    onChange={handleChange}
                />
                <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                />

                {error && (
                    <p className="w-full rounded bg-red-50 p-2 text-center text-sm text-red-600">
                        {error}
                    </p>
                )}

                <Button type="submit" className="w-full pointer" disabled={loading}>
                    {loading ? "Signing up…" : "Sign Up"}
                </Button>
            </form>

            <div className="max-w-xs text-center text-xs text-gray-500">
                <p>This is just a clone.</p>
                <p>
                    By signing up, you agree to our Terms, Privacy Policy and Cookies
                    Policy.
                </p>
            </div>

            <div className="mt-6 flex items-center">
                <span className="text-sm">Have an account?</span>
                <Link to={"/"}>
                    <Button variant="link " className="pointer">Log in</Button>
                </Link>
            </div>
        </div>
    );
}

