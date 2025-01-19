import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
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

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

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

  const handleCreateBlogSubmit = async (newBlogObj) => {
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

  const blogForm = () => {
    const handleCreateBlogFormSubmit = (event) => {
      event.preventDefault();
      handleCreateBlogSubmit({ title, author, url });
      setAuthor('');
      setUrl('');
    };

    return (
      <form onSubmit={handleCreateBlogFormSubmit}>
        <h2>create new</h2>
        <div>
          title:
          <input
            type="text"
            name="title"
            id="blog-title-input"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="author"
            id="blog-author-input"
            onChange={(event) => setAuthor(event.target.value)}
            value={author}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="url"
            id="blog-url-input"
            onChange={(event) => setUrl(event.target.value)}
            value={url}
          />
        </div>
        <div>
          <button id="blog-submit-button" type="submit">
            create
          </button>
        </div>
      </form>
    );
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
            {blogForm()}
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
