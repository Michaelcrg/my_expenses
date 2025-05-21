import { useEffect, useState } from "react";

import Card from "./Card";
import Logo from "./NavbarComponents/Logo";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      setPassword("");
      setIsLoading(false);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload = { email, password };

      const isProd = import.meta.env.MODE === "production";
      const ENDPOINT = isProd
        ? import.meta.env.VITE_API_LOGIN_URL
        : import.meta.env.VITE_API_LOGIN_PROXY;

      const response = await fetch(ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let data;

      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data?.error || `HTTP error ${response.status}`);
      }

      if (data.status === "success") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            user_id: data.user_id,
          })
        );

        window.location.href = "/dashboard";
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Failed to connect to the server. Check your network."
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-black">
      <Card>
        <div className="flex flex-col gap-4 p-8 w-full max-w-md">
          <Logo className="self-center" />
          <h1 className="text-2xl font-bold text-center text-white">Login</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <input
              type="password"
              placeholder="Password"
              className="p-2 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            {error && (
              <div className="bg-red-800/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`bg-blue-600 text-white p-3 rounded-lg font-medium transition-all ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default Login;
