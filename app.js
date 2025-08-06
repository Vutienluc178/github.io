// ==== 1. Bộ dữ liệu slide mẫu ban đầu ====
let slides = [
    {
        type: 'theory',
        title: "Định nghĩa Đạo hàm",
        content: "Nếu hàm số $f(x)$ xác định trên khoảng chứa $x_0$ thì đạo hàm tại $x_0$ là:<br>$$f'(x_0)=\\lim_{h\\to 0}\\frac{f(x_0+h)-f(x_0)}{h}$$"
    },
    {
        type: 'example',
        title: "Ví dụ",
        content: "Tính đạo hàm của $f(x)=x^2$ tại $x=1$.<br><i>Lời giải:</i> $$f'(x)=2x;\\quad f'(1)=2$$"
    },
    {
        type: 'quiz',
        title: "Câu hỏi kiểm tra",
        content: "", // Quiz ở slide này
        quizQuestion: "Đạo hàm của $f(x)=x^2$ là gì?",
        quizOptions: ["$x$", "$2x$", "$x^2$", "$2$"],
        quizAnswer: 1
    },
    {
        type: 'theory',
        title: "Hệ thức Vi-et",
        content: "Cho phương trình $ax^2+bx+c=0$ ($a\\ne0$), khi có nghiệm $x_1, x_2$ thì:<br>$$\\begin{aligned} x_1 + x_2 &= -\\frac{b}{a} \\\\ x_1 x_2 &= \\frac{c}{a} \\end{aligned}$$"
    }
];
let currentSlide = 0;

function renderSlide(idx) {
    if(slides.length === 0){
        document.getElementById('slideArea').innerHTML = `<em>Chưa có nội dung. Hãy import file Excel để thêm bài giảng!</em>`;
        document.getElementById('slideIndex').textContent = "";
        return;
    }
    let s = slides[idx];
    let html = `<h2>${s.title||''}</h2><div class="slide-content">${s.content||''}</div>`;
    // Nếu là slide quiz thì hiện quiz ngay trên slide
    if (s.type==='quiz' && s.quizQuestion && s.quizOptions) {
        html += `<div class="slide-quiz"><b>Câu hỏi:</b> <span class="math">${s.quizQuestion}</span><br>`;
        s.quizOptions.forEach((opt, oid) => {
            html += `<label><input type="radio" name="qSlide${idx}" value="${oid}"> <span class="math">${opt}</span></label>`;
        });
        html += `<button onclick="gradeSlideQuiz(${idx})" class="btn btn-sm">Nộp câu này</button>`;
        html += `<div id="slideQuizResult${idx}"></div></div>`;
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
    let s = slides[idx];
    let checked = document.querySelector(`input[name="qSlide${idx}"]:checked`);
    let res = '';
    if (checked) {
        if (Number(checked.value)===s.quizAnswer) res = `<span style="color:green;">✔ Đúng!</span>`;
        else res = `<span style="color:red;">✘ Sai!</span>`;
    } else res = 'Chọn một đáp án!';
    document.getElementById('slideQuizResult'+idx).innerHTML = res;
}

// ==== 2. Gọi slide đầu và phím chuyển slide ====
window.addEventListener('DOMContentLoaded', function(){
    renderSlide(currentSlide);
});
document.addEventListener('keydown', function(e){
    if (e.key==='ArrowRight') nextSlide();
    if (e.key==='ArrowLeft') prevSlide();
});

// ==== 3. Import bài giảng từ file Excel ====
document.getElementById('slideImport').addEventListener('change', function(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        let data = evt.target.result;
        let workbook = XLSX.read(data, {type: 'binary'});
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let json = XLSX.utils.sheet_to_json(sheet, {header:1});
        // json[0]: Tiêu đề cột
        // Giả định: Loại,Tiêu đề,Nội dung,Quiz question,Quiz options (phân tách bằng |),Đáp án
        slides = [];
        for(let i=1;i<json.length;i++) {
            let row = json[i];
            if(!row[0]) continue; // bỏ dòng trống
            if(row[0]==='quiz') {
                slides.push({
                    type: 'quiz',
                    title: row[1] || '',
                    content: row[2] || '',
                    quizQuestion: row[3] || '',
                    quizOptions: (row[4]||'').split('|').map(x=>x.trim()),
                    quizAnswer: Number(row[5])
                });
            } else {
                slides.push({
                    type: row[0],
                    title: row[1] || '',
                    content: row[2] || ''
                });
            }
        }
        currentSlide = 0;
        renderSlide(currentSlide);
        alert("Đã import xong " + slides.length + " slide!");
    };
    reader.readAsBinaryString(file);
});
