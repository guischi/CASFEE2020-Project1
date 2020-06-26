import {themeSwitcher} from './ui/theme-switcher.js';
import {notesController} from './notes-controller.js';
import moment from './ext/moment/moment.js';
 
themeSwitcher.init();

const filters = [ 'dueDate', 'createDate', 'importance' ];

// handle sorting
let sortBy = filters[0];
let sortDirection = 1;
function setSortOrder(sort, dir) {
    if(sort == sortBy) {
        sortDirection = sortDirection * -1;
    } else {
        sortBy = sort;
        sortDirection = dir;
    }
}

// load notes
function loadNotes() {
    const noteTemplate = document.querySelector('#note-template').innerHTML;
    const render = Handlebars.compile(noteTemplate);

    notesController.getAllNotes(sortBy, sortDirection, (data) => {
        

        const notes = [];
        for(const note of data) {
            if(moment(note.dueDate).format('YYYY') == '2999') {
                note.dueDate = 'Whenever there is time';
            } else {
                note.dueDateFromNow = `(${moment(note.dueDate).fromNow()})`;
                note.dueDate = moment(note.dueDate).format('DD.MM.YYYY');
            }
            note.createDateFromNow = moment(note.createDate).fromNow(); 
            note.createDate = moment(note.createDate).format('DD.MM.YYYY');               
            note.finishDate = moment(note.finishDate).fromNow();
            note.description = note.description.replace(/(?:\r\n|\r|\n)/g, '<br>');
            notes.push(note);        
        }
        
        const dt = { "notes":  notes };
        const noteData = render(dt);
        
        document.querySelector('notes').innerHTML = "";
        document.querySelector('notes').innerHTML += noteData;

        if(data.length == 0) {
            document.querySelector('notes').innerHTML = 'No notes have been created, yet. <a href="#" id="lnk-new-note">Create one now</a>.';
            document.querySelector("#lnk-new-note").addEventListener("click", (e) => { 
                e.preventDefault();
                notesController.editMode = false;
                showAddNoteForm();
            });
        }

        initNotesUI();
        activateHideFinishedBtn(); 
    });

    for(const f of filters) {
        let btn = document.querySelector('#btn-filter-' + f);
        btn.value = `By ${f.replace("D", " d")}`;
        btn.classList.remove('active');
    }
    const direction = sortDirection == 1 ? '↑' : '↓';
    const btn = document.querySelector('#btn-filter-'+sortBy);
    btn.value = `By ${sortBy.replace("D", " d")} ${direction}`;
    btn.classList.add('active');
}

// save note
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
        resetAddNoteForm();
        loadNotes();
    });
}

// init ui controls of notes (edit button, finished checkbox)
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

// set display state for "hide finished" button
function activateHideFinishedBtn() {
    const btn = document.querySelector("#btn-filter-finished");
    btn.classList.remove('active');
    if(!notesController.showFinished) {
        btn.classList.add('active');
    }   
}

// reset the note form (after save)
function resetAddNoteForm() {
    document.querySelector("#txt-title").value = "";
    document.querySelector("#txt-description").value = "";
    document.querySelector("#dat-due-date").value = "";
    setImportance(0);
}

// show/hide note form
function showAddNoteForm() {
    document.querySelector("darkener").classList.toggle("show");
    document.querySelector("addnote").classList.toggle("show");
}

// set note importance
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

// ui listeners
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

document.querySelector("#btn-filter-finished").addEventListener("click", (e) => { 
    notesController.showFinished = !notesController.showFinished;    
    loadNotes();
});

document.querySelector("#btn-new-note").addEventListener("click", () => { 
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

// init application and load all notes
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    loadNotes();
});