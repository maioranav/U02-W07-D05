const songUrl = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=shine+on+you+crazy+diamond';
const artistUrl = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=pink+floyd';

const fetchSongs = async function (url, storagePosition, many = 1) {
   try {
      sessionStorage.clear();
      let response = await fetch(url)
      if (response.ok) {
         let data = await response.json()
         if (many === 1) {
            queryResults = data.data[0]
            favSong(queryResults)
            sessionStorage.setItem(storagePosition, JSON.stringify(queryResults))
         } else if (typeof many === "number") {
            queryResults = []
            for (let i = 0; i < many; i++) {
               queryResults.push(data.data[i])
            }
            list4songs(queryResults)
            sessionStorage.setItem(storagePosition, JSON.stringify(queryResults))
         }
      } else {
         console.log('Il server ha restituito un errore!' + response)
      }
   } catch (error) {
      console.log("C'è un problema all'accesso alla risorsa")
      console.log(error)
   }
}

const list4songs = (array) => {
   let libraryDOM = document.querySelector("#cardsTop4")
   libraryDOM.innerHTML = ''
   for (let i = 0; i < array.length; i++) {

      let card = `
            <div class="card text-white bg-dark m-3 rounded" style="width: 18rem;">
               <img class="card-img-top mt-3"
                  src="${array[i].album.cover_big}"
                  alt="Card image cap">
               <div class="card-body">
                  <h5 class="card-title">${array[i].title_short}</h5>
                  <p class="card-text">${array[i].artist.name}</p>
               </div>
            </div>
                  `;

      libraryDOM.innerHTML += card

   }
}

const favSong = (object) => {
   let libraryDOM = document.querySelector("#secondSection .favSong")
   console.log(object)
   libraryDOM.innerHTML = `
            <img class="rounded border border-1"
               src="${object.album.cover_big}"
               alt="Card image" width="300px" height="300px">
            <div class="card-body p-5 text-center text-lg-start">
               <h4 class="card-title display-5">${object.title_short}</h4>
               <h5 class="card-title my-5">
               <img src="${object.artist.picture_small}" width="50px" height="50px">
               ${object.artist.name}</h5>
               <p class="card-text my-4 fst-italic">da: ${object.album.title}</p>
               <audio controls class="rounded bg-primary">
                  <source src="${object.preview}"
                     type="audio/mpeg">
               </audio>
            </div>
                  `;

}

window.onload = fetchSongs(songUrl, "favSong", 1)
window.onload = fetchSongs(artistUrl, "artist", 4)