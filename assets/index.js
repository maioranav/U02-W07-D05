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
            // favSong(queryResults)
            sessionStorage.setItem(storagePosition, JSON.stringify(queryResults))
         } else if (typeof many === "number") {
            queryResults = []
            for (let i = 0; i < many; i++) {
               queryResults.push(data.data[i])
            }
            //  list4songs(queryResults)
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




window.onload = fetchSongs(songUrl, "favSong", 1)
window.onload = fetchSongs(artistUrl, "artist", 4)