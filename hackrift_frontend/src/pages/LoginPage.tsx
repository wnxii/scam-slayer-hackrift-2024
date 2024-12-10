import React from "react";
import LoginQRCode from "../components/LoginQRCode";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  interface LoginFormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface LoginForm extends HTMLFormElement {
    elements: LoginFormElements;
  }

  const navigate = useNavigate();

  const handleLogIn = (e: React.FormEvent<LoginForm>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (
      form.elements.email.value === "admin@example.com" &&
      form.elements.password.value === "admin"
    ) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: form.elements.email.value,
          name: "Admin",
        })
      );
      navigate("/home");
    }
  };

  return (
    <Card className="rounded-3xl w-1/4">
      <div className="flex flex-col items-center space-y-8 p-10">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Sign In
        </h2>

        <Tabs defaultValue="qr" className="w-full">
          <TabsList className="flex justify-center space-x-4 text-white bg-white">
            <TabsTrigger value="qr" className="bg-black">
              Singpass
            </TabsTrigger>
            <TabsTrigger value="account" className="bg-black">
              Log In
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr" className="mt-8">
            <div className="flex flex-col items-center">
              <LoginQRCode value="https://example.com/login" size={256} />
            </div>
          </TabsContent>

          <TabsContent value="account" className="mt-8">
            <form onSubmit={handleLogIn} method="POST" className="space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot Password?
                </a>
                <a
                  href="/signup"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Sign Up
                </a>
              </div>

              <div>
                <Button type="submit" className="w-full text-white">
                  Sign in
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default LoginPage;
