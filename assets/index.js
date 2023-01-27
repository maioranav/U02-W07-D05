const songUrl = 'teardrop massive attack';
const artistUrl = 'pink floyd';
const albumUrl = [
   'travelling without movin',
   'you could have it so much better',
   'animals pink floyd'
]

const baseUrl = "https://striveschool-api.herokuapp.com/api/deezer/search?q="

const fetchSongs = async function (url, storagePosition, many = 1) {
   try {
      let response = await fetch(baseUrl + url)
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
            </div>`;
}

const albumsList = []

class Album {
   constructor(object) {
      this.name = object.album.title
      this.artist = object.artist.name
      this.cover = object.album.cover_big
   }
}

const drawAlbums = (array) => {
   let libraryDOM = document.querySelector("#albumItems")
   libraryDOM.innerHTML = ''
   for (let i = 0; i < array.length; i++) {
      if (i > 0) {
         card = `
 <div class="carousel-item">
                     <img class="d-block w-100"
                        src="${array[i].cover}"
                        alt="${array[i].artist} - ${array[i].name}">
                         <div class="carousel-caption d-none d-md-block">
        <h5  class="bg-dark px-2 py-1">${array[i].artist} - ${array[i].name}</h5>
      </div>

                  </div>
                  `;
      } else {
         card = `
 <div class="carousel-item active">
                     <img class="d-block w-100"
                        src="${array[i].cover}"
                        alt="${array[i].artist} - ${array[i].name}">
                                                 <div class="carousel-caption d-none d-md-block">
        <h5 class="bg-dark px-2 py-1">${array[i].artist} - ${array[i].name}</h5>
      </div>
                  </div>
                  `;
      }

      libraryDOM.innerHTML += card

   }
}

const fetchAlbums = async function (url) {
   try {
      let response = await fetch(baseUrl + url)
      if (response.ok) {
         let data = await response.json()
         albumsList.push(new Album(data.data[0]))
         sessionStorage.setItem('albums', JSON.stringify(albumsList))
         drawAlbums(albumsList)
      } else {
         console.log('Il server ha restituito un errore!' + response)
      }
   } catch (error) {
      console.log("C'è un problema all'accesso alla risorsa")
      console.log(error)
   }
}

window.onload = sessionStorage.clear();
window.onload = fetchSongs(songUrl, "favSong", 1)
window.onload = fetchSongs(artistUrl, "artist", 4)
for (let i = 0; i < albumUrl.length; i++) {
   fetchAlbums(albumUrl[i])
}

const allAlbums = []
const allSongs = []

const getAllAlbums = () => {
   allAlbums.length = 0;
   let savedAlbums = JSON.parse(sessionStorage.getItem('albums'))
   savedAlbums.forEach(element => {
      allAlbums.push({
         name: element.name,
         artist: element.artist
      })
   });

   let savedArtist = JSON.parse(sessionStorage.getItem('artist'))
   savedArtist.forEach(element => {
      allAlbums.push({
         name: element.album.title,
         artist: element.artist.name
      })
   });

   let savedSong = JSON.parse(sessionStorage.getItem('favSong'))
   allAlbums.push({
      name: savedSong.album.title,
      artist: savedSong.artist.name
   })
}

const getAllSongs = () => {
   allSongs.length = 0;
   let savedArtist = JSON.parse(sessionStorage.getItem('artist'))
   savedArtist.forEach(element => {
      allSongs.push({
         name: element.title_short,
         artist: element.artist.name,
         rank: Number(element.rank)
      })
   });
   let savedSong = JSON.parse(sessionStorage.getItem('favSong'))
   allSongs.push({
      name: savedSong.title_short,
      artist: savedSong.artist.name,
      rank: Number(savedSong.rank)
   })
}

const getAllInList = () => {
   document.getElementById('modalAlbumsBody').innerHTML = `<h5>Albums:</h5>`
   getAllAlbums()
   getAllSongs()
   allAlbums.forEach(element => {
      document.getElementById('modalAlbumsBody').innerHTML += `
      <p>${element.artist} - ${element.name}`
   })
   document.getElementById('modalAlbumsBody').innerHTML += `<h5 class="mt-5">Songs:</h5>`
   allSongs.forEach(element => {
      document.getElementById('modalAlbumsBody').innerHTML += `
      <p>${element.artist} - ${element.name}`
   })
}

const getBestRank = () => {
   getAllSongs()
   allSongs.sort((a, b) => (a.rank < b.rank) ? 1 : -1)
   document.getElementById('rankAlert').innerHTML = ''
   allSongs.forEach(element => {
      document.getElementById('rankAlert').innerHTML += `<p>${element.artist} - ${element.name} (${element.rank})</p>`
   })
}

const showBestRankAlert = () => {
   getBestRank()
   document.getElementById('rankAlert').classList.add('showRank')
   setTimeout(() => {
      document.getElementById('rankAlert').classList.remove('showRank')
   }, 3000)
}