function renderSlide(idx) {
    let s = slides[idx];
    let html = `<h2>${s.title}</h2><div class="slide-content">${s.content||''}</div>`;
    // Nếu là slide quiz thì nhúng quiz vào luôn
    if (s.type==='quiz' && typeof s.quizIdx==='number' && quizQuestions[s.quizIdx]) {
        let q = quizQuestions[s.quizIdx];
        html += `<div class="slide-quiz"><b>Câu hỏi:</b> <span class="math">${q.question}</span><br>`;
        q.options.forEach((opt, oid) => {
            html += `<label><input type="radio" name="qSlide" value="${oid}"> <span class="math">${opt}</span></label><br>`;
        });
        html += `<button onclick="gradeSlideQuiz(${s.quizIdx})" class="btn btn-sm">Nộp câu này</button>`;
        html += `<div id="slideQuizResult"></div></div>`;
    }
    document.getElementById('slideArea').innerHTML = html;
    document.getElementById('slideIndex').textContent = `Trang ${idx+1}/${slides.length}`;
    if(window.MathJax) MathJax.typesetPromise();
}

function nextSlide() {
    if(currentSlide < slides.length-1) currentSlide++;
    renderSlide(currentSlide);
}
function prevSlide() {
    if(currentSlide > 0) currentSlide--;
    renderSlide(currentSlide);
}
function gradeSlideQuiz(idx) {
    let q = quizQuestions[idx];
    let checked = document.querySelector('input[name="qSlide"]:checked');
    let res = '';
    if (checked) {
        if (Number(checked.value)===q.answer) res = `<span style="color:green;">✔ Đúng!</span>`;
        else res = `<span style="color:red;">✘ Sai!</span>`;
    } else res = 'Chọn một đáp án!';
    document.getElementById('slideQuizResult').innerHTML = res;
}
