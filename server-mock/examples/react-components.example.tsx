// Example React component using the mock API hooks
// This demonstrates how to use the hooks in your components
// @ts-nocheck

import React from 'react';
import { usePosts, usePost, useCreatePost, useDeletePost } from '../api/mock-hooks';
import type { PostStatusDTO, PostTypeDTO } from '../../../shared/types';

// ========== Posts List Component ==========
export function PostsList() {
  const { data: posts, isLoading, error } = usePosts();
  const deletePost = useDeletePost();

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts: {error.message}</div>;

  return (
    <div>
      <h2>Posts</h2>
      {posts?.map((post) => (
        <div key={post.id}>
          <h3>{post.text?.content}</h3>
          <p>Status: {post.status}</p>
          <p>Type: {post.type}</p>
          <p>Tags: {post.tags?.map((t) => t.tag).join(', ')}</p>
          <button onClick={() => deletePost.mutate(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// ========== Single Post Component ==========
export function PostDetail({ postId }: { postId: string }) {
  const { data: post, isLoading, error } = usePost(postId);

  if (isLoading) return <div>Loading post...</div>;
  if (error) return <div>Error loading post: {error.message}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <h1>{post.text?.content}</h1>
      <p>Status: {post.status}</p>
      <p>Type: {post.type}</p>
      <p>Published: {new Date(post.publication_date).toLocaleDateString()}</p>

      {post.tags.length > 0 && (
        <div>
          <h3>Tags</h3>
          {post.tags.map((tag) => (
            <span key={tag.id}>{tag.tag} </span>
          ))}
        </div>
      )}

      {post.photos.length > 0 && (
        <div>
          <h3>Photos</h3>
          {post.photos.map((photo) => (
            <img key={photo.id} src={photo.link} alt="Post" />
          ))}
        </div>
      )}

      {post.videos.length > 0 && (
        <div>
          <h3>Videos</h3>
          {post.videos.map((video) => (
            <a key={video.id} href={video.link} target="_blank" rel="noopener noreferrer">
              Watch video
            </a>
          ))}
        </div>
      )}

      {post.survey && (
        <div>
          <h3>Survey ({post.survey.type})</h3>
          {post.survey.answers.map((answer) => (
            <div key={answer.id}>{answer.text}</div>
          ))}
        </div>
      )}

      {post.authors.length > 0 && (
        <div>
          <h3>Authors</h3>
          {post.authors.map((author) => (
            <div key={author.id}>
              {author.profile?.first_name} {author.profile?.second_name} ({author.type})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== Create Post Form ==========
export function CreatePostForm() {
  const createPost = useCreatePost();
  const [formData, setFormData] = React.useState({
    text: '',
    tags: '',
    status: 'DRAFT' as PostStatusDTO,
    type: 'POST' as PostTypeDTO,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPost.mutateAsync({
        status: formData.status,
        type: formData.type,
        text: formData.text,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });

      // Reset form
      setFormData({ text: '', tags: '', status: 'DRAFT', type: 'POST' });
      alert('Post created successfully!');
    } catch (error) {
      alert('Failed to create post');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Post</h2>

      <div>
        <label>Type:</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as PostTypeDTO })}
        >
          <option value="POST">Post</option>
          <option value="ARTICLE">Article</option>
        </select>
      </div>

      <div>
        <label>Status:</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as PostStatusDTO })}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="SCHEDULED">Scheduled</option>
        </select>
      </div>

      <div>
        <label>Content:</label>
        <textarea
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Tags (comma-separated):</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <button type="submit" disabled={createPost.isPending}>
        {createPost.isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}

// ========== Login Component ==========
import { useLogin } from '../api/mock-hooks';

export function LoginForm() {
  const login = useLogin();
  const [credentials, setCredentials] = React.useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login.mutateAsync(credentials);
      console.log('Logged in:', result.user);
      // Redirect or update UI
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div>
        <label>Username:</label>
        <input
          type="text"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
      </div>

      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>

      {login.error && <p>Error: {login.error.message}</p>}
    </form>
  );
}
