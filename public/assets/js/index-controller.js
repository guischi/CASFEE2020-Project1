const btn = document.querySelectorAll(".img-flash");
let importance = 0;
const setImportance = (e) => {
    for(let i=1;i<=5;i++) {
        if(i<=e.target.dataset.id) {
            document.querySelector("#new-importance-"+i).src = "./assets/img/flash-on.png";
        } else {
            document.querySelector("#new-importance-"+i).src = "./assets/img/flash-off.png";
        }
    }
    importance = e.target.dataset.id;
};

const getImportance = () => {
    return importance;
};

for(const f of btn) {
    f.addEventListener("click", setImportance); 
}

const btnAdd = document.querySelector("#btn-new-note");
btnAdd.addEventListener("click", () => { 
    showAddNoteForm();
 });

const btnCancel = document.querySelector("#btn-cancel");
btnCancel.addEventListener("click", () => { 
    showAddNoteForm();
});

const divDarkener = document.querySelector("darkener");
divDarkener.addEventListener("click", () => { 
    showAddNoteForm();
});

function showAddNoteForm() {
    document.querySelector("darkener").classList.toggle("show");
    document.querySelector("addnote").classList.toggle("show");
}

const btnSave = document.querySelector("#btn-save-note");
btnSave.addEventListener("click", () => {
    let valTitle = document.querySelector('input[name="title"]').value;
    let valDescription = document.querySelector('textarea[name="description"]').value;
    let valDueDate = document.querySelector('input[name="duedate"]').value;
    
    $.post("/notes", {
        title: valTitle,
        duedate: valDueDate,
        importance: getImportance,
        description: valDescription        
    }, function(data) {
        console.log(data);
    });
});

var noteTemplate = document.querySelector('#note-template').innerHTML;

var comp = Handlebars.compile(noteTemplate);

var noteData = comp({
    duedate: new Date(),
    title: "test",
    description: "blablablabla"    
});

document.querySelector('notes').innerHTML += noteData;