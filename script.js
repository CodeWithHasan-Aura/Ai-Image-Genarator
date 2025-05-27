const input = document.getElementById('input');
const prompt = input.value;
// console.log(prompt);

async function generateImage() {
  const url = 'https://ai-image-generator3.p.rapidapi.com/generate';
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': 'fa4e660511msh18c4e36ba9f5fe0p1d329cjsn535cf42b9da2',
      'x-rapidapi-host': 'ai-image-generator3.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: `${prompt}`,
      page: 1
    })
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
    // console.log(result.results.images[0]);
  } catch (error) {
    console.error(error);
  }
}

const img = document.getElementById('img');
const btn = document.getElementById('btn');
const clr = document.getElementById('clr');

btn.addEventListener('click', () => {
  generateImage().then(result => {
    img.src = result.results.images[0];
  }).catch(error => {
    console.error("Error generating image:", error);
  });
});
clr.addEventListener('click', () => {
  input.value = "";
  img.src = "";
})
