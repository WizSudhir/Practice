document.addEventListener("DOMContentLoaded", async () => {

  const currentId = document.body.dataset.postId;
  const relatedContainer = document.querySelector(".related-posts .blog-grid");
  const schemaScript = document.getElementById("dynamic-schema");

  if (!currentId) return;

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

  // ===============================
  // ✅ RELATED POSTS
  // ===============================
  if (relatedContainer) {
    const related = blogs
      .filter(b => b.id !== currentId)
      .map(blog => {
        const score = blog.tags?.filter(tag =>
          currentPost.tags.includes(tag)
        ).length || 0;

        return { ...blog, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    relatedContainer.innerHTML = related.map(blog => `
      <a href="../${blog.url}" class="blog-card">
        <img src="../${blog.image}" alt="${blog.title}">
        <div class="blog-content">
          <h3>${blog.title}</h3>
        </div>
      </a>
    `).join("");
  }

  // ===============================
  // ✅ DYNAMIC SCHEMA
  // ===============================
  if (schemaScript) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": currentPost.title,
      "image": `https://practicegridsolutions.com/blog/${currentPost.image}`,
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
      "datePublished": currentPost.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://practicegridsolutions.com/blog/${currentPost.url}`
      }
    };

    schemaScript.textContent = JSON.stringify(schema);
  }

});
