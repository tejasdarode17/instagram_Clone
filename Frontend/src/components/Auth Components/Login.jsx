import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { setuserData } from "@/Redux/authSlice";
import { useDispatch } from "react-redux";


const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate()
    const dispatch = useDispatch()


    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/login",
                form,
                { withCredentials: true }
            );

            const data = response.data

            setForm({
                email: "",
                password: ""
            })
            console.log(data);
            dispatch(setuserData(data?.user || null))
            toast.success("Everything working fine")
            navigate("/home")
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
                    placeholder="Email or username"
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
                {error && (
                    <p className="w-full rounded bg-red-50 p-2 text-center text-sm text-red-600">
                        {error}
                    </p>
                )}

                <div className="w-full">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Login"}
                    </Button>
                </div>
            </form>

            <div className="max-w-xs text-center text-xs text-gray-500">
                <p>This is just a clone.</p>
                <p>
                    By signing up, you agree to our Terms, Privacy Policy and Cookies
                    Policy.
                </p>
            </div>

            <div className="mt-6 flex items-center">
                <span className="text-sm">Don't Have account?</span>
                <Link to={"/signup"}>
                    <Button variant="link " className="pointer">Sign UP</Button>
                </Link>
            </div>
        </div>
    );
}


export default Login