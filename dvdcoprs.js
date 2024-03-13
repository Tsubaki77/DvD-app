// APP VIDÉO + API

// 1) Faire le HTML / CSS 

// 2) Récup les éléments depuis JS

// 3) Faire la recherche de film (on recup ce qu'il y a dans l'input 
// et on fait une requete http)

// 4) On affiche les films 

// 5) On crée un bouton pour les favoris 

// 6) On récupère le film liké pour l'ajouter à un tableau de favoris (par exemple)

// On veut pouvoir préserver les favoris meme après fermeture du navigateur 
// 

// Pusher sur guthub une fois fini !! 

const input = document.querySelector('input')
const submit = document.querySelector('.submit')
const favBtn = document.querySelector('.btn-list')
const list = document.querySelector('.list')
const favList = document.querySelector('.fav-list')

const key = 'f1cd3768'

const favs = []

// On écoute le bouton de soumission 
submit.addEventListener('click', () => {
    list.innerHTML = ""

    const search = input.value
    const url = `http://www.omdbapi.com/?apikey=${key}&s=${search}&page=1`

    axios.get(url)
    .then(res => res.data.Search)
    .then(data => displayMovies(data))
    .catch(err => console.log(err))
})


favBtn.addEventListener('click', () => {
    list.innerHTML = ""

    // Recupérer mes favoris depuis le local storage
    const favsArray = JSON.parse(localStorage.getItem('favs'))

    favsArray.forEach(movie => {
        // console.log(movie)
        const li = document.createElement('li')
        li.setAttribute('id', movie.imdbId)

        li.innerHTML = `
                <h2>${movie.title}</h2>
                <img src=${movie.poster}>
                <h3>${movie.year}</h3>
                <button style="color:red" class="delFavBtn">Supprimer des favoris</button>`
        
        // On écoute le bouton de suppression
        li.addEventListener('click', (e) => {
            if (e.target.getAttribute('class') === 'delFavBtn') {
                const id = e.target.parentElement.getAttribute('id')

                // Je filtre de mon tableau de favoris le film choisi via son imdbId 
                const newArray = favsArray.filter((movie) => movie.imdbId != id)

                // On sauvegarde le tableau des favoris dans le local storage
                localStorage.setItem('favs', JSON.stringify(newArray))

                // On affiche le contenu de list dans la console 
                console.log(list)

            
            }
        })
        list.appendChild(li)
    })
})

function displayMovies(movies) {
    if (movies) {
        movies.forEach(movie => {
            const title = movie.Title
            const poster = movie.Poster
            const year = movie.Year
            const imdbId = movie.imdbID

            const li = document.createElement('li')

            li.innerHTML = `
                <li id=${imdbId}>
                    <h2>${title}</h2>
                    <img src=${poster}>
                    <h3>${year}</h3>
                    <button class="addFavBtn">Ajouter aux favoris</button>
                </li>`

            // On écoute le bouton des favoris 
            li.addEventListener('click', (e) => {
                if (e.target.getAttribute('class') === 'addFavBtn') {
                    const id = e.target.parentElement.getAttribute('id')

                    // On crée un objet avec les infos nécessaires pour notre film
                    const item = {
                        title: title,
                        poster: poster,
                        year: year,
                        imdbId: imdbId
                    }

                    // On push l'objet à la fin du tableaud es favs
                    favs.push(item)

                    // On sauvegarde le tableau des favoris dans le local storage
                    localStorage.setItem('favs', JSON.stringify(favs))
                }
            })

            list.appendChild(li)
        })
    } else {
        list.innerHTML = "<h2>Aucun film n'a été trouvé</h2>"
    }
}