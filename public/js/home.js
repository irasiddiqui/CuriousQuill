import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
const blogSection = document.querySelector('.blogs-section');
let firebaseConfig = {
    //firebase credentials
    apiKey: "AIzaSyBR1QrFYUYPtpL329yCCoNkizzWyIc5B-s",
    authDomain: "curiousquill-85f94.firebaseapp.com",
    projectId: "curiousquill-85f94",
    storageBucket: "curiousquill-85f94.appspot.com",
    messagingSenderId: "797784092209",
    appId: "1:797784092209:web:489844c851f49b7a172f10"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const docRef = collection(db, "blogs");
const querySnapshot = await getDocs(docRef);
const createBlog = (blog) => {
    let data = blog.data();
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${data.article.substring(0, 275) + '...'}</p>
        <a href="/${blog.id}" class="btn dark">read</a>
    </div>
    `;
}

querySnapshot.forEach(blog => {
    if (blog.id != decodeURI(location.pathname.split("/").pop())) {
        createBlog(blog);
    }
})


