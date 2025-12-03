// pages/register.js
import { useState } from "react";
import api from "../lib/api";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { useToast } from "../components/ToastProvider";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const router = useRouter();
  const toast = useToast();

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post("/auth/register/", form);
      toast.success("Registered. Please login.");
      router.push("/login");
    } catch (err) {
      const msg = err.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      toast.error("Registration failed: " + msg);
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={submit} className="space-y-3 bg-white/90 p-6 rounded-lg shadow">
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
            className="w-full p-3 border rounded"
            required
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="w-full p-3 border rounded"
            type="email"
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
          <div className="flex gap-3">
            <button type="submit" className="bg-rose-600 text-white px-4 py-2 rounded font-medium flex-1">
              Register
            </button>
            <button type="button" onClick={() => router.push("/")} className="px-4 py-2 border rounded">
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
