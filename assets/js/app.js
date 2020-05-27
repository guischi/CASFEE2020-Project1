const btn = document.querySelectorAll(".img-flash");
const setImportance = (e) => {
    console.log(e.target.dataset.id);
    for(let i=1;i<=5;i++) {
        if(i<=e.target.dataset.id) {
            document.querySelector("#importance-"+i).src = "./assets/img/flash-on.png";
        } else {
            document.querySelector("#importance-"+i).src = "./assets/img/flash-off.png";
        }
    }
};
for(const f of btn) {
    f.addEventListener("click", setImportance); 
}