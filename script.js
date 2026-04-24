/* 🪐 1. ПІДСВІТКА СИНТАКСИСУ */

// Ініціалізуємо бібліотеку Highlight.js для підсвітки всього коду (<pre><code>) на сторінці
hljs.highlightAll();

/* 🧩 2. ГЕНЕРАТОР НАВІГАЦІЇ (КОМПОНЕНТ) */

function buildNavigation() {
  const container = document.getElementById("nav-container");

  // Якщо на сторінці немає контейнера або посилань, нічого не робимо
  if (!container || !window.pageNavLinks) return;

  // 1. Формуємо HTML тільки для кнопок-посилань
  const linksHTML = window.pageNavLinks
    .map((link) => {
      // Перевіряємо, чи є в налаштуваннях вказівка відкрити в новій вкладці
      const targetAttr = link.newTab ? ' target="_blank"' : "";

      return `<a href="${link.url}" class="nav-link"${targetAttr}>${link.name}</a>`;
    })
    .join("");

  // 2. Вставляємо повний шаблон панелі у контейнер
  container.innerHTML = `
    <nav class="top-bar">
      <div class="logo-container">
        <img src="./logo-light.svg" alt="WebUniverse Logo" class="site-logo logo-light" />
        <img src="./logo-dark.svg" alt="WebUniverse Logo" class="site-logo logo-dark" />
      </div>
      <div class="top-bar__controls">
        <div class="nav-links">
          ${linksHTML}
        </div>
        <label class="toggle-switch" aria-label="Перемикач теми">
          <input type="checkbox" id="theme-checkbox" />
          <span class="slider">
            <span class="icon sun">☀️</span>
            <span class="icon moon">🌙</span>
          </span>
        </label>
        <button id="wide-mode-btn" class="wide-toggle" title="Широкий екран">🖥️</button>
        <button class="hamburger-btn" aria-label="Відкрити меню">🍔</button>
      </div>
    </nav>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  buildNavigation();
});

/* ✨ 3. ЛОГІКА ПЕРЕМИКАННЯ ТЕМИ (Слайдер, Логотип, Підсвітка коду) */

document.addEventListener("DOMContentLoaded", () => {
  const themeCheckbox = document.getElementById("theme-checkbox");
  const hljsThemeLink = document.getElementById("hljs-theme");
  // const siteLogo = document.getElementById("site-logo");

  // Отримуємо збережену тему з локального сховища або встановлюємо 'light' за замовчуванням
  let currentTheme = localStorage.getItem("wu_theme") || "light";

  // Універсальна функція для застосування теми до ВСІХ елементів сайту
  function applyTheme(theme) {
    // 1. Змінюємо атрибут для CSS
    document.documentElement.setAttribute("data-theme", theme);
    // 2. Зберігаємо вибір користувача
    localStorage.setItem("wu_theme", theme);

    if (theme === "dark") {
      // Налаштування для ТЕМНОЇ теми
      if (themeCheckbox) themeCheckbox.checked = true;
      if (hljsThemeLink)
        hljsThemeLink.href =
          "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css";
    } else {
      // Налаштування для СВІТЛОЇ теми
      if (themeCheckbox) themeCheckbox.checked = false;
      if (hljsThemeLink)
        hljsThemeLink.href =
          "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
    }
  }

  // Застосовуємо збережену тему одразу при завантаженні сторінки
  applyTheme(currentTheme);

  // Слухаємо кліки по новому перемикачу (чекбоксу)
  if (themeCheckbox) {
    themeCheckbox.addEventListener("change", (e) => {
      // Якщо чекбокс активовано - темна тема, якщо ні - світла
      applyTheme(e.target.checked ? "dark" : "light");
    });
  }
});

/* ☀️ 4. ПЛАВНІ ПЕРЕХОДИ МІЖ СТОРІНКАМИ (Оновлено для динамічного контенту) */

document.addEventListener("DOMContentLoaded", () => {
  // Знімаємо "завісу" після завантаження шрифтів
  document.fonts.ready.then(() => document.body.classList.add("is-loaded"));
});

// Вішаємо слухача на документ
document.addEventListener("click", (e) => {
  // Знаходимо найближчий тег <a> (навіть якщо клікнули на текст чи іконку всередині посилання)
  const link = e.target.closest("a");

  // Якщо клік був не по посиланню (або посилання немає) — ігноруємо
  if (!link) return;

  // Ігноруємо перехоплення кліку у стандартних виключеннях:
  if (
    link.hasAttribute("download") ||
    link.target === "_blank" ||
    e.ctrlKey ||
    e.metaKey ||
    e.shiftKey ||
    e.altKey ||
    link.origin !== window.location.origin ||
    link.hash ||
    link.getAttribute("href") === "" || // Якщо посилання порожнє (урок в розробці)
    link.getAttribute("href") === "#"
  ) {
    return;
  }

  // Скасовуємо стандартний миттєвий перехід
  e.preventDefault();
  const destination = link.href;

  // Запускаємо анімацію зникнення сторінки
  document.body.classList.add("is-leaving");

  // Чекаємо (800мс), поки відпрацює CSS анімація, і робимо перехід
  setTimeout(() => (window.location.href = destination), 700);
});

// Вирішуємо проблему з кешем (bfcache) при кліку "Назад" у браузері
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    document.body.classList.remove("is-leaving");
    document.body.classList.add("is-loaded");
  }
});

/* 🌙 5. КНОПКА "ПОВЕРНУТИСЯ НАГОРУ" */

const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
  // Показуємо кнопку тільки тоді, коли користувач проскролив вниз більше ніж на 300px
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

// Плавний скрол на самий верх сторінки при кліку на кнопку
scrollToTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

/* 🍿 6. КНОПКА "СКОПІЮВАТИ" ДЛЯ КОДУ */

document.querySelectorAll("pre code").forEach((codeBlock) => {
  // Якщо блок коду має клас 'nocopy', пропускаємо його
  if (codeBlock.classList.contains("nocopy")) return;

  const pre = codeBlock.parentNode;

  // Створюємо обгортку для блоку коду, щоб позиціонувати кнопку всередині
  const wrapper = document.createElement("div");
  wrapper.className = "code-wrapper";

  // Переносимо <pre> всередину нашої нової обгортки
  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);

  // Створюємо саму кнопку "Копіювати"
  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "Копіювати";
  wrapper.appendChild(copyBtn);

  // Додаємо логіку при натисканні
  copyBtn.addEventListener("click", () => {
    // Використовуємо сучасний Clipboard API для запису тексту в буфер
    navigator.clipboard
      .writeText(codeBlock.innerText)
      .then(() => {
        // Успішно скопійовано: візуально змінюємо кнопку
        copyBtn.textContent = "Скопійовано";
        copyBtn.classList.add("copied");

        // Повертаємо кнопку до початкового стану через 2 секунди
        setTimeout(() => {
          copyBtn.textContent = "Копіювати";
          copyBtn.classList.remove("copied");
        }, 2000);
      })
      .catch((err) => console.error("Помилка копіювання: ", err));
  });
});

/* 🍕 7.1 КАСТОМНИЙ РЕДАКТОР КОДУ (CUSTOM EDITOR) */

// document.addEventListener("DOMContentLoaded", () => {
//   const editors = document.querySelectorAll(".custom-editor-wrapper");

//   editors.forEach((wrapper) => {
//     const runBtn = wrapper.querySelector(".run-btn");
//     const resetBtn = wrapper.querySelector(".reset-btn");
//     const codeInput = wrapper.querySelector(".custom-editor-input");
//     const outputDisplay = wrapper.querySelector(".custom-editor-output");

//     const initialCode = codeInput.value;

//     // Функція, яка автоматично змінює висоту поля вводу (textarea) під розмір тексту
//     const adjustHeight = () => {
//       codeInput.style.height = "auto";
//       codeInput.style.height = codeInput.scrollHeight + "px";
//     };

//     // Підлаштовуємо висоту під час набору тексту
//     codeInput.addEventListener("input", adjustHeight);

//     // Підлаштовуємо висоту при завантаженні (з нульовою затримкою для правильного рендеру)
//     setTimeout(adjustHeight, 0);

//     // Перехоплення Tab тут:
//     codeInput.addEventListener("keydown", function (e) {
//       if (e.key === "Tab") {
//         e.preventDefault();
//         const start = this.selectionStart;
//         const end = this.selectionEnd;
//         const indentation = "  ";
//         this.value =
//           this.value.substring(0, start) +
//           indentation +
//           this.value.substring(end);
//         this.selectionStart = this.selectionEnd = start + indentation.length;
//         this.dispatchEvent(new Event("input"));
//       }
//     });

//     // Спостерігач за видимістю - автоматично перераховує висоту щойно редактор стає видимим (при відкритті вкладки чи акордеона)
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           adjustHeight();
//         }
//       });
//     });
//     // Починаємо стежити за головним контейнером редактора
//     observer.observe(wrapper);

//     // Логіка виконання коду при натисканні кнопки "Скинути"
//     if (resetBtn) {
//       resetBtn.addEventListener("click", () => {
//         codeInput.value = initialCode; // Повертаємо оригінальний текст
//         adjustHeight(); // Перераховуємо висоту поля
//         outputDisplay.textContent = "Очікування запуску..."; // Очищаємо консоль виводу
//       });
//     }

//     // Логіка виконання коду при натисканні кнопки "Запустити"
//     runBtn.addEventListener("click", () => {
//       const codeToRun = codeInput.value;
//       let simulatedOutput = "";

//       // Зберігаємо оригінальний метод console.log
//       const originalConsoleLog = console.log;

//       // Перевизначаємо console.log, щоб ловити вивід з користувацького коду
//       console.log = function (...args) {
//         const logString = args
//           .map((arg) => {
//             // Форматуємо об'єкти як красивий JSON, а все інше конвертуємо в рядок
//             if (typeof arg === "object") return JSON.stringify(arg, null, 2);
//             return String(arg);
//           })
//           .join(" ");
//         // Додаємо вивід до нашого віртуального логу
//         simulatedOutput += logString + "\n";
//       };

//       try {
//         // Створюємо нову функцію з тексту користувача і виконуємо її.
//         // Це трохи безпечніша альтернатива eval()
//         const executeCode = new Function(codeToRun);
//         executeCode();

//         // Якщо код відпрацював, але нічого не вивів
//         if (simulatedOutput === "") {
//           simulatedOutput = "Код виконано (немає виводу в консоль)";
//         }
//       } catch (error) {
//         // Якщо у користувацькому коді є помилка, перехоплюємо її
//         simulatedOutput = "Помилка: " + error.message;
//       }

//       // Обов'язково повертаємо оригінальний console.log на місце!
//       console.log = originalConsoleLog;

//       // Відображаємо результат в інтерфейсі (прибираємо зайві пробіли на кінці)
//       outputDisplay.textContent = simulatedOutput.trim();
//     });
//   });
// });

/* 🎨 7.2 HTML РЕДАКТОР ПРЕВ'Ю СТОРІНКИ */

// document.addEventListener("DOMContentLoaded", () => {
//   const htmlEditors = document.querySelectorAll(".html-editor-wrapper");

//   htmlEditors.forEach((wrapper) => {
//     const runBtn = wrapper.querySelector(".run-btn");
//     const resetBtn = wrapper.querySelector(".reset-btn");
//     const codeInput = wrapper.querySelector(".custom-editor-input");
//     const iframeOutput = wrapper.querySelector(".html-editor-output");

//     const initialCode = codeInput.value;

//     // Авто-висота для поля вводу
//     const adjustHeight = () => {
//       codeInput.style.height = "auto";
//       codeInput.style.height = codeInput.scrollHeight + "px";
//     };

//     codeInput.addEventListener("input", adjustHeight);
//     setTimeout(adjustHeight, 0);

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           adjustHeight();
//         }
//       });
//     });
//     observer.observe(wrapper);

//     // Логіка оновлення iframe
//     const updatePreview = (code) => {
//       // srcdoc - це сучасний атрибут, який миттєво рендерить рядок коду всередині iframe
//       iframeOutput.srcdoc = code;
//     };

//     // Опціонально: Показати результат одразу при завантаженні сторінки
//     updatePreview(initialCode);

//     // Логіка виконання при натисканні "Запустити" (▶️)
//     runBtn.addEventListener("click", () => {
//       updatePreview(codeInput.value);
//     });

//     // Логіка виконання при натисканні "Скинути" (🔄)
//     if (resetBtn) {
//       resetBtn.addEventListener("click", () => {
//         codeInput.value = initialCode;
//         adjustHeight();
//         // iframeOutput.srcdoc = "";
//         updatePreview(initialCode);
//       });
//     }
//   });
// });

/* 🗂 8. ТАБИ (ВКЛАДКИ) ДЛЯ ЧАСТИН УРОКУ */

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  let isAnimating = false; // Запобіжник

  // 1. ПЕРЕВІРЯЄМО LOCALSTORAGE ПРИ ЗАВАНТАЖЕННІ
  const savedTabId = sessionStorage.getItem("activeTab");

  if (savedTabId) {
    // Шукаємо кнопку і контент для збереженої вкладки
    const savedBtn = document.querySelector(
      `.tab-btn[data-target="${savedTabId}"]`,
    );
    const savedContent = document.getElementById(savedTabId);

    if (savedBtn && savedContent) {
      // Спочатку прибираємо класи 'active' та 'show', які могли бути прописані в HTML за замовчуванням
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active", "show");
      });

      // Миттєво робимо активною збережену вкладку
      savedBtn.classList.add("active");
      savedContent.classList.add("active", "show");
    }
  } else {
    // Якщо нічого не збережено, показуємо вкладку за замовчуванням
    const initialActive = document.querySelector(".tab-content.active");
    if (initialActive) initialActive.classList.add("show");
  }

  // 2. ЛОГІКА ПЕРЕМИКАННЯ ТА ЗБЕРЕЖЕННЯ
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Ігноруємо клік, якщо це активна вкладка або йде анімація
      if (button.classList.contains("active") || isAnimating) return;

      isAnimating = true;

      const targetId = button.getAttribute("data-target");

      // Зберігаємо вибір користувача
      sessionStorage.setItem("activeTab", targetId);

      const currentActiveContent = document.querySelector(
        ".tab-content.active",
      );
      const currentActiveBtn = document.querySelector(".tab-btn.active");

      // Миттєво перемикаємо візуальний стан кнопок
      if (currentActiveBtn) currentActiveBtn.classList.remove("active");
      button.classList.add("active");

      if (currentActiveContent) {
        // ЕТАП 1: Починаємо плавне розчинення старого контенту
        currentActiveContent.classList.remove("show");

        // Чекаємо 400мс (поки відпрацює CSS transition)
        setTimeout(() => {
          // ЕТАП 2: Ховаємо старий блок і дістаємо новий
          currentActiveContent.classList.remove("active");

          const newContent = document.getElementById(targetId);
          newContent.classList.add("active");

          // Даємо браузеру 20мс на рендер перед появою
          setTimeout(() => {
            newContent.classList.add("show");
            isAnimating = false;
          }, 20);
        }, 400);
      } else {
        // Запобіжник на випадок відсутності відкритої секції
        const newContent = document.getElementById(targetId);
        newContent.classList.add("active");
        setTimeout(() => {
          newContent.classList.add("show");
          isAnimating = false;
        }, 20);
      }
    });
  });
});

/* 🍔 9. МОБІЛЬНЕ МЕНЮ */

document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navLinks = document.querySelector(".nav-links");

  if (hamburgerBtn && navLinks) {
    // 1. Відкриття/закриття по кліку на сам гамбургер
    hamburgerBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    // 2. Закриття по кліку будь-де поза меню
    document.addEventListener("click", (event) => {
      const isOpen = navLinks.classList.contains("open");

      const clickedOutside =
        !hamburgerBtn.contains(event.target) &&
        !navLinks.contains(event.target);

      if (isOpen && clickedOutside) {
        navLinks.classList.remove("open");
      }
    });
  }
});

/* 📑 10. ЗБЕРЕЖЕННЯ СТАНУ АКОРДЕОНІВ */

document.addEventListener("DOMContentLoaded", () => {
  // Знаходимо абсолютно всі теги <details> на сторінці (і головні, і внутрішні завдання)
  const allDetails = document.querySelectorAll("details");

  // 1. Читаємо збережений стан при завантаженні
  const savedState = sessionStorage.getItem("openAccordions");

  if (savedState) {
    // Перетворюємо збережений текст назад у масив номерів (наприклад: [0, 3, 5])
    const openIndices = JSON.parse(savedState);

    allDetails.forEach((detail, index) => {
      // Якщо номер цього акордеона є в нашому збереженому списку — відкриваємо його
      if (openIndices.includes(index)) {
        detail.setAttribute("open", "");
      } else {
        // Якщо немає — примусово закриваємо
        detail.removeAttribute("open");
      }
    });
  }

  // 2. Слухаємо зміни і записуємо їх у пам'ять
  allDetails.forEach((detail) => {
    // Подія 'toggle' спрацьовує автоматично, коли <details> відкривається або закривається
    detail.addEventListener("toggle", () => {
      // Створюємо порожній список
      const openIndices = [];

      // Пробігаємося по всіх акордеонах і записуємо номери тих, які зараз відкриті
      allDetails.forEach((d, i) => {
        if (d.hasAttribute("open")) {
          openIndices.push(i);
        }
      });

      // Перетворюємо масив у текст і зберігаємо в sessionStorage
      sessionStorage.setItem("openAccordions", JSON.stringify(openIndices));
    });
  });
});

/* 🌤️ 11. ТІНЬ ПАНЕЛІ ПРИ СКРОЛІ */

document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("nav-container");

  // Якщо контейнера немає, код не виконується
  if (!navContainer) return;

  window.addEventListener("scroll", () => {
    // Якщо проскролили більше ніж на 10 пікселів вниз
    if (window.scrollY > 10) {
      navContainer.classList.add("scrolled");
    } else {
      // Якщо повернулися на самий верх
      navContainer.classList.remove("scrolled");
    }
  });
});

/* 🖥️ 12. ШИРОКИЙ ЕКРАН (WIDE MODE) */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Відновлюємо стан при завантаженні сторінки
  if (localStorage.getItem("wu_wideMode") === "true") {
    document.body.classList.add("wide-mode");
  }

  // 2. Слухаємо кліки по кнопці
  document.addEventListener("click", (e) => {
    const wideBtn = e.target.closest("#wide-mode-btn");

    if (wideBtn) {
      // Перемикаємо клас і зберігаємо стан
      const isNowWide = document.body.classList.toggle("wide-mode");
      localStorage.setItem("wu_wideMode", isNowWide);

      // Анімація "натискання"
      wideBtn.style.transform = "scale(0.85)";
      setTimeout(() => (wideBtn.style.transform = ""), 150);
    }
  });
});

/* 🖼️ 13. ЗБІЛЬШЕННЯ КАРТИНОК ПО КЛІКУ */

document.addEventListener("DOMContentLoaded", () => {
  // Знаходимо всі картинки, яким ви дали клас zoomable
  const zoomableImages = document.querySelectorAll("img.zoomable");

  zoomableImages.forEach((img) => {
    img.addEventListener("click", () => {
      // При кліку додаємо або забираємо клас 'expanded'
      img.classList.toggle("expanded");
    });
  });
});

/* 📥 14. РОЗУМНІ ПОСИЛАННЯ ДЛЯ ЗАВАНТАЖЕННЯ */

document.addEventListener("click", async (e) => {
  // :not([data-temp]), щоб скрипт ігнорував власні штучні кліки
  const downloadLink = e.target.closest("a[download]:not([data-temp])");

  if (downloadLink) {
    e.preventDefault(); // Зупиняємо стандартний перехід браузера

    const originalText = downloadLink.innerHTML;
    const fileUrl = downloadLink.href;

    try {
      // Робимо кнопку напівпрозорою, поки йде перевірка
      downloadLink.style.opacity = "0.6";
      downloadLink.style.pointerEvents = "none";

      // Перевіряємо, чи існує файл
      const response = await fetch(fileUrl, { method: "HEAD" });

      if (response.ok) {
        // ФАЙЛ ІСНУЄ!
        const tempLink = document.createElement("a");
        tempLink.href = fileUrl;
        tempLink.download = downloadLink.getAttribute("download") || "";

        // Вішаємо спеціальний бейдж, щоб скрипт пропустив цей клік
        tempLink.setAttribute("data-temp", "true");

        document.body.appendChild(tempLink);
        tempLink.click(); // Тепер цей клік успішно завантажить файл
        document.body.removeChild(tempLink);
      } else {
        // ФАЙЛ НЕ ЗНАЙДЕНО (Помилка 404)
        downloadLink.innerHTML = "❌ Файл не знайдено";
        downloadLink.style.borderColor = "var(--brand3)";
        downloadLink.style.color = "var(--brand3)";

        // Повертаємо кнопку до нормального стану через 1 секунду
        setTimeout(() => {
          downloadLink.innerHTML = originalText;
          downloadLink.style.borderColor = "";
          downloadLink.style.color = "";
        }, 1000);
      }
    } catch (error) {
      console.error("Помилка перевірки файлу:", error);
      downloadLink.innerHTML = "⚠️ Помилка з'єднання";

      setTimeout(() => {
        downloadLink.innerHTML = originalText;
      }, 3000);
    } finally {
      // Повертаємо кнопці клікабельність
      downloadLink.style.opacity = "1";
      downloadLink.style.pointerEvents = "auto";
    }
  }
});

/* 🚀 ОНОВЛЕНИЙ РЕДАКТОР CODEMIRROR ДЛЯ ВСІХ ЗАВДАНЬ */

document.addEventListener("DOMContentLoaded", () => {
  const editors = document.querySelectorAll(".custom-editor-wrapper");

  editors.forEach((wrapper) => {
    const codeInput = wrapper.querySelector(".custom-editor-input");
    const runBtn = wrapper.querySelector(".run-btn");
    const resetBtn = wrapper.querySelector(".reset-btn");
    const isHtmlEditor = wrapper.classList.contains("html-editor-wrapper");

    // 1. Визначаємо мову
    const editorMode = isHtmlEditor ? "htmlmixed" : "javascript";

    // 2. Ініціалізуємо CodeMirror поверх textarea
    const cm = CodeMirror.fromTextArea(codeInput, {
      mode: editorMode,
      theme: "dracula",
      lineNumbers: true,
      tabSize: 2,
      lineWrapping: true,
      viewportMargin: Infinity,
    });

    // 2.5. Виправляємо баг відображення у прихованих вкладках/акордеонах
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => cm.refresh(), 20);
        }
      });
    });
    observer.observe(wrapper);

    // 3. Елементи виводу
    const outputDisplay = wrapper.querySelector(".custom-editor-output");
    const iframeOutput = wrapper.querySelector(".html-editor-output");

    if (isHtmlEditor && iframeOutput) {
      iframeOutput.srcdoc = cm.getValue(); // Початковий рендер
    }

    // Кнопка ЗАПУСТИТИ
    if (runBtn) {
      runBtn.addEventListener("click", () => {
        const code = cm.getValue(); // Отримуємо текст з CodeMirror

        if (isHtmlEditor) {
          if (iframeOutput) iframeOutput.srcdoc = code;
        } else {
          // Якщо це JS редактор
          if (outputDisplay) {
            outputDisplay.textContent = "Запуск..."; // Показуємо, що кнопка натиснулась

            // Даємо браузеру 50мс, щоб відмалювати слово "Запуск...", і виконуємо код
            setTimeout(() => {
              runJsCode(code, outputDisplay);
            }, 50);
          }
        }
      });
    }

    // Кнопка СКИНУТИ
    if (resetBtn) {
      const initialValue = codeInput.defaultValue;
      resetBtn.addEventListener("click", () => {
        cm.setValue(initialValue);
        if (isHtmlEditor && iframeOutput) iframeOutput.srcdoc = initialValue;
        if (outputDisplay) outputDisplay.textContent = "Очікування запуску...";
      });
    }
  });
});

// Функція запуску JS
function runJsCode(codeToRun, outputDisplay) {
  let simulatedOutput = "";

  // Зберігаємо оригінальні методи браузера
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  // Перевизначаємо console.log
  console.log = (...args) => {
    simulatedOutput +=
      args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
        )
        .join(" ") + "\n";
  };

  // Перевизначаємо console.error
  console.error = (...args) => {
    simulatedOutput +=
      "Помилка: " +
      args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
        )
        .join(" ") +
      "\n";
  };

  try {
    // Виконуємо код учня
    const executeCode = new Function(codeToRun);
    executeCode();

    // Виводимо результат
    outputDisplay.textContent =
      simulatedOutput.trim() || "Код виконано (немає виводу в консоль)";
  } catch (error) {
    // Якщо учень допустив синтаксичну помилку
    outputDisplay.textContent = "Помилка у коді: " + error.message;
  } finally {
    // ОБОВ'ЯЗКОВО повертаємо оригінальні методи на місце
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  }
}

/* 📝 18. ЛОГІКА ЗБЕРЕЖЕННЯ ТА ГЕНЕРАЦІЇ ДОМАШНЬОГО ЗАВДАННЯ (.txt) */

document.addEventListener("DOMContentLoaded", () => {
  const hwForm = document.getElementById("homework-form");
  if (!hwForm) return;

  const studentNameInput = document.getElementById("student-name");
  const saveBtn = document.getElementById("save-hw-btn");
  const copyBtn = document.getElementById("copy-hw-btn");
  const clearBtn = document.getElementById("clear-hw-btn");
  const errorMsg = document.getElementById("hw-error-msg");

  // --- 1. ВІДНОВЛЕННЯ З ЛОКАЛЬНОГО СХОВИЩА ---
  const savedFormData = JSON.parse(localStorage.getItem("wu_hw_form") || "{}");

  hwForm
    .querySelectorAll("input, textarea:not(.custom-editor-input)")
    .forEach((el) => {
      if (el.type === "radio" || el.type === "checkbox") {
        // Відновлюємо галочки
        if (
          savedFormData[el.name] &&
          savedFormData[el.name].includes(el.value)
        ) {
          el.checked = true;
        }
      } else {
        // Відновлюємо текст (імена, відкриті питання)
        if (savedFormData[el.name]) el.value = savedFormData[el.name];
      }
    });

  // --- 2. АВТОЗБЕРЕЖЕННЯ ПРИ ВВЕДЕННІ ---
  hwForm.addEventListener("input", () => {
    const data = {};
    // Збираємо радіо та чекбокси
    hwForm
      .querySelectorAll(
        "input[type='radio']:checked, input[type='checkbox']:checked",
      )
      .forEach((el) => {
        if (!data[el.name]) data[el.name] = [];
        data[el.name].push(el.value);
      });
    // Збираємо текст
    hwForm
      .querySelectorAll(
        "textarea:not(.custom-editor-input), input[type='text']",
      )
      .forEach((el) => {
        data[el.name] = el.value;
      });

    localStorage.setItem("wu_hw_form", JSON.stringify(data));

    // Якщо користувач почав виправляти помилки - ховаємо червоне попередження
    errorMsg.style.display = "none";
    hwForm
      .querySelectorAll(".error-highlight")
      .forEach((el) => el.classList.remove("error-highlight"));
  });

  // --- 3. ФУНКЦІЯ ЗБОРУ ТА ПЕРЕВІРКИ ДАНИХ ---
  function collectAndValidate() {
    let isValid = true;
    let outputText = `======================================\n`;
    outputText += `ДОМАШНЄ ЗАВДАННЯ\n`;
    outputText += `======================================\n\n`;

    const name = studentNameInput.value.trim();
    if (!name) {
      studentNameInput
        .closest(".student-info")
        .classList.add("error-highlight");
      isValid = false;
    }

    outputText += `Учень: ${name || "[НЕ ВКАЗАНО]"}\n`;
    const date = new Date();
    outputText += `Дата здачі: ${date.toLocaleDateString("uk-UA")} о ${date.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}\n\n`;
    outputText += `--------------------------------------\n\n`;

    // ❗️ ЗМІНА ТУТ: Шукаємо ТІЛЬКИ блоки питань
    const questions = hwForm.querySelectorAll(
      ".test-question:not(.student-info)",
    );

    questions.forEach((qBlock) => {
      let qText = "";
      const p = qBlock.querySelector("p");
      if (p) {
        // Очищаємо текст від зайвих переносів рядків та пробілів з HTML
        qText = p.textContent.replace(/\s+/g, " ").trim();
      } else if (qBlock.querySelector(".editor-title")) {
        qText =
          "Практичне завдання (" +
          qBlock
            .querySelector(".editor-title")
            .textContent.replace(/\s+/g, " ")
            .trim() +
          ")";
      }

      let answerText = "";
      let isAnswered = false;

      // 1. Радіо
      const checkedRadio = qBlock.querySelector(".test-radio:checked");
      if (checkedRadio) {
        answerText = checkedRadio.value;
        isAnswered = true;
      }

      // 2. Чекбокси
      const checkedBoxes = qBlock.querySelectorAll(".test-checkbox:checked");
      if (checkedBoxes.length > 0) {
        answerText = Array.from(checkedBoxes)
          .map((cb) => cb.value)
          .join(", ");
        isAnswered = true;
      }

      // 3. Текстареа (коротка відповідь)
      const textarea = qBlock.querySelector(".test-textarea");
      if (textarea && textarea.value.trim() !== "") {
        answerText = textarea.value.trim();
        isAnswered = true;
      }

      // 4. ❗️ ЗМІНА ТУТ: Шукаємо редактор коду ВСЕРЕДИНІ поточного питання
      const editorWrapper = qBlock.querySelector(".custom-editor-wrapper");
      if (editorWrapper) {
        const cmInstance =
          editorWrapper.querySelector(".CodeMirror")?.CodeMirror;
        if (cmInstance) {
          // Якщо код не порожній (і не складається лише з пробілів)
          const codeValue = cmInstance.getValue();
          if (codeValue.trim() !== "") {
            answerText = "\n" + codeValue;
            isAnswered = true;
          }
        }
      }

      // Перевірка (валідація)
      if (!isAnswered) {
        qBlock.classList.add("error-highlight");
        isValid = false;
      }

      if (qText || answerText) {
        outputText += `❓ Питання: ${qText}\n`;
        outputText += `📝 Відповідь: ${answerText || "[Немає відповіді]"}\n\n`;
        outputText += `--------------------------------------\n\n`;
      }
    });

    return { isValid, outputText, name };
  }

  // --- 4. КНОПКА ЗБЕРЕЖЕННЯ ФАЙЛУ (.TXT) ---
  saveBtn.addEventListener("click", () => {
    const { isValid, outputText, name } = collectAndValidate();

    if (!isValid) {
      errorMsg.style.display = "block";
      // Скролимо до першої помилки
      document
        .querySelector(".error-highlight")
        .scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Створюємо Blob файл
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Формуємо красиву назву файлу
    const safeName = name.replace(/[^a-zа-яіїєґ0-9]/gi, "_");
    a.download = `ДЗ_Тема_${safeName}.txt`; // 'Тема' можна динамічно брати з h1

    a.click();
    URL.revokeObjectURL(url);

    // Візуальний фідбек
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = "✅ Успішно збережено!";
    saveBtn.style.backgroundColor = "mediumseagreen";
    saveBtn.style.borderColor = "mediumseagreen";
    setTimeout(() => {
      saveBtn.innerHTML = originalText;
      saveBtn.style.backgroundColor = "";
      saveBtn.style.borderColor = "";
    }, 3000);
  });

  // --- 5. КНОПКА КОПІЮВАННЯ ТЕКСТУ ---
  copyBtn.addEventListener("click", () => {
    const { isValid, outputText } = collectAndValidate();

    if (!isValid) {
      errorMsg.style.display = "block";
      document
        .querySelector(".error-highlight")
        .scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    navigator.clipboard.writeText(outputText).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = "✅ Скопійовано!";
      setTimeout(() => (copyBtn.innerHTML = originalText), 2000);
    });
  });

  // --- 6. КНОПКА ОЧИЩЕННЯ ФОРМИ ---
  clearBtn.addEventListener("click", () => {
    if (
      confirm(
        "Ти впевнений, що хочеш видалити ВСІ свої відповіді і почати заново?",
      )
    ) {
      // Чистимо сховище
      localStorage.removeItem("wu_hw_form");
      hwForm.querySelectorAll(".custom-editor-wrapper").forEach((wrapper) => {
        localStorage.removeItem("wu_code_" + wrapper.id);
      });

      // Оновлюємо сторінку, щоб повністю обнулити форму і CodeMirror
      window.location.reload();
    }
  });
});
