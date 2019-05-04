interface IPost {
  name: string;
  slug: string;
}

const posts = async () => {
  // we fetch our list of posts, this allow us to dynamically generate the exported pages
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_page=1"
  );
  const postList = await response.json();
  const arrayOfPosts: IPost[] = [];
  postList.forEach(post => {
    arrayOfPosts.push({ name: `Post ${post.id}`, slug: `post-${post.id}` });
  });
  return arrayOfPosts;
};

export { IPost, posts };
