
const input = document.getElementById('input');
const btn = document.getElementById('btn');
const img = document.getElementById('img');
function generateImage(){
    const prompt = input.value.trim();
    fetch(`https://api.unsplash.com/photos/random?query=${prompt}&client_id=JJp7f5hwz7VqsgqbDGoQ_ukwUVWlidIYlYh1Dzoby60`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        img.src = data.urls.regular;
      });
}
let clickCount = 0;
btn.addEventListener('click', ()=>{
 //  console.log(prompt) 
    generateImage()
    clickCount++;

    if (clickCount === 50) {
      alert("Cooldown! Use After An Hour");
      clickCount = 0; // Reset after alert
    }
  });


const clr = document.getElementById('clr');

clr.addEventListener('click', () => {
  input.value = "";
  img.src = "";
})
