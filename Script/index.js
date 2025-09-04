const createElement = (arr =>{
    const htmlElement = arr.map((el) => `<span class="bg-[#D7E4EF] p-1">${el}</span>`);
    return htmlElement.join(" ");
})

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
// Get API Data
const loadLessons = () =>{
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLeasson(json.data));
};
/* lead level word */
const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach((btn) => btn.classList.remove("active"));
}
const leadLevelWord = (id) =>{
    manageSpinner(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        removeActive();
         const clickBtn = document.getElementById(`lesson-btn-${id}`);
         clickBtn.classList.add("active");
        displayWords(data.data);
    });
}
/* leading spin function */
const manageSpinner = (stutas) =>{
    if(stutas == true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }else{
        document.getElementById("word-container").classList.remove("hidden");
       document.getElementById("spinner").classList.add("hidden");
    }
}
/* load word datail */
const leadWordDatail = async(id) =>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url);
    const datials = await res.json();
    displayWordDatail(datials.data);
}

/* display word datails */
const displayWordDatail = (word) =>{
   const detailsBox = document.getElementById("details-container");
   detailsBox.innerHTML = `
     <div>
        <h1 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})</h1>
      </div>
      <div class="my-5">
        <h1 class="text-[20px] font-[600] mb-1">Meaning</h1>
        <p class="text-[20px] font-[500]">${word.meaning}</p>
      </div>
      <div class="mb-4">
        <h1 class="text-[18px] font-[500] mb-1">Example</h1>
        <p class="text-[18px] "> ${word.sentence}</p>
      </div>
      <div>
        <h1 class="text-[18px] font-[500] mb-3">সমার্থক শব্দ গুলো</h1>
        <div>${createElement(word.synonyms)}</div>
      </div>
   `;
   document.getElementById("my_modal_5").showModal();
}
/* display word */
const displayWords = (words) =>{
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length == 0){
        wordContainer.innerHTML = `
        <div class="col-span-full text-center py-[50px]">
        <img src="./assets/alert-error.png" alt="" class ="mx-auto mb-5">
          <p class="text-[22px] text-[#79716B] mb-5">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
          <p class="text-[34px] font-bold">নেক্সট Lesson এ যান</p>
        </div>
        `;
        manageSpinner(false)
        return;
    }
   words.forEach(word => {
    const card = document.createElement("div");
    card.innerHTML=`
     <div class="card card-border bg-base-100 w-full h-full">
  <div class="card-body p-10">
    <h2 class="text-[32px] font-[600] text-center">${word.word ? word.word :"শব্দ পাওয়া যায়নি"
}</h2>
    <p class="text-[20px] font-[500] text-center my-2">Meaning /Pronounciation</p>
    <p class="text-[28px] font-[500] text-center">"${word.meaning ? word.meaning :"অর্থ পাওয়া যায়নি"
} / ${word.pronunciation ? word.pronunciation :"প্রোনাউন্সিয়েশন পাওয়া যায়নি"
}"</p>
    <div class="flex justify-between mt-10">
      <button onclick="leadWordDatail(${word.id})" class="btn btn-sm bg-[#1a91ff1a] rounded-xl py-4 hover:bg-sky-400"> <i class="fa-solid fa-circle-exclamation text-[20px] rotate-180 "></i></button>
      <button oneclick="pronounceWord(${word.word})" class="btn btn-sm bg-[#1a91ff1a] rounded-xl py-4 hover:bg-sky-400"><i class="fa-solid fa-volume-low text-[20px]"></i></button>
     
      
    </div>
  </div>
        </div>
    `;
    wordContainer.append(card);
    manageSpinner(false);
   });
}
/* display lessons */
const displayLeasson = (leassons) =>{
   
   /* get parent container */
   const lavelContainer = document.getElementById("label-container");
   lavelContainer.innerHTML = "";
   /* get into every lesson */
   for (const leasson of leassons) {
    /* cleate element */
    const btnDiv= document.createElement("div")
    btnDiv.innerHTML =`
   <button id="lesson-btn-${leasson.level_no}" onclick="leadLevelWord(${leasson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson-${leasson.level_no}</button>
    `
    /* appent child */
    lavelContainer.append(btnDiv);
   }

}
loadLessons();

document.getElementById("search-btn").addEventListener("click",()=>{
    const input= document.getElementById("input-search");
    const searchValue = input.value;
    console.log(searchValue);
    fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data)=> {
        const allWords = data.data;
        const filterWords = allWords.filter((word)=>
            word.word.toLowerCase().includes(searchValue)
        );
        displayWords(filterWords);
    });
})