let draggedEl,
    onDragStart,
    onDrag,
    onDragEnd,
    grabPointY,
    grabPointX,
    createNote,
    addNoteBtnEl,
    deleteNote,
    getNoteObject,
    loadNotes,
    saveNote;


onDragStart = function (ev) {
    let boundingClientRect;
    if (ev.target.className.indexOf('bar') === -1) {
        return;
    }

    draggedEl = this;

    boundingClientRect = draggedEl.getBoundingClientRect();

    grabPointX = boundingClientRect.left - ev.clientX;
    grabPointY = boundingClientRect.top - ev.clientY;
};

onDrag = function (ev) {
    if (!draggedEl) {
        return;
    }

    let posX = ev.clientX + grabPointX,
        posY = ev.clientY + grabPointY;

    if (posX < 0) {
        posX = 0;
    }

    if (posY < 0) {
        posY = 0;
    }


    draggedEl.style.transform = "translateX(" + posX + "px) translateY(" + posY + "px)";
};

onDragEnd = function () {
    draggedEl = null;
    grabPointX = null;
    grabPointY = null;
};

getNoteObject = function(el) {
    let titleTextarea = el.querySelector(".titleText");
    let contentTextarea = el.querySelector(".contentText");
    return {
        transformCSSValue: el.style.transform,
        title: titleTextarea.value,
        content: contentTextarea.value,
        id: el.id,
        textarea: {
            width: contentTextarea.style.width,
            height: contentTextarea.style.height,
        }
    };
}

createNote = function (options) {
    let stickerEl = document.createElement('div'),
        barEl = document.createElement('div'),
        textareaEl = document.createElement('textarea'),
        barContainerEl = document.createElement("div"),
        titleTextareaEl = document.createElement("textarea"),
        deleteBtnEl = document.createElement("button"),
        noteConfig = options || {
            content: "",
            id: "sticker_" + new Date().getTime(),
        },
        onDelete,
        onSave;

    if (noteConfig.textarea) {
        textareaEl.style.width = noteConfig.textarea.width;
        textareaEl.style.height = noteConfig.textarea.height;
        textareaEl.style.resize = 'none';
    }

    onDelete = function () {
        deleteNote(
            getNoteObject(stickerEl)
        );

        document.body.removeChild(stickerEl);
    };

    onSave = function () {
        saveNote(
            getNoteObject(stickerEl)
        );
    };

    let transformCSSValue = "translateX(" + Math.random() * 400 + "px) translateY(" + Math.random() * 400 + "px)";

    stickerEl.style.transform = transformCSSValue;

    stickerEl.classList.add('sticker');
    barEl.classList.add('bar');
    barContainerEl.classList.add("barcontainer");
    deleteBtnEl.classList.add("close");
    textareaEl.classList.add("contentText");
    titleTextareaEl.classList.add("titleText");
    // textareaEl.innerHTML = "Edit text";
    // titleTextareaEl.innerHTML = "Edit title";

    stickerEl.appendChild(barEl);
    barEl.appendChild(barContainerEl);
    barContainerEl.appendChild(titleTextareaEl);
    barContainerEl.appendChild(deleteBtnEl);
    stickerEl.appendChild(textareaEl);

    stickerEl.addEventListener('mousedown', onDragStart, false);
    deleteBtnEl.addEventListener("click", onDelete, false);

    document.body.appendChild(stickerEl);
    console.log(stickerEl);
};

function testLocalStorage() {
    let test = "test";
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

function init() {
    if(!testLocalStorage()) {
        let message = "We are sorry, but you can not use local storage";
        console.log(message);

    } else {
        deleteNote = function(note) {
            localStorage.removeItem(note.id);
        };

        loadNotes = function() {
            for(let i = 0; i < localStorage.length; i++) {
                let noteObject = JSON.parse(
                    localStorage.getItem(
                        localStorage.key(i)
                    )
                )
                createNote(noteObject);
            }
        };
        loadNotes();
    }
    addNoteBtnEl = document.querySelector('.addNoteBtn');
    addNoteBtnEl.addEventListener('click', createNote, false);
    document.addEventListener('mousemove', onDrag, false);
    document.addEventListener('mouseup', onDragEnd, false);
}

init();