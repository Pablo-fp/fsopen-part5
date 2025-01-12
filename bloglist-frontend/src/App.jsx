import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
    console.log('logging in with', username, password);
  };

  const handleCreateBlogSubmit = async (newBlogObj) => {
    try {
      const newBlog = await blogService.create(newBlogObj);
      setBlogs(blogs.concat(newBlog));
    } catch (exception) {
      console.log('Error creating blog:', exception);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

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

      <div style={{ color: 'red' }}>{errorMessage}</div>

      {user === null ? (
        loginForm()
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
          {blogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
