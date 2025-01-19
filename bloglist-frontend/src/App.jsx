import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';

const App = () => {
  /* States */
  const [blogs, setBlogs] = useState([]);

  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({
    type: null,
    content: null
  });

  /* Refs */
  const createFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLoginSubmit = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      setUser(user);
    } catch (exception) {
      console.log(exception);
      setNotification({
        type: 'error',
        content: exception.response.data.error
      });
      clearNotification();
    }
  };

  const handleCreateFormBlogSubmit = async (newBlogObj) => {
    try {
      const newBlog = await blogService.create(newBlogObj);
      setBlogs(blogs.concat(newBlog));
      setNotification({
        type: 'success',
        content: `a new blog ${newBlog.title} by ${newBlog.author} added`
      });
      clearNotification();
    } catch (exception) {
      console.log(exception);
      setNotification({
        type: 'error',
        content: exception.response.data.error
      });
      clearNotification();
    }
  };

  const clearNotification = () => {
    setTimeout(() => {
      setNotification({ type: null, content: null });
    }, 5000);
  };

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={notification} />

      {user === null ? (
        <LoginForm onLoginFormSubmit={handleLoginSubmit} />
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button
            onClick={() => {
              setUser(null);
              window.localStorage.removeItem('loggedBlogappUser');
            }}
          >
            logout
          </button>
          <Togglable buttonLabel="new blog" ref={createFormRef}>
            <BlogForm onCreateBlogFormSubmit={handleCreateFormBlogSubmit} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
