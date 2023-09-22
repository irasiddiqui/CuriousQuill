import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
// import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"; 
let firebaseConfig = {
    //firebase credentials
    apiKey: "AIzaSyBR1QrFYUYPtpL329yCCoNkizzWyIc5B-s",
    authDomain: "curiousquill-85f94.firebaseapp.com",
    projectId: "curiousquill-85f94",
    storageBucket: "curiousquill-85f94.appspot.com",
    messagingSenderId: "797784092209",
    appId: "1:797784092209:web:489844c851f49b7a172f10"
};

const blogTitleField = document.querySelector('.title');
const articleFeild = document.querySelector('.article');

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if (file && file.type.includes("image")) {
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
            .then(data => {
                if (uploadType == "image") {
                    addImage(data, file.name);
                } else {
                    bannerPath = `${location.origin}/${data}`;
                    banner.style.backgroundImage = `url("${bannerPath}")`;
                    console.log(`Banner Path ${bannerPath}`);
                    console.log("Document has been added successfully");
                }
            })
    } else {
        alert("upload Image only");
    }
}

const addImage = (imagepath, alt) => {
    let curPos = articleFeild.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleFeild.value = articleFeild.value.slice(0, curPos) + textToInsert + articleFeild.value.slice(curPos);
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener('click', () => {
    if (articleFeild.value.length && blogTitleField.value.length) {
        // generating id
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for (let i = 0; i < 4; i++) {
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        // setting up docName
        let docName = `${blogTitle}-${id}`;
        let date = new Date(); // for published at info

        // const db = firebase.database().ref();
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app)
        const dbRef = collection(db, "blogs");
        const data = {
            title: blogTitleField.value,
            article: articleFeild.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        };
        addDoc(dbRef, data)
            .then(docRef => {
                console.log("Document has been added successfully");
                displaySuccessMessageAndRedirect();
            })
            .catch(error => {
                console.log(error);
            })

        
    }
})

function displaySuccessMessageAndRedirect() {
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block'; // Display the message

    setTimeout(() => {
        successMessage.style.display = 'none';

        // Redirect to the home page
        window.location.href = "/";
    }, 2500); 
}