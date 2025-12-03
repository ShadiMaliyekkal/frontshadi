// pages/create-post.js
import Navbar from "../components/Navbar";
import api from "../lib/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../lib/auth";
import { useToast } from "../components/ToastProvider";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", body: "", image: null });
  const router = useRouter();
  const [user, setUser] = useState(null);
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    // getCurrentUser is expected to return a promise that resolves to user object or null
    getCurrentUser()
      .then((u) => {
        if (mounted) setUser(u);
      })
      .catch((err) => {
        // silently ignore; user will be null
        if (mounted) setUser(null);
      });
    return () => (mounted = false);
  }, []);

  async function submit(e) {
    e.preventDefault();

    if (!user) {
      toast.info("Please login to create a post.");
      router.push("/login");
      return;
    }

    if (!form.title?.trim()) {
      toast.error("Please provide a title for the post.");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("body", form.body);
    if (form.image) data.append("image", form.image);

    try {
      // don't set Content-Type manually when sending FormData; let the browser set boundary
      await api.post("/posts/", data);
      toast.success("Posted — returning to feed.");
      // small delay to let user read toast (optional)
      setTimeout(() => {
        router.push("/");
      }, 600);
    } catch (err) {
      console.error("Post failed", err);
      const message =
        err?.response?.data && typeof err.response.data === "object"
          ? JSON.stringify(err.response.data)
          : err?.message || "Unknown error";
      toast.error("Failed to post: " + message);
    }
  }

  return (
    <>
      <Navbar />
      <main className="container-md px-4 py-8">
        <div className="mag-card p-6 max-w-3xl mx-auto bg-white/90 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Create Post</h1>

          <form onSubmit={submit} className="space-y-4">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="w-full p-3 border rounded"
              required
            />

            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Write something..."
              className="w-full p-3 border rounded"
              rows={6}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.files && e.target.files[0] ? e.target.files[0] : null,
                  })
                }
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Post
              </button>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-4 py-2 rounded border hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
            </div>

            {!user && (
              <div className="text-sm text-neutral-600 mt-2">
                You must be logged in to post. <a className="text-rose-600" href="/login">Login</a>
              </div>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
