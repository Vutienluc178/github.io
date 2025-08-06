// ==== 1. Logic chuyển tab ====
function showTab(tab) {
    document.getElementById('quizTab').style.display = tab==='quiz'?'':'none';
    document.getElementById('flashcardTab').style.display = tab==='flashcard'?'':'none';
}
showTab('quiz'); // Mặc định

// ==== 2. Bộ câu hỏi Quiz mẫu (thay nội dung thoải mái) ====
const quizQuestions = [
    {
        question: "Số nguyên tố nhỏ nhất là?",
        options: ["1", "2", "3", "5"],
        answer: 1
    },
    {
        question: "Đạo hàm của hàm số $f(x) = x^2$ là?",
        options: ["$2x$", "$x$", "$x^2$", "$2$"],
        answer: 0
    },
    {
        question: "Ký hiệu của tập hợp số thực?",
        options: ["$\\mathbb{R}$", "$\\mathbb{Q}$", "$\\mathbb{N}$", "$\\mathbb{C}$"],
        answer: 0
    }
];

// ==== 3. Hiển thị quiz ====
function renderQuiz() {
    let quizArea = document.getElementById('quizArea');
    let html = '';
    quizQuestions.forEach((q, idx) => {
        html += `<div class="quiz-q">
            <div><b>Câu ${idx+1}:</b> <span class="math">${q.question}</span></div>`;
        q.options.forEach((opt, oid) => {
            html += `<label>
                <input type="radio" name="q${idx}" value="${oid}">
                <span class="math">${opt}</span>
            </label>`;
        });
        html += `</div>`;
    });
    quizArea.innerHTML = html;
    if(window.MathJax) MathJax.typesetPromise();
    document.getElementById('quizResult').textContent = '';
}
renderQuiz();

// ==== 4. Nộp bài và chấm điểm quiz ====
document.getElementById('submitQuizBtn').onclick = function() {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
        let checked = document.querySelector(`input[name="q${idx}"]:checked`);
        if (checked && Number(checked.value) === q.answer) score++;
    });
    let result = `Bạn đúng ${score}/${quizQuestions.length} câu (${Math.round(score/quizQuestions.length*100)}%)`;
    document.getElementById('quizResult').textContent = result;
};

// ==== 5. Bộ flashcard mẫu ====
const flashcards = [
    { front: "Định nghĩa đạo hàm", back: "$$f'(x)=\\lim_{h\\to 0} \\frac{f(x+h)-f(x)}{h}$$" },
    { front: "Hệ thức Vi-et cho $ax^2+bx+c=0$ ($a\\ne0$)", back: "$$\\begin{aligned} x_1+x_2&=-\\frac{b}{a} \\\\ x_1x_2&=\\frac{c}{a} \\end{aligned}$$" },
    { front: "Công thức lượng giác: $\\sin^2 x + \\cos^2 x = $", back: "$$1$$" }
];
let flashIdx = 0, isFlipped = false;

// ==== 6. Hiển thị flashcard ====
function showFlashcard(idx) {
    let f = flashcards[idx];
    document.getElementById('flashcardFront').innerHTML = f.front;
    document.getElementById('flashcardBack').innerHTML = f.back;
    document.getElementById('flashcard').classList.toggle('flipped', isFlipped);
    if(window.MathJax) MathJax.typesetPromise();
}
showFlashcard(flashIdx);

// ==== 7. Điều khiển flashcard ====
function flipFlashcard() {
    isFlipped = !isFlipped;
    document.getElementById('flashcard').classList.toggle('flipped', isFlipped);
}
function nextFlashcard() {
    flashIdx = (flashIdx+1)%flashcards.length;
    isFlipped = false;
    showFlashcard(flashIdx);
}
function prevFlashcard() {
    flashIdx = (flashIdx-1+flashcards.length)%flashcards.length;
    isFlipped = false;
    showFlashcard(flashIdx);
}

window.flipFlashcard = flipFlashcard;
window.nextFlashcard = nextFlashcard;
window.prevFlashcard = prevFlashcard;
window.showTab = showTab;
