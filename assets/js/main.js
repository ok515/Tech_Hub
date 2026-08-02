async function loadArticles(){

const response=await fetch("data/articles.json");
const articles=await response.json();

const container=document.getElementById("posts");

container.className="card-grid";

container.innerHTML=articles.map(article=>`

<article class="card">

<div class="card-image"></div>

<div class="card-content">

<span class="card-category">
${article.category}
</span>

<h2 class="card-title">
${article.title}
</h2>

<p class="card-description">
${article.description}
</p>

<div class="card-footer">

<span>${article.date}</span>

<a class="button" href="${article.url}">
Read
</a>

</div>

</div>

</article>

`).join("");

}

loadArticles();
