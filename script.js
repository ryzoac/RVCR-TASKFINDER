// ==========================================
// RVCR TASKFINDER
// PERFORMANCE TASK LIBRARY
// ==========================================


// SAMPLE PERFORMANCE TASKS
// These are demonstration entries, not verified professor assignments.

// CURRENT USER ROLE
let currentUserRole = window.taskfinderUserRole || null;
let currentUserStatus = window.taskfinderUserStatus || null;

window.addEventListener("taskfinder-role-ready", (event) => {
    currentUserRole = event.detail.role;
    currentUserStatus = event.detail.status;

    searchTasks();
});

const tasks = [
    {
        id: 1,
        title: "Pagsusuri sa Kasaysayan ng Pilipinas",
        category: "essay",
        categoryName: "Sanaysay",
        description: "Suriin ang mahahalagang pangyayari na humubog sa kasaysayan ng Pilipinas.",
        instructions: [
            "Magsagawa ng pananaliksik tungkol sa kasaysayan ng Pilipinas.",
            "Pumili ng tatlong mahahalagang pangyayari.",
            "Ipaliwanag ang epekto ng mga pangyayaring ito sa lipunang Pilipino.",
            "Gumawa ng sariling kongklusyon."
        ],
        deadline: "Walang itinakdang petsa",
        author: "TASKFINDER DEMO"
    },

    {
        id: 2,
        title: "Kultura at Tradisyon ng mga Pilipino",
        category: "research",
        categoryName: "Pananaliksik",
        description: "Magsaliksik tungkol sa mga kultura at tradisyong nagpapakilala sa mga Pilipino.",
        instructions: [
            "Pumili ng isang kulturang Pilipino.",
            "Alamin ang pinagmulan at kasaysayan nito.",
            "Ipaliwanag ang kahalagahan nito sa kasalukuyang panahon.",
            "Magbigay ng mga mapagkakatiwalaang sanggunian."
        ],
        deadline: "Walang itinakdang petsa",
        author: "TASKFINDER DEMO"
    },

    {
        id: 3,
        title: "Pagbabago ng Lipunang Pilipino",
        category: "presentation",
        categoryName: "Presentasyon",
        description: "Talakayin ang mga pagbabagong naganap sa lipunang Pilipino sa iba't ibang panahon.",
        instructions: [
            "Pumili ng isang panahon sa kasaysayan ng Pilipinas.",
            "Tukuyin ang mga pagbabagong panlipunan.",
            "Maghanda ng presentasyon.",
            "Ipaliwanag ang epekto ng mga pagbabagong ito."
        ],
        deadline: "Walang itinakdang petsa",
        author: "TASKFINDER DEMO"
    },

    {
        id: 4,
        title: "Mga Bayani ng Kasaysayang Pilipino",
        category: "project",
        categoryName: "Proyekto",
        description: "Kilalanin ang mga personalidad na nag-ambag sa kalayaan at pag-unlad ng bansa.",
        instructions: [
            "Pumili ng isang bayani ng Pilipinas.",
            "Magsaliksik tungkol sa kanyang buhay.",
            "Ilarawan ang kanyang mga kontribusyon.",
            "Ipaliwanag kung bakit mahalaga ang kanyang papel sa kasaysayan."
        ],
        deadline: "Walang itinakdang petsa",
        author: "TASKFINDER DEMO"
    },

    {
        id: 5,
        title: "Kolonyalismo at ang Pilipinas",
        category: "research",
        categoryName: "Pananaliksik",
        description: "Pag-aralan ang epekto ng kolonyalismo sa kultura, ekonomiya, at pamahalaan ng Pilipinas.",
        instructions: [
            "Talakayin ang panahon ng pananakop.",
            "Tukuyin ang mga pagbabagong naganap.",
            "Suriin ang epekto nito sa lipunang Pilipino.",
            "Magbigay ng sariling pagsusuri."
        ],
        deadline: "Walang itinakdang petsa",
        author: "TASKFINDER DEMO"
    },

    {
        id: 6,
        title: "Sanaysay: Pagkakakilanlang Pilipino",
        category: "essay",
        categoryName: "Sanaysay",
        description: "Sumulat ng sanaysay tungkol sa kahulugan at kahalagahan ng pagiging Pilipino.",
        instructions: [
            "Ipaliwanag ang konsepto ng pagkakakilanlang Pilipino.",
            "Talakayin ang papel ng kultura at kasaysayan.",
            "Magbigay ng mga halimbawa.",
            "Bumuo ng makabuluhang kongklusyon."
        ],
        deadline: "Walang itinakdang petsa",
        author: "TASKFINDER DEMO"
    }
];


// SELECT HTML ELEMENTS

const taskGrid = document.getElementById("taskGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyState = document.getElementById("emptyState");
const taskCount = document.getElementById("taskCount");

// FIRESTORE TASK STORAGE
let firestoreReady = false;
let tasksLoaded = false;

// CONNECT TO FIRESTORE
function connectTaskfinderFirestore() {

    const firestore = window.taskfinderFirestore;

    if (!firestore || firestoreReady) return;

    firestoreReady = true;

    const tasksRef = firestore.collection(firestore.db, "tasks");

    firestore.onSnapshot(tasksRef, (snapshot) => {

        tasks.splice(
            0,
            tasks.length,
            ...snapshot.docs.map(taskDoc => ({
                id: taskDoc.id,
                ...taskDoc.data()
            }))
        );

        tasksLoaded = true;

        // UPDATE TASK COUNTER
        taskCount.textContent = tasks.length;

        searchTasks();

        console.log("Firestore tasks synchronized!");

    }, (error) => {
        console.error("Firestore Error:", error);
    });
}

window.addEventListener(
    "taskfinder-firestore-ready",
    connectTaskfinderFirestore
);

connectTaskfinderFirestore();

// DISPLAY TASKS

function displayTasks(taskList) {

    taskGrid.innerHTML = "";

    if (taskList.length === 0) {
        emptyState.style.display = "block";
        taskGrid.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    taskGrid.style.display = "grid";

    taskList.forEach(task => {

        const card = document.createElement("div");

        card.className = "task-card";

        card.innerHTML = `
            <div class="task-top">
                <span class="task-category">
                    ${task.categoryName || "Uncategorized"}
                </span>

                <span class="task-date">
                    <i data-lucide="file-text"></i>
                </span>
            </div>

            <h3>${task.title}</h3>

            <p>${task.description}</p>

            <div class="task-bottom">
                <span>${task.deadline || "Walang itinakdang petsa"}</span>

                <button class="view-task-btn">
                    Tingnan ang Gawain →
                </button>

                ${(currentUserRole === "admin" ||
                (currentUserRole === "teacher" && currentUserStatus === "approved"))
                    ? `<button class="delete-btn">Delete</button>`
                    : ""}
            </div>
        `;

        // VIEW BUTTON
        const viewButton = card.querySelector(".view-task-btn");

        viewButton.addEventListener("click", () => {
            viewTask(task.id);
        });

        // DELETE BUTTON
        const deleteButton = card.querySelector(".delete-btn");

        if (deleteButton) {
            deleteButton.addEventListener("click", () => {
                deleteTask(task.id);
            });
        }

        taskGrid.appendChild(card);

    });

    if (window.lucide) {
        lucide.createIcons();
    }

}

// SEARCH FUNCTION

function searchTasks() {

    const keyword = searchInput.value.toLowerCase().trim();

    const activeFilter = document.querySelector(".filter-btn.active");

    const selectedCategory = activeFilter
        ? activeFilter.dataset.filter
        : "all";

    const filteredTasks = tasks.filter(task => {

        const searchableText = [
            task.title,
            task.description,
            task.categoryName,
            ...task.instructions
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(keyword);

        const matchesCategory =
            selectedCategory === "all" ||
            task.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    displayTasks(filteredTasks);
}


// SEARCH BUTTON

searchBtn.addEventListener("click", searchTasks);


// SEARCH WHILE TYPING

searchInput.addEventListener("input", searchTasks);


// PRESS ENTER TO SEARCH

searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchTasks();
    }

});


// CATEGORY FILTERS

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        searchTasks();

    });

});


// VIEW TASK DETAILS

function viewTask(id) {

    const task = tasks.find(item => item.id === id);

    if (!task) return;

    let instructionsHTML = "";

    task.instructions.forEach(instruction => {

        instructionsHTML += `
            <li>${instruction}</li>
        `;

    });

    const modal = document.createElement("div");

    modal.className = "task-modal";

    modal.innerHTML = `
        <div class="modal-content">

            <button class="modal-close" aria-label="Isara">
                &times;
            </button>

            <span class="task-category">
                ${task.categoryName}
            </span>

            <h2>${task.title}</h2>

            <p class="modal-description">
                ${task.description}
            </p>

            <div class="modal-divider"></div>

            <h3>Mga Panuto</h3>

            <ol>
                ${instructionsHTML}
            </ol>

            <div class="modal-divider"></div>

            <p class="modal-deadline">
                <strong>Petsa ng Pagsusumite:</strong>
                ${task.deadline}
            </p>

            <p class="modal-author">
                <strong>Pinagmulan:</strong>
                ${task.author}
            </p>

            <p class="demo-notice">
                Paalala: Halimbawa lamang ang gawaing ito.
                Hindi ito beripikadong opisyal na takdang-aralin
                mula sa isang propesor.
            </p>

        </div>
    `;

    document.body.appendChild(modal);

    document.body.style.overflow = "hidden";

    function closeModal() {
        modal.remove();
        document.body.style.overflow = "";
    }

    modal.querySelector(".modal-close")
        .addEventListener("click", closeModal);

    modal.addEventListener("click", function(event) {

        if (event.target === modal) {
            closeModal();
        }

    });

    document.addEventListener("keydown", function handleEscape(event) {

        if (event.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", handleEscape);
        }

    });

}


// AUTOMATIC TASK COUNTER

taskCount.textContent = tasks.length;


// INITIALIZE WEBSITE

displayTasks(tasks);

console.log("TASKFINDER 2.0 successfully loaded!");
// ==========================================
// ADD PERFORMANCE TASK FUNCTION
// ==========================================

const addTaskBtn = document.getElementById("addTaskBtn");
const addTaskModal = document.getElementById("addTaskModal");
const closeAddModal = document.getElementById("closeAddModal");
const addTaskForm = document.getElementById("addTaskForm");

const categoryNames = {
    essay: "Sanaysay",
    research: "Pananaliksik",
    project: "Proyekto",
    presentation: "Presentasyon"
};

addTaskBtn.addEventListener("click", () => {
    addTaskModal.style.display = "flex";
});

closeAddModal.addEventListener("click", () => {
    addTaskModal.style.display = "none";
});

addTaskModal.addEventListener("click", (event) => {
    if (event.target === addTaskModal) {
        addTaskModal.style.display = "none";
    }
});

let isSavingTask = false;

addTaskForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (isSavingTask) return;

    isSavingTask = true;

    const submitButton = addTaskForm.querySelector('button[type="submit"]');

    if (submitButton) submitButton.disabled = true;

    try {

        const canAddTask =
            currentUserRole === "admin" ||
            (currentUserRole === "teacher" && currentUserStatus === "approved");

        if (!canAddTask) {
            alert("Wala kang permission na magdagdag ng Performance Task.");
            return;
        }

        const firestore = window.taskfinderFirestore;

        if (!firestore) {
            alert("Hindi pa konektado sa Firestore. Pakisubukang muli.");
            return;
        }

        const title = document.getElementById("newTitle").value.trim();
        const category = document.getElementById("newCategory").value;
        const description = document.getElementById("newDescription").value.trim();

        const instructions = document.getElementById("newInstructions").value
            .split("\n")
            .map(item => item.trim())
            .filter(item => item.length > 0);

        const deadlineValue = document.getElementById("newDeadline").value;

        if (!title || !description || instructions.length === 0) {
            alert("Pakikumpleto ang lahat ng kinakailangang impormasyon.");
            return;
        }

        const newTask = {
            title: title,
            category: category,
            categoryName: categoryNames[category],
            description: description,
            instructions: instructions,
            deadline: deadlineValue || "Walang itinakdang petsa",
            author: window.taskfinderUserName || "Unknown User",
            createdAt: firestore.serverTimestamp()
        };

        await firestore.addDoc(
            firestore.collection(firestore.db, "tasks"),
            newTask
        );

        addTaskForm.reset();
        addTaskModal.style.display = "none";

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        document.querySelector('[data-filter="all"]').classList.add("active");

        searchInput.value = "";

        alert("Matagumpay na naidagdag ang Performance Task!");

    } catch (error) {

        console.error("Error adding task:", error);
        alert("Hindi naidagdag ang task: " + error.message);

    } finally {

        isSavingTask = false;

        if (submitButton) submitButton.disabled = false;

    }

});

// DELETE PERFORMANCE TASK
async function deleteTask(id) {

    const canDeleteTask =
        currentUserRole === "admin" ||
        (currentUserRole === "teacher" && currentUserStatus === "approved");

    if (!canDeleteTask) {
        alert("Wala kang permission na mag-delete ng task.");
        return;
    }

    const confirmDelete = confirm(
        "Sigurado ka bang gusto mong burahin ang performance task na ito?"
    );

    if (!confirmDelete) return;

    const firestore = window.taskfinderFirestore;

    if (!firestore) {
        alert("Hindi konektado sa Firestore.");
        return;
    }

    try {

        await firestore.deleteDoc(
            firestore.doc(firestore.db, "tasks", id)
        );

        alert("Matagumpay na nabura ang performance task!");

    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Hindi nabura ang task: " + error.message);
    }
}

// LOGIN AND REGISTER MODALS

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");

const closeLoginModal = document.getElementById("closeLoginModal");
const closeRegisterModal = document.getElementById("closeRegisterModal");

// Buksan ang Login
loginBtn.addEventListener("click", function () {
    loginModal.style.display = "flex";
});

// Buksan ang Register
registerBtn.addEventListener("click", function () {
    registerModal.style.display = "flex";
});

// Isara ang Login
closeLoginModal.addEventListener("click", function () {
    loginModal.style.display = "none";
});

// Isara ang Register
closeRegisterModal.addEventListener("click", function () {
    registerModal.style.display = "none";
});

// Isara kapag pinindot ang labas ng pop-up
window.addEventListener("click", function (event) {
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }

    if (event.target === registerModal) {
        registerModal.style.display = "none";
    }
});