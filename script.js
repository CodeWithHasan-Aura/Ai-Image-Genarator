
const input = document.getElementById('input');
const prompt = input.value;
const btn = document.getElementById('btn');
const img = document.getElementById('img');
function generateImage(){
    fetch(`https://api.unsplash.com/photos/random?query=${prompt}&client_id=JJp7f5hwz7VqsgqbDGoQ_ukwUVWlidIYlYh1Dzoby60`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        img.src = data.urls.regular;
      });
}

btn.addEventListener('click', ()=>{
 //  console.log(prompt) 
    generateImage();
})

const clr = document.getElementById('clr');

clr.addEventListener('click', () => {
  input.value = "";
  img.src = "";
})
