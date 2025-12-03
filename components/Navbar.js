import Link from 'next/link';
import { isLoggedIn, logout, getCachedUser, getCurrentUser } from '../lib/auth';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Navbar(){
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState(null);

  async function refreshUser() {
    const loggedNow = isLoggedIn();
    setLogged(loggedNow);

    const cached = getCachedUser();
    if (cached) {
      setUser(cached);
      return;
    }

    if (loggedNow) {
      const u = await getCurrentUser();
      setUser(u);
    }
  }

  useEffect(()=> {
    refreshUser();
    router.events.on('routeChangeComplete', refreshUser);
    return () => router.events.off('routeChangeComplete', refreshUser);
  }, []);

  function handleLogout(){
    logout();
    setLogged(false);
    setUser(null);
    router.push('/');
  }

  return (
    <header className="bg-gradient-to-r from-[#ff6b6b] to-[#ffa552] shadow-md border-b border-white/30 sticky top-0 z-50">
      {/* DOUBLE HEIGHT: py-6 gives a tall, bold header */}
      <div className="container-md mx-auto px-6 py-6 flex items-center justify-between">

        {/* Left Section */}
        <Link 
          href="/" 
          className="text-white font-extrabold text-3xl tracking-wide"
        >
          Jamia Magazine
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {logged ? (
            <>
              <span className="text-white text-lg font-semibold">
                Hi, <span className="font-bold">{user?.username || 'User'}</span>
              </span>

              <Link
                href="/create-post"
                className="bg-white text-[#ff6b6b] px-5 py-2 rounded-full text-lg font-bold shadow-md hover:scale-105 transition"
              >
                Create Post
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white border border-white/70 rounded-full text-lg hover:bg-white/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-white text-lg px-4 py-2 rounded hover:bg-white/20"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-white text-[#ff6b6b] px-5 py-2 rounded-full text-lg font-bold shadow-md hover:scale-105 transition"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </header>
  );
}
