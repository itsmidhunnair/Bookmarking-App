// <!----------------Javascript---------------------->

const body = document.body;
const input = document.querySelector('input[type=url]');
const overlay = document.querySelector('.overlay');
const apiUrl = 'https://opengraph.io/api/1.1/site';
const appId = '87e749cf-d494-4816-b0ec-6db5d6c9b711';
// const appId = 'f49ee7c3-a80f-4683-a9f5-60c9fd3519c6';

//use either of the above


// .then(response => {
//     console.log(response.json());
// })

function showFloater() {
    body.classList.add('show-floater');
}

function hideFloater() {
    if (body.classList.contains('show-floater')) {
        body.classList.remove('show-floater');
    }
}

input.addEventListener('focusin', showFloater);
// input.addEventListener('focusout', hideFloater);
overlay.addEventListener('click', hideFloater);

//************* for bookmark list *************//



const bookmarksList = document.querySelector('.bookmark-list');
const bookmarkForm = document.querySelector('.bookmark-form');
const bookmarkInput = bookmarkForm.querySelector('input[type=url]');
const bookmarkRecord = JSON.parse(localStorage.getItem('bookmarkRecord')) || [];
// const bookmarkRecord = [];

fillBookmarkRecord(bookmarkRecord);

function createBookmark(event) {
    event.preventDefault();

    if (!bookmarkInput.value) {
        alert("Please insert the bookmark")
        return;
    }

    const Url = encodeURIComponent(bookmarkInput.value);

    fetch(apiUrl + '/' + Url + '?app_id=' + appId)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            // console.log(data.hybridGraph.title)
            // console.log(data.hybridGraph)

            const title = bookmarkInput.value;
            const bookmark = {
                title: data.hybridGraph.title,
                image: data.hybridGraph.image,
                link: data.hybridGraph.url
            };
            bookmarkRecord.push(bookmark);
            fillBookmarkRecord(bookmarkRecord);
            storeBookmarks(bookmarkRecord);
            bookmarkForm.reset();
            // console.table(bookmarkRecord);
        })
        .catch(error => {
            alert("Please Enter a Valid URL, \nDo make sure to include ' http:// ' in the beggining of the URL.")
        });




    // const title = bookmarkInput.value;
    // const bookmark = document.createElement('a');
    // bookmark.className = 'bookmark'
    // bookmark.innerText = title;
    // bookmark.href = '#';
    // bookmark.target = '_blank';

    // bookmarksList.appendChild(bookmark);



    // console.log(bookmark);
};

function removeBookmark(e) {
    // console.log(e);
    if (!e.target.matches('.glyphicon-remove')) {
        return;
    };
    // console.log('hello');
    const index = e.target.parentNode.dataset.id;

    // console.log(index);

    bookmarkRecord.splice(index, 1);
    fillBookmarkRecord(bookmarkRecord);
    storeBookmarks(bookmarkRecord);
};

function fillBookmarkRecord(bookmarkRecord = []) {

    const bookmarksHtml = bookmarkRecord.map((bookmark, i) => {
        return `
            <a href="${bookmark.link}" class="bookmark" target="_blank" data-id="${i}">
            <span class="glyphicon glyphicon-remove"></span>
            <div class="img">
            <img src="${bookmark.image}"/>
            </div>
            <div class="title">${bookmark.title}</div>
            </a>
            
        
        `;
    }).join('');

    //ALTERNATIVE USING FOR LOOP

    // let bookmarksHtml = '';
    // for (let i=0; i < bookmarkRecord.length; i++){
    //    bookmarksHtml +=`
    //    <a href="#" class="bookmark">
    //     ${bookmarkRecord[i].title}
    //     </a>
    //    `;
    // }
    // console.log(bookmarksHtml);
    bookmarksList.innerHTML = bookmarksHtml;
};

function storeBookmarks(bookmarkRecord = []) {
    localStorage.setItem('bookmarkRecord', JSON.stringify(bookmarkRecord));
}

bookmarkForm.addEventListener('submit', createBookmark);
bookmarksList.addEventListener('click', removeBookmark);