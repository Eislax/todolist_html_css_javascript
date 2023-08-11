//mapping dengan elemen yang ada di html dan css (kayak di android studio)
const taskInput = document.querySelector(".task-input input"); //memilih elemen input dengan tipe teks dalam elemen div dengan kelas task-input
const addButton = document.getElementById("addButton"); //memilih elemen button dengan id addButton
const filters = document.querySelectorAll(".filters span"); //memilih semua elemen span dalam elemen div dengan kelas filters
const deleteAll = document.querySelector(".delete-btn"); //memilih elemen button dengan kelas delete-btn
const taskBox = document.querySelector(".task-box"); //memilih elemen ul dengan kelas task-box


let editId; //variabel untuk menyimpan id tugas yang sedang diedit
let isEditTask = false; //variabel untuk menyimpan status apakah sedang mengedit tugas atau tidak
let todos = JSON.parse(localStorage.getItem("todo-list")); //variabel untuk menyimpan daftar tugas-tugas dari local storage dalam bentuk objek JavaScript


function showTodo(filter) { //mendefinisikan fungsi showTodo dengan parameter filter
    let liTag = ""; //membuat variabel liTag untuk menyimpan elemen-elemen li
    if(todos) { //mengecek apakah ada data di local storage
        todos.forEach((todo, id) => { //looping pada setiap objek dalam array todos
            let completed = todo.status == "completed" ? "checked" : ""; //membuat variabel completed untuk menyimpan nilai checked jika status tugas adalah completed atau string kosong jika tidak
            if(filter == todo.status || filter == "all") { //mengecek apakah status tugas sesuai dengan filter atau filter adalah all
                //menambahkan elemen li ke dalam variabel liTag dengan menggunakan template literal
                liTag += `<li class="task"> 
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="option">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task, please add some</span>`; //mengubah innerHTML dari elemen ul dengan kelas task-box menjadi variabel liTag atau span dengan teks You don't have any task here jika variabel liTag kosong
    let checkTask = taskBox.querySelectorAll(".task"); //membuat variabel checkTask untuk menyimpan koleksi elemen li dengan kelas task dalam elemen ul dengan kelas task-box
    !checkTask.length ? deleteAll.classList.remove("active") : deleteAll.classList.add("active"); //menambahkan atau menghapus kelas active pada elemen button dengan kelas delete-btn sesuai dengan kondisi jumlah elemen dalam koleksi checkTask
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow"); //menambahkan atau menghapus kelas overflow pada elemen ul dengan kelas task-box sesuai dengan kondisi tinggi dari elemen tersebut
}

showTodo("all"); //memanggil fungsi showTodo dengan parameter all

filters.forEach(btn => { //looping pada setiap elemen span dalam koleksi filters
    btn.addEventListener("click", () => { //menambahkan event listener pada setiap elemen span ketika diklik
        document.querySelector("span.active").classList.remove("active"); //menghapus kelas active dari span yang sedang aktif
        btn.classList.add("active"); //menambahkan kelas active pada span yang diklik
        showTodo(btn.id); //memanggil fungsi showTodo dengan parameter id dari span yang diklik
    });
});

function showMenu(selectedTask) { //mendefinisikan fungsi showMenu dengan parameter selectedTask
    let menuDiv = selectedTask.parentElement.lastElementChild; //mengambil elemen ul terakhir dalam elemen div parent dari selectedTask dan menyimpannya dalam variabel menuDiv
    menuDiv.classList.add("show"); //menambahkan kelas show pada menuDiv untuk menampilkan menu opsi untuk tugas terpilih
    document.addEventListener("click", e => { //menambahkan event listener pada document untuk menghapus kelas show dari menuDiv ketika pengguna mengklik di luar menuDiv atau mengklik ikon lain
        if(e.target.tagName != "I" || e.target != selectedTask) { //mengecek apakah elemen yang diklik bukan elemen i atau bukan selectedTask
            menuDiv.classList.remove("show"); //menghapus kelas show dari menuDiv
        }
    });
}


function updateStatus(selectedTask) { //mendefinisikan fungsi updateStatus dengan parameter selectedTask
    let taskName = selectedTask.parentElement.lastElementChild; //mengambil elemen p dalam elemen label parent dari selectedTask dan menyimpannya dalam variabel taskName
    if(selectedTask.checked) { //mengecek apakah selectedTask dicentang
        taskName.classList.add("checked"); //menambahkan kelas checked pada taskName
        todos[selectedTask.id].status = "completed"; //mengubah status tugas terpilih menjadi completed di dalam array todos
    } else { //jika tidak dicentang
        taskName.classList.remove("checked"); //menghapus kelas checked dari taskName
        todos[selectedTask.id].status = "pending"; //mengubah status tugas terpilih menjadi pending di dalam array todos
    }
    localStorage.setItem("todo-list", JSON.stringify(todos)); //menyimpan array todos ke dalam local storage dengan menggunakan metode JSON.stringify untuk mengubah array menjadi string JSON
}


function editTask(taskId, textName) { //mendefinisikan fungsi editTask dengan parameter taskId dan textName
    editId = taskId; //menyimpan taskId ke dalam variabel editId
    isEditTask = true; //mengubah nilai variabel isEditTask menjadi true
    taskInput.value = textName; //mengubah nilai dari elemen input dengan kelas task-input menjadi textName
    taskInput.focus(); //memberikan fokus pada elemen input dengan kelas task-input
    addButton.innerHTML = "Update"; // Mengubah teks tombol menjadi "Update"
}


function deleteTask(deleteId, filter) { //mendefinisikan fungsi deleteTask dengan parameter deleteId dan filter
    isEditTask = false; //mengubah nilai variabel isEditTask menjadi false
    todos.splice(deleteId, 1); //menghapus objek dengan index deleteId dari array todos
    localStorage.setItem("todo-list", JSON.stringify(todos)); //menyimpan array todos ke dalam local storage dengan menggunakan metode JSON.stringify untuk mengubah array menjadi string JSON
    showTodo(filter); //memanggil fungsi showTodo dengan parameter filter untuk menampilkan daftar tugas-tugas sesuai dengan filter yang dipilih oleh pengguna
}


deleteAll.addEventListener("click", () => { //menambahkan event listener pada elemen button dengan kelas delete-btn ketika diklik
    isEditTask = false; //mengubah nilai variabel isEditTask menjadi false
    todos.splice(0, todos.length); //menghapus semua objek dari array todos
    localStorage.setItem("todo-list", JSON.stringify(todos)); //menyimpan array todos ke dalam local storage dengan menggunakan metode JSON.stringify untuk mengubah array menjadi string JSON
    showTodo(); //memanggil fungsi showTodo tanpa parameter untuk menampilkan daftar tugas-tugas tanpa filter
});


addButton.addEventListener("click", () => {
    let userTask = taskInput.value.trim();
    if (userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos; //membuat variabel todos menjadi array kosong jika tidak ada data di local storage, atau array yang berisi data dari local storage jika ada
            let taskInfo = {name: userTask, status: "pending"}; //membuat objek taskInfo yang berisi nama dan status tugas dari userTask, yaitu pending
            todos.push(taskInfo); //menambahkan objek taskInfo ke dalam array todos
        } else {
            isEditTask = false; //mengubah nilai variabel isEditTask menjadi false
            todos[editId].name = userTask; //mengubah nama tugas dengan index editId di dalam array todos menjadi userTask
        }
            taskInput.value = "";
            addButton.innerHTML = "Add Task"; // Mengubah teks tombol kembali menjadi "Add Task"
            localStorage.setItem("todo-list", JSON.stringify(todos));
            showTodo(document.querySelector("span.active").id);
    }
});