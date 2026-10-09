let questions = [];
async function loadQuestions() {
  const container = document.getElementById('quizContainer');

  if (!container) return;

  try {
    const response = await fetch('data/questions.json');

    questions = await response.json();

    renderQuiz();

    const total = document.getElementById('totalQuestion');

    if (total) {
      total.innerHTML = questions.length;
    }
  } catch (error) {
    container.innerHTML = `

        <div class="alert alert-danger">

            Không thể tải dữ liệu câu hỏi.

        </div>

        `;

    console.log(error);
  }
}
function renderQuiz() {
  const container = document.getElementById('quizContainer');

  if (!container) return;

  container.innerHTML = '';

  questions.forEach((question, index) => {
    let html = `

        <div class="card mb-4 fade-up">

            <div class="card-header bg-primary text-white">

                <h5>

                    Câu ${index + 1}. ${question.question}

                </h5>

            </div>

            <div class="card-body">

        `;

    question.options.forEach((option, i) => {
      html += `

            <div class="form-check">

                <input

                    class="form-check-input"

                    type="radio"

                    id="q${index}_${i}"

                    name="question${index}"

                    value="${i}">

                <label

                    class="form-check-label"

                    for="q${index}_${i}">

                    ${option}

                </label>

            </div>

            `;
    });

    html += `

            </div>

        </div>

        `;

    container.innerHTML += html;
  });
}
window.addEventListener('load', function () {
  loadQuestions();
});

function submitQuiz() {
  let score = 0;

  let detailHTML = '';

  questions.forEach((question, index) => {
    const checked = document.querySelector(
      `input[name="question${index}"]:checked`
    );

    if (!checked) {
      detailHTML += `

          <div class="alert alert-warning">

              <strong>Câu ${index + 1}:</strong>
              Bạn chưa chọn đáp án.

          </div>

          `;

      return;
    }

    const userAnswer = Number(checked.value);

    if (userAnswer === question.answer) {
      score++;

      detailHTML += `

          <div class="alert alert-success">

              <strong>Câu ${index + 1}:</strong>

              Chính xác.<br>

              <small>${question.explanation}</small>

          </div>

          `;
    } else {
      detailHTML += `

          <div class="alert alert-danger">

              <strong>Câu ${index + 1}:</strong>

              Sai.<br>

              Đáp án đúng:
              <b>${question.options[question.answer]}</b>

              <br>

              <small>${question.explanation}</small>

          </div>

          `;
    }
  });

  const resultBox = document.getElementById('resultBox');

  resultBox.classList.remove('d-none');

  const score10 = ((score / questions.length) * 10).toFixed(1);

  document.getElementById(
    'scoreText'
  ).innerHTML = `${score}/${questions.length} (${score10} điểm)`;

  const percent = Math.round((score / questions.length) * 100);

  const bar = document.getElementById('scoreBar');

  bar.style.width = percent + '%';

  bar.innerHTML = percent + '%';

  let message = '';

  if (score >= 9) {
    message = `

      <div class="alert alert-success">

          🎉 Xuất sắc! Bạn nắm rất chắc kiến thức.

      </div>

      `;
  } else if (score >= 7) {
    message = `

      <div class="alert alert-info">

          👍 Khá tốt! Tiếp tục cố gắng.

      </div>

      `;
  } else if (score >= 5) {
    message = `

      <div class="alert alert-warning">

          😊 Đã đạt yêu cầu nhưng cần ôn thêm.

      </div>

      `;
  } else {
    message = `

      <div class="alert alert-danger">

          📚 Bạn nên xem lại bài giảng rồi làm lại.

      </div>

      `;
  }

  document.getElementById('message').innerHTML = message + detailHTML;

  resultBox.scrollIntoView({
    behavior: 'smooth',
  });
}
const submitBtn = document.getElementById('submitBtn');

if (submitBtn) {
  submitBtn.addEventListener(
    'click',

    submitQuiz
  );
}
const resetBtn = document.getElementById('resetBtn');

if (resetBtn) {
  resetBtn.addEventListener(
    'click',

    function () {
      document.querySelectorAll("input[type='radio']").forEach(function (item) {
        item.checked = false;
      });

      document.getElementById('resultBox').classList.add('d-none');

      window.scrollTo({
        top: 0,

        behavior: 'smooth',
      });
    }
  );
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    document.getElementById('nameError').innerHTML = '';
    document.getElementById('emailError').innerHTML = '';
    document.getElementById('messageError').innerHTML = '';

    if (name.value.trim() === '') {
      document.getElementById('nameError').innerHTML =
        'Vui lòng nhập họ và tên.';

      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value)) {
      document.getElementById('emailError').innerHTML = 'Email không hợp lệ.';

      valid = false;
    }

    if (message.value.trim().length < 10) {
      document.getElementById('messageError').innerHTML =
        'Nội dung phải có ít nhất 10 ký tự.';

      valid = false;
    }

    if (valid) {
      document.getElementById('successMessage').classList.remove('d-none');

      contactForm.reset();

      setTimeout(function () {
        document.getElementById('successMessage').classList.add('d-none');
      }, 3000);
    }
  });
}

const searchQuestion = document.getElementById('searchQuestion');

if (searchQuestion) {
  searchQuestion.addEventListener('keyup', function () {
    const keyword = this.value.toLowerCase();

    document.querySelectorAll('.glossary-card').forEach(function (card) {
      if (card.innerText.toLowerCase().includes(keyword)) {
        card.parentElement.style.display = '';
      } else {
        card.parentElement.style.display = 'none';
      }
    });
  });
}

const demoBtn = document.getElementById('demoBtn');

if (demoBtn) {
  demoBtn.addEventListener('click', function () {
    questions.forEach(function (question, index) {
      const random = Math.floor(Math.random() * question.options.length);

      const radio = document.getElementById(`q${index}_${random}`);

      if (radio) {
        radio.checked = true;
      }
    });
  });
}

function updateClock() {
  const clock = document.getElementById('clock');

  if (!clock) return;

  const now = new Date();

  clock.innerHTML = now.toLocaleTimeString('vi-VN');
}

setInterval(updateClock, 1000);

updateClock();

const topBtn = document.getElementById('topBtn');

if (topBtn) {
  topBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,

      behavior: 'smooth',
    });
  });
}

$(document).ready(function () {
  $('.card').hide().fadeIn(700);

  $('button').hover(
    function () {
      $(this).addClass('shadow');
    },

    function () {
      $(this).removeClass('shadow');
    }
  );

  $('.glossary-card').hover(
    function () {
      $(this).addClass('border-primary');
    },

    function () {
      $(this).removeClass('border-primary');
    }
  );
});
