const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

let tasks = []; // Yapılacak görevleri saklayacağımız boş bir dizi

function addTask() {
    const taskText = taskInput.value.trim(); // Metin kutusundaki değeri al ve boşlukları temizle

    if (taskText !== '') {
        const newTask = {
            id: Date.now(), // Her görev için benzersiz bir ID oluştur
            text: taskText,
            completed: false // Başlangıçta görev tamamlanmamış olarak işaretlenir
        };

        tasks.push(newTask); // Yeni görevi görevler dizisine ekle
        renderTasks(); // Görev listesini ekrana yeniden çizdir
        taskInput.value = ''; // Metin kutusunu temizle
    }
}

addButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

function renderTasks() {
    taskList.innerHTML = ''; // Önce mevcut liste içeriğini temizle

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="actions">
                <button class="complete-button"><i class="fas fa-check"></i></button>
                <button class="delete-button"><i class="fas fa-trash"></i></button>
            </div>
        `;
        listItem.dataset.taskId = task.id; // Her liste öğesine görev ID'sini saklamak için bir data attribute ekle
        taskList.appendChild(listItem);
    });

    addEventListenersToTasks(); // Görevlere tamamlandı ve silme olay dinleyicilerini ekle
}

function addEventListenersToTasks() {
    const completeButtons = document.querySelectorAll('.complete-button');
    const deleteButtons = document.querySelectorAll('.delete-button');

    completeButtons.forEach(button => {
        button.addEventListener('click', completeTask);
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteTask);
    });
}

function completeTask(event) {
    const clickedButton = event.target; // Tıklanan butonu al
    const listItem = clickedButton.closest('li'); // Butonun ait olduğu liste öğesini bul
    const taskId = listItem.dataset.taskId; // Liste öğesinden görev ID'sini al

    tasks = tasks.map(task => {
        if (task.id === parseInt(taskId)) {
            return { ...task, completed: !task.completed }; // Görevin tamamlanma durumunu tersine çevir
        }
        return task;
    });

    renderTasks(); // Görev listesini yeniden çizdir
}

function deleteTask(event) {
    const clickedButton = event.target; // Tıklanan butonu al
    const listItem = clickedButton.closest('li'); // Butonun ait olduğu liste öğesini bul
    const taskId = listItem.dataset.taskId; // Liste öğesinden görev ID'sini al

    tasks = tasks.filter(task => task.id !== parseInt(taskId)); // Tıklanan görevin ID'sine sahip olmayan görevleri filtreleyerek yeni bir dizi oluştur

    renderTasks(); // Görev listesini yeniden çizdir
}

const translations = {
    tr: {
        title: 'Yapılacaklar Listesi',
        addTaskPlaceholder: 'Yeni görev ekle...',
        addButtonText: 'Ekle',
        emptyListText: 'Henüz görev yok.',
        completeButtonTooltip: 'Tamamlandı',
        deleteButtonTooltip: 'Sil'
    },
    en: {
        title: 'To-Do List',
        addTaskPlaceholder: 'Add new task...',
        addButtonText: 'Add',
        emptyListText: 'No tasks yet.',
        completeButtonTooltip: 'Complete',
        deleteButtonTooltip: 'Delete'
    }
};

let currentLanguage = 'tr'; // Başlangıç dili olarak Türkçe'yi ayarlıyoruz

function updateText() {
    const lang = translations[currentLanguage];
    document.title = lang.title;
    document.querySelector('h1').textContent = lang.title;
    taskInput.placeholder = lang.addTaskPlaceholder;
    addButton.textContent = lang.addButtonText;

    const listItems = taskList.querySelectorAll('li');
    listItems.forEach(item => {
        const completeButton = item.querySelector('.complete-button');
        const deleteButton = item.querySelector('.delete-button');
        if (completeButton) completeButton.title = lang.completeButtonTooltip;
        if (deleteButton) deleteButton.title = lang.deleteButtonTooltip;
    });

    if (tasks.length === 0 && taskList.innerHTML === '') {
        taskList.innerHTML = `<li class="empty-message">${lang.emptyListText}</li>`;
    } else if (tasks.length > 0 && taskList.querySelector('.empty-message')) {
        renderTasks(); // Eğer görev eklenirse boş mesajı kaldır ve listeyi yeniden çiz
    }
}

const trBtn = document.getElementById('trBtn');
const enBtn = document.getElementById('enBtn');

trBtn.addEventListener('click', () => {
    currentLanguage = 'tr';
    trBtn.classList.add('active');
    enBtn.classList.remove('active');
    updateText();
});

enBtn.addEventListener('click', () => {
    currentLanguage = 'en';
    enBtn.classList.add('active');
    trBtn.classList.remove('active');
    updateText();
});

// Sayfa yüklendiğinde başlangıç dilini ayarla ve metinleri güncelle
updateText();