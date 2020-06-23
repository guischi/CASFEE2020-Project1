import {themeSwitcher} from './ui/theme-switcher.js';
import {notesController} from './notes-controller.js';
import moment from './ext/moment/moment.js';
 
themeSwitcher.init();

// handle sorting
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

function loadNotes() {
    const noteTemplate = document.querySelector('#note-template').innerHTML;
    const render = Handlebars.compile(noteTemplate);

    notesController.getAllNotes(sortBy, sortDirection, (data) => {
        if(data.length > 0) {
            const notes = [];
            for(const note of data) {
                note.dueDateFromNow = moment(note.dueDate).fromNow();
                note.dueDate = moment(note.dueDate).format('DD.MM.YYYY');
                note.createDateFromNow = moment(note.createDate).fromNow(); 
                note.createDate = moment(note.createDate).format('DD.MM.YYYY');               
                note.finishDate = moment(note.finishDate).fromNow();
                notes.push(note);        
            }
            
            const dt = { "notes":  notes };
            const noteData = render(dt);
            
            document.querySelector('notes').innerHTML = "";
            document.querySelector('notes').innerHTML += noteData;

            initNotesUI();
        }
    });

    document.querySelector('#btn-filter-dueDate').value = `By due date`;
    document.querySelector('#btn-filter-createDate').value = `By create date`;
    document.querySelector('#btn-filter-importance').value = `By importance`;
    const direction = sortDirection == 1 ? '↑' : '↓';
    document.querySelector('#btn-filter-'+sortBy).value = `By ${sortBy.replace("D", " d")} ${direction}`;
}

function saveNote() {
    let note = {
        title : document.querySelector('input[name="title"]').value,
        importance : document.querySelector('input[name="importance"]').value,
        dueDate : document.querySelector('input[name="duedate"]').value,
        description : document.querySelector('textarea[name="description"]').value   
    };

    if(notesController.editMode == true) {
        note._id = document.querySelector('input[name="id"]').value;
    } 

    notesController.saveNote(note, (data) => {
        showAddNoteForm();
        clearAddNoteForm();
        loadNotes();
    });
}

function initNotesUI() {
    document.querySelectorAll(".btn-edit").forEach(btnEdit => 
        btnEdit.addEventListener("click", (e) => {
            notesController.getOneNote(e.target.dataset.id, (data) => {
                document.querySelector('input[name="id"]').value = data._id;
                document.querySelector("#txt-title").value = data.title;
                document.querySelector("#txt-description").value = data.description;
                document.querySelector("#dat-due-date").value = data.dueDate.split("T")[0];
                setImportance(data.importance);
                showAddNoteForm();
            });
            
        })
    );

    document.querySelectorAll(".chk-finished").forEach(chkFinish => 
        chkFinish.addEventListener("click", (e) => {
            notesController.setFinished(e.target.dataset.id, (data) => {
                loadNotes();
            });
        })
    );
}

function clearAddNoteForm() {
    document.querySelector("#txt-title").value = "";
    document.querySelector("#txt-description").value = "";
    document.querySelector("#dat-due-date").value = "";
    setImportance(0);
}

function showAddNoteForm() {
    document.querySelector("darkener").classList.toggle("show");
    document.querySelector("addnote").classList.toggle("show");
}

function setImportance(rating) {
    for(let i=1;i<=5;i++) {
        if(i<=rating) {
            document.querySelector("#importance-"+i).src = "./assets/img/flash-on.png";
        } else {
            document.querySelector("#importance-"+i).src = "./assets/img/flash-off.png";
        }
    }
    document.querySelector('input[name="importance"]').value = rating;
}

document.querySelector("#btn-filter-dueDate").addEventListener("click", () => { 
    setSortOrder("dueDate", 1);
    loadNotes();
});

document.querySelector("#btn-filter-createDate").addEventListener("click", () => { 
    setSortOrder("createDate", 1);
    loadNotes();
});

document.querySelector("#btn-filter-importance").addEventListener("click", () => { 
    setSortOrder("importance", -1);
    loadNotes();
});

document.querySelector("#btn-new-note").addEventListener("click", () => { 
    notesController.editMode = false;
    showAddNoteForm();
});

document.querySelector("#lnk-new-note").addEventListener("click", (e) => { 
    e.preventDefault();
    notesController.editMode = false;
    showAddNoteForm();
});

document.querySelector("#btn-cancel").addEventListener("click", () => { 
    showAddNoteForm();
});

document.querySelector("darkener").addEventListener("click", () => { 
    showAddNoteForm();
});

document.querySelectorAll(".img-flash").forEach(flash => 
    flash.addEventListener("click", (e) => {
        setImportance(e.target.dataset.id);
    })
);

document.querySelector("#btn-save-note").addEventListener("click", () => {
   saveNote();
});

// init application
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    loadNotes();
});