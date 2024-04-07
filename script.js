fetch('data.json') // requête vers le fichier JSON
  .then(response => response.json()) // convertir la réponse textuelle en JSON
  .then(data => {
    let donneeTab=countTypes(data);
    let tabUrl=setUrl(data);
    console.log(donneeTab);
    console.log(tabUrl);
    // traiter les données
    setTrackList(data);
    displayChart(donneeTab);
  })
  function setUrl(data) {
    let tabSongsUrl = [];
  
    // Parcourir chaque élément du tableau data
    data.forEach(element => {
      // Vérifier si l'élément a une propriété "album" avec une propriété "external_urls" contenant l'URL Spotify
      if (element.album && element.album.external_urls && element.album.external_urls.spotify) {
        // Ajouter l'URL au tableau tabSongsUrl
        tabSongsUrl.push(element.album.external_urls.spotify);
      }
    });
    
    return tabSongsUrl;
}

  function countTypes(data){ //fonction compter le nombre de chanson par type d'album
   let tabSongsType={};
    data.forEach(element => {
      if(tabSongsType[element.album.album_type]){
        tabSongsType[element.album.album_type]++;
      }
      else{
      tabSongsType[element.album.album_type] = 1;
      }
    });
    return tabSongsType;
}

function setTrackList(data) {
  // Récupération du template pour les cartes
  let template = document.getElementById('trackCard');
  
  // Nettoyer le contenu actuel des cartes
  let trackList = document.getElementById('trackList');
  trackList.innerHTML = '';

  // Parcours des chansons
  for (let i = 0; i < data.length; i++) {
    // Faire un clone du template
    const clone = template.content.cloneNode(true);

    let artists = data[i].artists[0].name;

    // Remplir le clone avec les données
    clone.querySelector('.card-title').textContent = data[i].name;
    clone.querySelector('.card-text').textContent = artists;
    clone.querySelector('.card-img-top').src = data[i].album.images[0].url;
    clone.querySelector('.card-img-top').alt = data[i].name;

    // Ajouter la carte au DOM dans le conteneur
    trackList.appendChild(clone);
  }

  // Mettre à jour les liens Spotify une fois que les éléments sont ajoutés au DOM
  const tabUrl = setUrl(data); // Utilisation de la fonction setUrl pour récupérer les URLs
  const trackCards = document.querySelectorAll('.card');
  tabUrl.forEach((url, index) => {
    // Vérifiez si trackCards[index] est défini avant d'y accéder
    if (index < trackCards.length) {
      const link = trackCards[index].querySelector('.spotify-link');
      link.setAttribute('href', url); // Mettre à jour l'URL du bouton
    }
  });

  // Mise à jour des images du carrousel
  updateCarouselImages(data);
}

// Fonction pour mettre à jour les images du carrousel avec les images des albums
function updateCarouselImages(data) {
  // Récupération du carrousel Bootstrap
  let carouselInner = document.querySelector('.carousel-inner');
  
  // Nettoyer le contenu actuel du carrousel
  carouselInner.innerHTML = '';

  // Parcours des chansons pour ajouter les images au carrousel
  for (let i = 0; i < data.length; i++) {
    let albumImage = data[i].album.images[0].url;
    let carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    if (i === 0) {
      carouselItem.classList.add('active');
    }
    // Modification de la taille de l'image en ajoutant les classes Bootstrap
    carouselItem.innerHTML = `<img src="${albumImage}" class="d-block mx-auto img-fluid carousel-img" alt="${data[i].name}" style="max-height: 300px;">`;
    carouselInner.appendChild(carouselItem);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  fetch('data.json')
  .then(response => response.json())
  .then(data => {
      // traiter les données
      setTrackList(data);
      let donneeTab=countTypes(data);
      displayChart(donneeTab);
  });
});
let myChart = null; // Variable pour stocker l'instance du graphique

function displayChart(donneeTab) {
  // Détruire le graphique existant s'il y en a un
  if (myChart) {
    myChart.destroy();
  }

  //création du graphique
  const ctx = document.getElementById('myChart').getContext('2d');
  const labels = ["Albums", "Compilations", "Singles"];
  const data = {
    labels: labels,
    datasets: [{
      label: 'Nombre de chanson par type',
      data: [donneeTab.album, donneeTab.compilation, donneeTab.single],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(166, 159, 64, 0.2)',
        'rgba(14, 205, 86, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(166, 159, 64)',
        'rgb(14, 205, 86)'
      ],
      borderWidth: 1
    }]
  };
  const config = {
    type: 'pie',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  // Créer un nouveau graphique
  myChart = new Chart(ctx, config);
}
