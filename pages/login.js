// pages/login.js
import { useState } from "react";
import api from "../lib/api";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { useToast } from "../components/ToastProvider";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const router = useRouter();
  const toast = useToast();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/token/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      // Optional: fetch or set username locally for navbar
      localStorage.setItem("username", form.username || "");
      toast.success("Logged in");
      router.push("/");
    } catch (err) {
      toast.error("Login failed: " + (err.response?.data?.detail || err.message));
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={submit} className="space-y-3 bg-white/90 p-6 rounded-lg shadow">
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
            className="w-full p-3 border rounded"
            required
          />
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            type="password"
            className="w-full p-3 border rounded"
            required
          />
          <button className="w-full bg-rose-600 text-white px-4 py-2 rounded font-medium">Login</button>
        </form>
      </main>
    </>
  );
}
