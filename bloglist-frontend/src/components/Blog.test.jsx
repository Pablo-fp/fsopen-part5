import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const blog = {
  title: 'Estribaciones de arquitectura',
  author: 'Pablo Fernández',
  url: 'https://www.tumblr,com/estribaciones-de-arquitectura',
  likes: 300000,
  user: {
    username: 'LorenaBoja',
    name: 'Lorena Bojalil',
    id: '62c9d713cfb0e98bb430d4be'
  },
  id: '62cb14c80e44c4d5484537b4'
};

const user = {
  username: 'LorenaBoja',
  name: 'Lorena Bojalil',
  id: '62c9d713cfb0e98bb430d4be'
};

test('renders title and author', () => {
  const { container } = render(<Blog blog={blog} user={user} />);

  const element = container.querySelector('.blog-container');
  expect(element).toBeDefined();
});

test('button controlling the shown details has been clicked', async () => {
  const { container } = render(<Blog blog={blog} user={user} />);

  const fakeUser = userEvent.setup();
  const button = screen.getByText('view');
  await fakeUser.click(button);

  const div = container.querySelector('.blog-details');
  expect(div).toBeDefined();
});
