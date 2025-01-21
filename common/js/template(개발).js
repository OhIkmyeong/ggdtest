/** DOM 준비 다 되면 시작 */
document.addEventListener("DOMContentLoaded",async()=>{
    /** DATA(반영 const data = ...json) */
    const data = await fetch("./data.json")
    .then(res=>res.json())
    .catch((err)=>{
        throw(err);
    });
    const dataImg = await fetch("./dataImg.json")
    .then(res=>res.json())
    .catch((err)=>{
        throw(err);
    });

    /** DOM-wrap */
    const $wrap = document.querySelector(".board_hongbo3_wrap");
    if(!$wrap){console.error("no DOM WRAP"); return;}
});//DOMContentLoaded