// THEME TOGGLE
const themeToggleButton = document.getElementById('theme-toggle');
const root = document.documentElement;

function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggleButton.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);

}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);


themeToggleButton.addEventListener("click", () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current == "dark" ? "light" : "dark");
});

// SkILL BARS
const skillsSection = document.getElementById('skills');
const barFills = document.querySelectorAll('.bar-fill');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            barFills.forEach((barFill) => {
                barFill.style.width = barFill.dataset.level + '%';
            });
            skillsObserver.unobserve(skillsSection);
        }
    });
}, { threshold: 0.3 });

skillsObserver.observe(skillsSection);

// PROJECTS
const projects = [
    {
        tittle: "SAM-GOES",
        category: 'web-development',
        label: 'Web Development',
        description: 'Interactive ordering system for Samgyup Garden, built as my capstone project as team lead.',

    },
    {
        tittle: "Retail Dataset Analysis",
        category: 'data-analysis',
        label: 'Data Analysis',
        description: 'Personal data analysis project on a retail dataset from Kaggle, showcasing my skills in data cleaning, visualization, and statistical analysis.',
        image: 'retail dashboard.png',
        alt: 'Retail Dataset Analysis dashboard',
        link: 'https://github.com/Marc-Erick-Zaldo/Data-Analytics-Projects/tree/main/Portfolio_dataanalytics'


    },
    {
        tittle: "Layoffs Dataset Analysis",
        category: 'data-analysis',
        label: 'Data Analysis',
        description: 'Personal data analysis project on a layoffs dataset.',
        image: 'world layoffs.png',
        alt: 'Layoffs Dataset Analysis dashboard',
        link: 'https://github.com/Marc-Erick-Zaldo/Data-Analytics-Projects/tree/main/Portfolio_dataanalytics'
    },
    {
        tittle: "Exploratory Data Analysis on World layoffs Dataset",
        category: 'database',
        label: 'Database SQL Analysis',
        description: 'A set of data analysis using querying and filtering data from a world layoffs dataset using SQL.',
        link: 'https://github.com/Marc-Erick-Zaldo/Data-Analytics-Projects/blob/main/Portfolio_dataanalytics/Exploratory%20Data%20Analysis%20EDA%20Project.sql'
    },
    {
        tittle: "Exploratory Data Analysis on Retail Dataset",
        category: 'database',
        label: 'Database SQL Analysis',
        description: 'A set of data analysis using querying and filtering data from a retail dataset using SQL.',
        link: 'https://github.com/Marc-Erick-Zaldo/Data-Analytics-Projects/blob/main/Project%202/EDA%20Project%202%20From%20Kaggle.sql'
    },
    {
        tittle: "Chair Rental System",
        category: 'web-development',
        label: 'Web Development',
        description: 'Ned’s Chair Rental Service. A responsive booking website for a chair rental business. It checks chair availability by date, calculates the price live, validates bookings, and includes an owner view to confirm or cancel requests. Built with HTML, CSS, and JavaScript.',
        image: 'website project.png',
        alt: 'Chair Rental System dashboard',
        link: 'https://github.com/Marc-Erick-Zaldo/Personal-Finance-Tracker'
    }


];

const projectlist = document.getElementById('project-list');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderProjects(filter) {
    const visible = filter === 'all' ? projects : projects.filter(project => project.category === filter);

    if (visible.length === 0) {
        projectlist.innerHTML = '<p>No projects found for this category.</p>';
        return;
    }

    projectlist.innerHTML = visible.map(project => `
        <article class="project-card">
        ${project.image ? `<img src="${project.image}" alt="${project.alt}" class="project-image" loading="lazy">` : ''}
        <div class="project-body">
        <h3>${project.tittle}</h3>
        <p>${project.description}</p>
        <span class="project-label">${project.label}</span>
        ${project.link ? `<a href="${project.link}" target="_blank" 
        rel="noopener class="project-link">View on GitHub</a>` : ''}
        </div>
        </article>
    `).join('');
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        renderProjects(button.dataset.filter);
    });
});

renderProjects('all');

// CONTACT FORM

const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const formSuccess = document.getElementById('form-success');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

function showerror(input, message) {
    document.getElementById(input.id + '-error').textContent = message;
    input.classList.add('invalid');
}

function clearError(input) {
    document.getElementById(input.id + '-error').textContent = '';
    input.classList.remove('invalid');
}

function validateform() {
    let isValid = true;

    if (nameInput.value.trim().length < 2) {
        showerror(nameInput, 'Name must be at least 2 characters long.');
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        showerror(emailInput, 'Please enter a valid email address.');
        isValid = false;
    }

    if (messageInput.value.trim().length < 10) {
        showerror(messageInput, 'Message must be at least 10 characters long.');
        isValid = false;
    }

    return isValid;
}

const FORM_ENDPOINT = 'https://formspree.io/f/xvkkpepj';

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    [nameInput, emailInput, messageInput].forEach(input => clearError(input));

    if (!validateform())
        return;
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
        const response = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: new FormData(contactForm)

        });

        if (response.ok) {
            showToast('Message sent successfully!');
            contactForm.reset();
        } else {
            showToast('Something went wrong. Please try again later.');
        }


    } catch (error) {
        showToast('Network error. Please check your connection and try again later.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
});

[nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => clearError(input));
});