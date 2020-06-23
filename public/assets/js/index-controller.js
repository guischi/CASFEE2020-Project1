let editMode = false;

let importance = 0;
function setImportance(rating) {
    for(let i=1;i<=5;i++) {
        if(i<=rating) {
            document.querySelector("#importance-"+i).src = "./assets/img/flash-on.png";
        } else {
            document.querySelector("#importance-"+i).src = "./assets/img/flash-off.png";
        }
    }
    importance = rating;
}

document.querySelectorAll(".img-flash").forEach(flash => 
    flash.addEventListener("click", (e) => {
        setImportance(e.target.dataset.id);
    })
);

document.querySelector("#btn-new-note").addEventListener("click", () => { 
    editMode = false;
    showAddNoteForm();
});

document.querySelector("#btn-cancel").addEventListener("click", () => { 
    showAddNoteForm();
});

document.querySelector("darkener").addEventListener("click", () => { 
    showAddNoteForm();
});

function showAddNoteForm() {
    document.querySelector("darkener").classList.toggle("show");
    document.querySelector("addnote").classList.toggle("show");
}

document.querySelector("#btn-save-note").addEventListener("click", () => {    
    saveNote();
});

function saveNote() {
    let valTitle = document.querySelector('input[name="title"]').value;
    let valDescription = document.querySelector('textarea[name="description"]').value;
    let valDueDate = document.querySelector('input[name="duedate"]').value;

    if(!editMode) {
        $.post("/notes", {
            title: valTitle,
            dueDate: valDueDate,
            importance: importance,
            description: valDescription        
        }, function(data) {
            console.log(data);
            showAddNoteForm();
            loadNotes();
        });
    } else {
        let id = document.querySelector('input[name="id"]').value;
        $.post("/notes/"+id, {
            title: valTitle,
            dueDate: valDueDate,
            importance: importance,
            description: valDescription        
        }, function(data) {
            console.log(data);
            showAddNoteForm();
            loadNotes();
        });
    }  
}

document.querySelector("#btn-filter-duedate").addEventListener("click", () => { 
    setSortOrder("dueDate", 1);
    loadNotes();
});

document.querySelector("#btn-filter-created").addEventListener("click", () => { 
    setSortOrder("createDate", 1);
    loadNotes();
});

document.querySelector("#btn-filter-importance").addEventListener("click", () => { 
    setSortOrder("importance", -1);
    loadNotes();
});

function initNotesUI() {
    document.querySelectorAll(".btn-edit").forEach(btnEdit => 
        btnEdit.addEventListener("click", (e) => {
            getOneNote(e.target.dataset.id);
        })
    );
}

 function getOneNote(id) {
    $.get("/notes/"+id, function(data) {
        document.querySelector('input[name="id"]').value = id;
        document.querySelector("#txt-title").value = data.title;
        document.querySelector("#txt-description").value = data.description;
        document.querySelector("#dat-due-date").value = data.dueDate.split("T")[0];
        for(let i=1;i<=5;i++) {
            if(i<=data.importance) {
                document.querySelector("#importance-"+i).src = "./assets/img/flash-on.png";
            } else {
                document.querySelector("#importance-"+i).src = "./assets/img/flash-off.png";
            }
        }
        importance = data.importance;
        editMode = true;
        showAddNoteForm();
    });
 }


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

        initNotesUI();
    });
}

Handlebars.registerHelper('renderImportance', (importance) => {
    let result = '';
    for (let i = 1; i <= 5; i++) {
      let on = importance >= i ? 'on' : 'off';
      result += `<img src="assets/img/flash-${on}.png" class="img-flash" />`;
    }
    return new Handlebars.SafeString(result);
});
  
let sortBy = "dueDate";
let sortDirection = 1;
function setSortOrder(sort, dir) {
    if(sort == sortBy) {
        sortDirection = sortDirection * -1;
    } else {
        sortBy = sort;
        sortDirection = dir;
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    loadNotes();
});