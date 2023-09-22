import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

let firebaseConfig = {
    // firebase credentials
    apiKey: "AIzaSyBR1QrFYUYPtpL329yCCoNkizzWyIc5B-s",
    authDomain: "curiousquill-85f94.firebaseapp.com",
    projectId: "curiousquill-85f94",
    storageBucket: "curiousquill-85f94.appspot.com",
    messagingSenderId: "797784092209",
    appId: "1:797784092209:web:489844c851f49b7a172f10"
};

let blogId = decodeURI(location.pathname.split("/").pop());
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const sanitizedBlogId = blogId.replace(/[.#$/[\]]/g, '');
const blogDocRef = doc(db, "blogs", sanitizedBlogId);

getDoc(blogDocRef)
    .then((docSnapshot) => {
        if (docSnapshot.exists()) {
            setupBlog(docSnapshot.data());
        } else {
            location.replace("/");
        }
    })
    .catch((error) => {
        console.error("Error fetching blog:", error);
    });

const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const titleTag = document.querySelector('title');
    const publish = document.querySelector('.published');

    banner.style.backgroundImage = `url(${data.bannerImage})`;

    titleTag.innerHTML += blogTitle.innerHTML = data.title;
    publish.innerHTML += data.publishedAt;

    const article = document.querySelector('.article');
    addArticle(article, data.article);
}

const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);
    // console.log(data);

    data.forEach(item => {
        // check for heading
        if (item[0] == '#') {
            let hCount = 0;
            let i = 0;
            while (item[i] == '#') {
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
        }
        //checking for image format
        else if (item[0] == "!" && item[1] == "[") {
            let seperator;

            for (let i = 0; i <= item.length; i++) {
                if (item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")") {
                    seperator = i;
                }
            }

            let alt = item.slice(2, seperator);
            let src = item.slice(seperator + 2, item.length - 1);
            ele.innerHTML += `
            <img src="${src}" alt="${alt}" class="article-image">
            `;
        }

        else {
            ele.innerHTML += `<p>${item}</p>`;
        }
    })
}

