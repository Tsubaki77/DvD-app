// APP VIDÉO + API

// 1) Faire le HTML / CSS 

// 2) Récup les éléments depuis JS

// 3) Faire la recherche de film (on recup ce qu'il y a dans l'input 
// et on fait une requete http)

// 4) On affiche les films 

// 5) On crée un bouton pour les favoris 

// 6) On récupère le film liké pour l'ajouter à un tableau de favoris (par exemple)

// On veut pouvoir préserver les favoris meme après fermeture du navigateur 

// bonus perso : afficher toute la liste des films avec possibilité de chercher par lettre 

// Pusher sur github une fois fini !! 

const input = document.querySelector('input')
const submit = document.querySelector('.submit')
const favBtn = document.querySelector('.btn-list')
const list = document.querySelector('.list')
const favList = document.querySelector('.fav-list')

const key = 'f1cd3768'

// On écoute le bouton de soumission 
submit.addEventListener('click', () => {
    // list.innerHTML = ""

    const search = input.value
    const url = `http://www.omdbapi.com/?apikey=${key}&s=${search}&page=1`

    axios.get(url)
    .then(res => res.data.Search)
    .then(data => displayMovies(data))
    .catch(err => console.log(err))
})

// On écoute le bouton de fav 
favBtn.addEventListener('click', () => {
    // On recup les films depuis le local storage
    const favsArray = JSON.parse(localStorage.getItem('favs'))

    // On les affiche avec notre fonction displayMovies
    displayMovies(favsArray)
})

// Notre fonction d'affichage 
function displayMovies(movies) {
    list.innerHTML = ""

    if (movies) {
        movies.forEach(movie => {
            const title = movie.Title
            const poster = movie.Poster
            const year = movie.Year
            const imdbId = movie.imdbID

            const li = document.createElement('li')

            // Selon si le film est un favoris ou non on affiche le bouton adéquat
            if (movie.fav === true) {
                li.innerHTML = `
                <li id=${imdbId}>
                    <h2>${title}</h2>
                    <img src=${poster}>
                    <h3>${year}</h3>
                    <button class="delFavBtn">Supprimer des favoris</button>
                </li>`
            } else {
                li.innerHTML = `
                <li id=${imdbId}>
                    <h2>${title}</h2>
                    <img src=${poster}>
                    <h3>${year}</h3>
                    <button class="addFavBtn">Ajouter aux favoris</button>
                </li>`
            }

            // On écoute le bouton des favoris (soit ajout, soit suppression)
            li.addEventListener('click', (e) => {
                if (e.target.getAttribute('class') === 'addFavBtn') {

                    const id = e.target.parentElement.getAttribute('id')

                    // On crée un objet avec les infos nécessaires pour notre film
                    const item = {
                        Title: title,
                        Poster: poster,
                        Year: year,
                        imdbID: imdbId,
                        fav: true
                    }

                    // On push l'objet à la fin du tableau des favs
                    // favs.push(item)

                    const favsArray = JSON.parse(localStorage.getItem('favs'))
                    favsArray.push(item)

                    // On sauvegarde le tableau des favoris dans le local storage
                    localStorage.setItem('favs', JSON.stringify(favsArray))

                } else if (e.target.getAttribute('class') === 'delFavBtn') {
                    
                    const favsArray = JSON.parse(localStorage.getItem('favs'))
                    const id = e.target.parentElement.getAttribute('id')

                    // Je filtre de mon tableau de favoris le film choisi via son imdbId 
                    const newArray = favsArray.filter((movie) => movie.imdbID != id)
    
                    // On sauvegarde le tableau des favoris dans le local storage
                    localStorage.setItem('favs', JSON.stringify(newArray))

                    displayMovies(newArray)
                }
            })
            list.appendChild(li)
        })
    } else {
        list.innerHTML = "<h2>Aucun film n'a été trouvé</h2>"
    }
}