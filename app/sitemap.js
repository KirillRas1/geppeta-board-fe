const BASE_URL = 'https://www.geppetaboard.com';

function generateSiteMap(posts) {
  return posts.map(({ id }) => ({ url: `${BASE_URL}/posts/${id}` }));
}
export default async function sitemap() {
  const request = await fetch(`https://kirillras.net/posts/`);
  const posts = await request.json();
  const sitemap = [{ url: BASE_URL }, ...generateSiteMap(posts)];
  return sitemap;
}
