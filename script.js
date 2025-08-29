const form = document.getElementById("postForm");
const postsContainer = document.getElementById("posts");
const newsContainer = document.getElementById("news");

let posts = JSON.parse(localStorage.getItem("posts")) || [];

// Render posts
function renderPosts() {
  postsContainer.innerHTML = "";
  posts.forEach((post) => {
    const div = document.createElement("div");
    div.classList.add("post");
    div.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
    `;
    postsContainer.appendChild(div);
  });
}

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  posts.push({ title, content });
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts();
  form.reset();
});

// Fetch news using AllOrigins
async function fetchNews() {
  try {
    const API_KEY = "2dbbe002c65e49b1a359f1ca6e50d0ce";
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();
    const parsed = JSON.parse(data.contents);

    newsContainer.innerHTML = "";

    if (!parsed.articles || parsed.articles.length === 0) {
      newsContainer.innerHTML = "<p>⚠️ لا يوجد أخبار متاحة حالياً.</p>";
      return;
    }

    parsed.articles.forEach(article => {
      const div = document.createElement("div");
      div.classList.add("news-item");
      div.innerHTML = `
        ${article.urlToImage ? `<img src="${article.urlToImage}" alt="News Image">` : ""}
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <a href="${article.url}" target="_blank">اقرأ المزيد</a>
      `;
      newsContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    newsContainer.innerHTML = "<p>⚠️ فشل تحميل الأخبار.</p>";
  }
}

// Init
renderPosts();
fetchNews();
