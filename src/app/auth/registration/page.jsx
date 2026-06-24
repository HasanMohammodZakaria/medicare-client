"use client";

import { authClient } from "@/app/lib/auth-client";
import ImageUploader from "@/components/shared/ImageUploader";
import { Card, Radio, RadioGroup, Separator } from "@heroui/react";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

const RegistrationPage = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.name,
      image: imageUrl,
      role: user.role,
    });
    // console.log(data);

    if (data) {
      toast.success("Account Created Successfully!");
      await authClient.signOut();
      router.push("/auth/login");
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
    <div
      className="flex items-center justify-center px-4 py-10"
      style={{
        backgroundColor: "var(--background)",
      }}
    >
      <Card
        className="w-full max-w-sm sm:max-w-md p-5 rounded-2xl shadow-md"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
      >
        <h2
          className="text-2xl font-bold text-center mb-5"
          style={{ color: "var(--text-primary)" }}
        >
          Create Account
        </h2>

        <p className="text-center" style={{ color: "var(--text-secondary)" }}>
          Start your adventure with{" "}
          <span style={{ color: "var(--primary)" }}>MediNexa</span>
        </p>

        <Form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField isRequired name="name" type="text">
            <Label>Name</Label>

            <Input placeholder="Enter your name" />

            <FieldError />
          </TextField>

          <TextField type="url">
            <Label>Profile Photo</Label>
            <ImageUploader
              onUpload={(url) => setImageUrl(url)}
              shape="circle"
              label=""
              size="md"
            />
          </TextField>

          <TextField isRequired name="email" type="email">
            <Label>Email</Label>

            <Input placeholder="john@example.com" />

            <FieldError />
          </TextField>

          <RadioGroup
            name="role"
            defaultValue="patient"
            isRequired
            className="w-full"
          >
            <Label>Account Type</Label>

            <div className=" mt-2">
              <Radio value="patient">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  Patient
                </Radio.Content>
              </Radio>

              <Radio value="doctor">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  Doctor
                </Radio.Content>
              </Radio>
            </div>
          </RadioGroup>

          <TextField
            isRequired
            minLength={6}
            name="password"
            type={isPasswordShow ? "text" : "password"}
            validate={(value) => {
              if (value.length < 6) {
                return "Password must be at least 6 characters";
              }

              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }

              if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                return "Password must contain at least one special character";
              }

              return undefined;
            }}
          >
            <Label>Password</Label>

            <div className="relative">
              <Input placeholder="Enter your password" className="w-full" />

              <span
                className="cursor-pointer absolute right-3 top-3"
                style={{
                  color: "var(--text-secondary)",
                }}
                onClick={() => setIsPasswordShow(!isPasswordShow)}
              >
                {isPasswordShow ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <Description>
              Must be at least 6 characters with one number and one special
              character
            </Description>

            <FieldError />
          </TextField>

          <div className="flex flex-col gap-3 mt-2">
            <Button
              type="submit"
              className="w-full rounded-xl"
              style={{
                backgroundColor: "var(--primary)",
                color: "#ffffff",
              }}
            >
              Create Account
            </Button>
          </div>
        </Form>

        <div className="flex justify-center items-center gap-3 mt-4">
          <div className="flex-1">
            <Separator />
          </div>

          <div className="whitespace-nowrap">
            <p style={{ color: "var(--text-secondary)" }}>Or sign in with</p>
          </div>

          <div className="flex-1">
            <Separator />
          </div>
        </div>

        <div className="mt-4">
          <Button
            className="w-full cursor-pointer rounded-xl"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
            onClick={handleGoogleLogin}
          >
            <FcGoogle /> Sign in with Google
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RegistrationPage;
