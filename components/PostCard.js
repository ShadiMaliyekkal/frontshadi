// components/PostCard.js
import api from '../lib/api';
import { useEffect, useState } from 'react';

export default function PostCard({ post, onDeleted, currentUser }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOwner = currentUser && post.author && (currentUser.id === post.author.id);

  async function toggleLike() {
    try {
      const res = await api.post(`/posts/${post.id}/like/`);
      if (res.data.status === 'liked') {
        setLiked(true);
        setLikesCount(c => c + 1);
      } else {
        setLiked(false);
        setLikesCount(c => Math.max(0, c - 1));
      }
    } catch (e) {
      alert('Login to like');
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${post.id}/`);
      if (onDeleted) onDeleted(post.id);
    } catch (e) {
      alert('Cannot delete. Are you the owner?');
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    if (!currentUser) {
      alert('Login first');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${post.id}/comment/`, { body: commentBody });
      setComments([res.data, ...comments]);
      setCommentBody('');
    } catch (err) {
      alert('Error posting comment');
    }
    setSubmitting(false);
  }

  return (
    <article className="mag-card p-6 max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-gray-600">
            By <span className="font-semibold text-gray-900">{post.author?.username}</span>
          </div>
          <div className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleString()}
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-sm px-3 py-1 rounded border bg-red-100 text-red-600 hover:bg-red-200"
          >
            Delete
          </button>
        )}
      </header>

      <h2 className="post-title text-2xl font-bold mb-2">{post.title}</h2>

      <p className="text-gray-700 mb-4">{post.body}</p>

      {post.image && (
        <img
          src={post.image}
          alt=""
          className="rounded-lg shadow max-h-80 w-full object-cover mb-4"
        />
      )}

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={toggleLike}
          className={`px-3 py-1 rounded font-medium ${
            liked ? 'bg-[#ff6b6b] text-white' : 'border'
          }`}
        >
          {liked ? '♥ Liked' : '♡ Like'} ({likesCount})
        </button>

        <span className="text-sm text-gray-600">
          {comments.length} comments
        </span>
      </div>

      <section>
        {currentUser ? (
          <form onSubmit={submitComment} className="mb-4">
            <textarea
              value={commentBody}
              onChange={e => setCommentBody(e.target.value)}
              className="w-full p-3 border rounded bg-gray-50"
              placeholder="Write a comment..."
              rows={3}
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 px-4 py-2 bg-[#ff6b6b] text-white rounded"
            >
              {submitting ? 'Posting…' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-500 mb-4">
            Login to comment.
          </p>
        )}

        <div className="space-y-3">
          {comments.map(c => (
            <div key={c.id} className="p-3 border rounded bg-gray-50">
              <div className="text-sm font-semibold">{c.author.username}</div>
              <div className="text-xs text-gray-400 mb-1">
                {new Date(c.created_at).toLocaleString()}
              </div>
              <p className="text-gray-700">{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
