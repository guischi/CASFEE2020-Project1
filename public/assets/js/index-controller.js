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
        showAddNoteForm();
        loadNotes();
    });
});

const btnSortByDuedate = document.querySelector("#btn-filter-duedate");
btnSortByDuedate.addEventListener("click", () => { 
    setSortOrder("dueDate", "up");
    loadNotes();
 });

const btnSortByCreatedate = document.querySelector("#btn-filter-created");
btnSortByCreatedate.addEventListener("click", () => { 
    setSortOrder("noteDate", "up");
    loadNotes();
 });

const btnSortByImportance = document.querySelector("#btn-filter-importance");
btnSortByImportance.addEventListener("click", () => { 
    setSortOrder("importance", "dn");
    loadNotes();
 });

function loadNotes() {
    const noteTemplate = document.querySelector('#note-template').innerHTML;
    const render = Handlebars.compile(noteTemplate);

    $.get("/notes?sort="+sortBy+"&direction="+sortDirection, function(data) {
        
        const notes = [];
        for(const note of data) {
            notes.push(note);        
        }
        
        const dt = { "notes":  notes };
        const noteData = render(dt);
        
        document.querySelector('notes').innerHTML = "";
        document.querySelector('notes').innerHTML += noteData;
    });
}

Handlebars.registerHelper('renderImportance', (importance) => {
    let result = '';
    for (let i = 1; i <= 5; i++) {
      let on = importance >= i ? 'on' : 'off';
      result += `<img src="assets/img/flash-${on}.png" class="img-flash" data-id="${i}" />`;
    }
    return new Handlebars.SafeString(result);
});
  
let sortBy = "duedate";
let sortDirection = "dn";
function setSortOrder(sort, dir) {
    if(sort == sortBy) {
        sortDirection = sortDirection == "dn" ? "up" : "dn";
    } else {
        sortBy = sort;
        sortDirection = dir;
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    loadNotes();
});