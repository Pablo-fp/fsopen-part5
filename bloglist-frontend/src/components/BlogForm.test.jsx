import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

test('BlogForm calls event handler with the right details when a new blog is created', async () => {
  // Define the mock data, user and function
  const mockFormData = {
    title: 'test title',
    author: 'test author',
    url: 'test url'
  };
  const createBlogFormSubmit = vi.fn();
  const user = userEvent.setup();

  //Render the BlogForm component
  const { container } = render(
    <BlogForm onCreateBlogFormSubmit={createBlogFormSubmit} />
  );

  // Get the input elements
  const titleInput = container.querySelector('#blog-title-input');
  const authorInput = container.querySelector('#blog-author-input');
  const urlInput = container.querySelector('#blog-url-input');

  const submitButton = screen.getByText('create');

  // Fill the input elements with the mock data
  await user.type(titleInput, mockFormData.title);
  await user.type(authorInput, mockFormData.author);
  await user.type(urlInput, mockFormData.url);
  await user.click(submitButton);

  // expect results
  expect(createBlogFormSubmit.mock.calls).toHaveLength(1);
  expect(createBlogFormSubmit.mock.calls[0][0].title).toBe(mockFormData.title);
  expect(createBlogFormSubmit.mock.calls[0][0].author).toBe(
    mockFormData.author
  );
  expect(createBlogFormSubmit.mock.calls[0][0].url).toBe(mockFormData.url);
});
