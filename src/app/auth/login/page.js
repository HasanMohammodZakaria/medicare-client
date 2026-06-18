
"use client";

import { authClient } from "@/app/lib/auth-client";
import { Card, Separator } from "@heroui/react";
import {
    Button,
    Description,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const user = Object.fromEntries(formData.entries());

        const { data, error } = await authClient.signIn.email({
            email: user.email,
            password: user.password,
        });

        if (data) {
            toast.success("Login Successfully!");
            router.push("/");
        }

        if (error) {
            toast.error(error?.message || "Something went Wrong");
            return;
        }
    };

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
        });
    };

    return (
        <div className="flex items-center justify-center px-4 py-10 bg-base">
            <Card className="w-full max-w-sm sm:max-w-md p-5 rounded-2xl shadow-md bg-surface border border-base">
                <h2 className="text-2xl font-bold text-center mb-5 text-main">
                    Login
                </h2>

                <p className="text-center text-sub mb-4">
                    Start your adventure with{" "}
                    <span className="text-primary font-semibold">
                        MediNexa
                    </span>
                </p>

                <Form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <TextField isRequired name="email" type="email">
                        <Label>Email</Label>

                        <Input placeholder="john@example.com" />

                        <FieldError />
                    </TextField>

                    <TextField
                        isRequired
                        minLength={6}
                        name="password"
                        type={isPasswordShow ? "text" : "password"}
                        validate={(value) => {
                            if (value.length < 6) {
                                return "Password must be at least 6 characters";
                            }

                            if (!/[A-Z]/.test(value)) {
                                return "Password must contain at least one uppercase letter";
                            }

                            if (!/[a-z]/.test(value)) {
                                return "Password must contain at least one lowercase letter";
                            }

                            return undefined;
                        }}
                    >
                        <Label>Password</Label>

                        <div className="relative">
                            <Input
                                placeholder="Enter your password"
                                className="w-full"
                            />

                            <span
                                className="cursor-pointer absolute right-3 top-3 text-sub"
                                onClick={() =>
                                    setIsPasswordShow(!isPasswordShow)
                                }
                            >
                                {isPasswordShow ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>

                        <Description>
                            Must be at least 6 characters with one number and one special character
                        </Description>

                        <FieldError />
                    </TextField>

                    <div className="flex flex-col gap-3 mt-2 w-full">
                        <Button
                            type="submit"
                            className="w-full rounded-xl bg-primary text-white"
                        >
                            Login
                        </Button>
                    </div>

                    <p className="text-center text-sub">
                        Do not have an account?
                        <Link href="/auth/registration">
                            <span className="text-primary font-bold">
                                {" "}
                                Register
                            </span>
                        </Link>
                    </p>
                </Form>

                <div className="flex justify-center items-center gap-3 my-4">
                    <div className="flex-1">
                        <Separator />
                    </div>

                    <div className="whitespace-nowrap">
                        <p className="text-sub">
                            Or sign in with
                        </p>
                    </div>

                    <div className="flex-1">
                        <Separator />
                    </div>
                </div>

                <Button
                    className="w-full cursor-pointer rounded-xl bg-surface border border-base text-main"
                    onClick={handleGoogleLogin}
                >
                    <FcGoogle />
                    Sign in with Google
                </Button>
            </Card>
        </div>
    );
};

export default LoginPage;
