
 const input = document.getElementById('input');
const btn = document.getElementById('btn');
const img = document.getElementById('img');
const selectEl = document.getElementById('Selectoption');
const clr = document.getElementById('clr');

// ===== Helper to show messages in the image box =====
function showMessage(text, color = "red") {
  img.style.display = "block";
  img.removeAttribute("src");
  img.alt = text;
  img.style.width = "100%";
  img.style.height = "auto";
  img.style.border = "2px solid " + color;
  img.style.padding = "15px";
  img.style.objectFit = "contain";
  img.style.background = "#f9f9f9";
  img.style.color = color;
  img.style.fontSize = "16px";
  img.style.textAlign = "center";
  img.style.fontFamily = "sans-serif";
  img.src = ""; // clear old image
}

// ===== Normal Mode (Unsplash) =====
function normal() {
  const prompt = input.value.trim();
  if (!prompt) {
    alert("⚠️ Please enter a prompt first!");
    return;
  }

  showMessage(`🔎 Searching Unsplash for "${prompt}"...`, "darkcyan");

  fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(prompt)}&client_id=_MWVlvH6Mh0gDBEDt9BJez45x0S_aWfyq0eodX7K6XI`)
    .then(res => res.json())
    .then(data => {
      if (data && data.urls && data.urls.regular) {
        img.style = ""; // reset styles
        img.src = data.urls.regular;
        img.style.display = "block";
      } else {
        showMessage("❌ No image found. Try another prompt.");
      }
    })
    .catch(err => {
      console.error("Error fetching Unsplash image:", err);
      showMessage("❌ Could not fetch image. Check console.");
    });
}

// ===== AI Mode (AI Horde) =====
async function Ai() {
  const prompt = input.value.trim();
  if (!prompt) {
    alert("⚠️ Please enter a prompt first!");
    return;
  }

  showMessage("⚡ Generating your AI image... please wait", "darkcyan");

  const API_KEY = "-9yJOGubQjpoDptfkSIehQ"; // <-- your AI Horde key
  let jobId;

  try {
    // Step 1: Submit job
    const res = await fetch("https://stablehorde.net/api/v2/generate/async", {
      method: "POST",
      headers: {
        "apikey": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        params: { sampler_name: "k_euler_a", steps: 20, cfg_scale: 7, width: 512, height: 512 },
        nsfw: false,
        censor_nsfw: true
      })
    });

    if (res.status === 429) {
      showMessage("❌ You have reached the daily API limit. Please try again tomorrow.");
      return;
    }

    const data = await res.json();
    if (!data.id) {
      showMessage(`❌ Failed to start AI job. ${data.message || ""}`);
      return;
    }

    jobId = data.id;
    console.log("Job ID:", jobId);

    // Step 2: Poll until done
    let done = false;
    let result;
    while (!done) {
      await new Promise(r => setTimeout(r, 2000));
      const statusRes = await fetch(`https://stablehorde.net/api/v2/generate/status/${jobId}`, {
        headers: { "apikey": API_KEY }
      });

      if (statusRes.status === 429) {
        showMessage("❌ API rate limit reached. Please wait or try later.");
        return;
      }

      result = await statusRes.json();
      done = result.done;

      if (!done && result.wait_time) {
        showMessage(`⚡ Generating... approx wait: ${Math.round(result.wait_time)}s`, "darkcyan");
      }
    }

    // Step 3: Show image
    if (result.generations && result.generations.length > 0) {
      img.style = "";
      img.src = result.generations[0].img;
      img.style.display = "block";
    } else {
      showMessage("❌ AI Horde did not return an image.");
    }

  } catch (err) {
    console.error("Error generating AI Horde image:", err);
    showMessage("❌ Something went wrong while generating AI image.");
  }
}

// ===== Event Bindings =====
btn.addEventListener('click', () => {
  const selectedOption = selectEl.value.toLowerCase();
  if (selectedOption === "real") {
    normal();
  } else if (selectedOption === "ai") {
    Ai();
  }
});

// ===== Clear Button =====
clr.addEventListener('click', () => {
  input.value = "";
  img.src = "";
  img.style.display = "none";
});
