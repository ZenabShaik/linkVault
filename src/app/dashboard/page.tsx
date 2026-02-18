"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  /* ================= USER ================= */
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/");
      else setUser(data.user);
    };
    getUser();
  }, [router]);

  /* ================= FETCH ================= */
  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  };

  useEffect(() => {
    if (user) fetchBookmarks();
  }, [user]);

  /* ================= REALTIME ================= */
useEffect(() => {
  const channel = supabase
    .channel("bookmarks")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookmarks" },
      (payload) => {
        fetchBookmarks();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);


  /* ================= ADD ================= */
 const addBookmark = async () => {
  if (!url || !title) return;

  const tempId = Date.now().toString();

  const newBookmark = {
    id: tempId,
    url,
    title,
    user_id: user.id,
    created_at: new Date().toISOString(),
  };

  // 🔥 INSTANT UI UPDATE
  setBookmarks((prev) => [newBookmark, ...prev]);

  setUrl("");
  setTitle("");

  // 🔥 BACKGROUND DB INSERT
  const { error } = await supabase.from("bookmarks").insert([
    {
      url,
      title,
      user_id: user.id,
    },
  ]);

  // If DB fails → rollback UI
  if (error) {
    setBookmarks((prev) => prev.filter((b) => b.id !== tempId));
  }
};

  /* ================= DELETE ================= */
  const deleteBookmark = async (id: string) => {
  // 🔥 INSTANT REMOVE FROM UI
  setBookmarks((prev) => prev.filter((b) => b.id !== id));

  // 🔥 BACKGROUND DELETE
  await supabase.from("bookmarks").delete().eq("id", id);
};

  /* ================= COPY ================= */
  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return <p className="text-center mt-20 text-white">Loading...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black p-10 text-white">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
            LinkVault ✨
          </h1>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </motion.div>

        {/* ================= ADD FORM ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl space-y-5"
        >
          <h2 className="text-2xl font-semibold">Add New Bookmark</h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bookmark Title"
            className="w-full p-4 rounded-lg bg-black/40 border border-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-4 rounded-lg bg-black/40 border border-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />

          <button
            onClick={addBookmark}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition"
          >
            Add Bookmark
          </button>
        </motion.div>

        {/* ================= GRID ================= */}
        <div className="grid md:grid-cols-2 gap-6">

          <AnimatePresence>
            {bookmarks.map((bm) => {
              let hostname = bm.url;
              try {
                hostname = new URL(bm.url).hostname;
              } catch {}

              return (
                <motion.div
                  key={bm.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg flex justify-between items-center"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4 min-w-0">

                    <img
                      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                      className="w-10 h-10 rounded-lg bg-white/10 p-1 shrink-0"
                    />

                    <div className="min-w-0">
                      <p className="font-semibold text-lg truncate">
                        {bm.title}
                      </p>

                      <a
                        href={bm.url}
                        target="_blank"
                        className="text-blue-400 text-sm truncate block hover:underline"
                      >
                        {hostname}
                      </a>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 shrink-0">

                    <button
                      onClick={() => copyLink(bm.url)}
                      className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm transition"
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => deleteBookmark(bm.id)}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

        </div>

        {/* ================= EMPTY ================= */}
        {bookmarks.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 mt-10 text-lg"
          >
            Your vault is empty. Start saving links 🚀
          </motion.p>
        )}

      </div>
    </main>
  );
}
