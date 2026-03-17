document.addEventListener("DOMContentLoaded", async () => {
  // ===============================
  // AUTO RELATED POSTS BELOW BLOG
  // ===============================
  const currentId = document.body.dataset.postId;
  const relatedContainer = document.querySelector(".related-posts .blog-grid");

  if (!currentId || !relatedContainer) return;

  let blogs = [];

  try {
    const res = await fetch("../blogs.json");
    blogs = await res.json();
  } catch (e) {
    console.error("Error loading blogs:", e);
    return;
  }

  const currentPost = blogs.find(b => b.id === currentId);

  if (!currentPost) return;

  // 🔥 MATCH RELATED BY TAGS
  const related = blogs
    .filter(b => b.id !== currentId)
    .map(blog => {
      const commonTags = blog.tags?.filter(tag =>
        currentPost.tags.includes(tag)
      ).length || 0;

      return { ...blog, score: commonTags };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // 🔥 RENDER
  relatedContainer.innerHTML = related.map(blog => `
    <a href="../${blog.url}" class="blog-card">
      <img src="../${blog.image}" alt="${blog.title}">
      <div class="blog-content">
        <h3>${blog.title}</h3>
      </div>
    </a>
  `).join("");
  // ===============================
  // DYNAMIC SCHEMA (PER ARTICLE)
  // ===============================

  const currentId = document.body.dataset.postId;
  const schemaScript = document.getElementById("dynamic-schema");

  if (!currentId || !schemaScript) return;

  let blogs = [];

  try {
    const res = await fetch("../blogs.json");
    blogs = await res.json();
  } catch (e) {
    console.error(e);
    return;
  }

  const post = blogs.find(b => b.id === currentId);

  if (!post) return;

  // 🔥 BUILD SCHEMA
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": `https://practicegridsolutions.com/blog/${post.image}`,
    "author": {
      "@type": "Organization",
      "name": "PracticeGrid Solutions"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PracticeGrid Solutions",
      "logo": {
        "@type": "ImageObject",
        "url": "https://practicegridsolutions.com/images/logo.png"
      }
    },
    "datePublished": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://practicegridsolutions.com/blog/${post.url}`
    }
  };

  schemaScript.textContent = JSON.stringify(schema);

}); // DOM Close
