// pages/index.js
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import api from '../lib/api';
import { getCurrentUser } from '../lib/auth';
import { useEffect, useState } from 'react';

export default function Home(){
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    fetchAll();
  },[]);

  async function fetchAll(){
    setLoading(true);
    try {
      const [postsRes, user] = await Promise.all([
        api.get('/posts/').then(r=>r.data),
        getCurrentUser()
      ]);
      setPosts(postsRes);
      setCurrentUser(user);
    } catch (e){
      console.error('Failed to fetch posts or user', e);
      try {
        const postsRes = await api.get('/posts/');
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Failed to fetch posts', err);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDeleted(id){
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  return (
    <>
      <Navbar />
      <main className="container-md px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-6">Feed</h1>
            {loading ? (
              <div className="text-gray-500">Loading…</div>
            ) : (
              <div className="space-y-6">
                {posts.length === 0 && (
                  <div className="text-gray-500">No posts yet — be the first to create one!</div>
                )}
                {posts.map(p => (
                  <PostCard key={p.id} post={p} onDeleted={handleDeleted} currentUser={currentUser} />
                ))}
              </div>
            )}
          </div>

          <aside className="hidden md:block">
            <div className="mag-card p-4">
              <h3 className="font-semibold mb-2">About Jamia</h3>
              <p className="text-sm text-gray-600">A student-run digital magazine to share writing, art and thoughts. Register and post your work — everyone can view the feed.</p>
            </div>

            <div className="mag-card p-4 mt-4">
              <h4 className="font-semibold mb-2">Tip</h4>
              <p className="text-sm text-gray-600">Use clear titles and a thumbnail image to make your posts stand out on the feed.</p>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
