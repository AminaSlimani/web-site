/**
 * Medical Educational file now. Website - JavaScript
 * Features: Dark Mode, Search, Category Filter, Accordions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initDarkMode();
    initSearch();
    initCategoryFilter();
    initAccordions();
    initAnimations();
});

/**
 * Dark Mode Toggle Functionality
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add animation feedback
        this.classList.add('theme-transition');
        setTimeout(() => {
            this.classList.remove('theme-transition');
        }, 300);
    });
}

/**
 * Search Functionality
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const diseaseCards = document.querySelectorAll('.disease-card');
    
    // Search on button click
    searchBtn.addEventListener('click', performSearch);
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Real-time search on input
    searchInput.addEventListener('input', function() {
        performSearch();
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;
        
        diseaseCards.forEach((card, index) => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const englishTitle = card.querySelector('.disease-english').textContent.toLowerCase();
            const content = card.querySelector('.disease-content').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || englishTitle.includes(searchTerm) || content.includes(searchTerm)) {
                card.classList.remove('hidden');
                card.style.animationDelay = `${visibleCount * 0.1}s`;
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Show/hide no results message
        showNoResults(visibleCount === 0 && searchTerm !== '');
    }
    
    function showNoResults(show) {
        let noResultsMsg = document.querySelector('.no-results');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = `
                <h3>لم يتم العثور على نتائج</h3>
                <p>جرب البحث بكلمات مختلفة أو تصفح الفئات المختلفة</p>
            `;
            document.querySelector('.diseases-grid').insertAdjacentElement('afterend', noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

/**
 * Category Filter Functionality
 */
function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const diseaseCards = document.querySelectorAll('.disease-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
    
    function filterByCategory(category) {
        let visibleCount = 0;
        
        diseaseCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                card.style.animationDelay = `${visibleCount * 0.1}s`;
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Show/hide no results message
        showNoResults(visibleCount === 0);
    }
    
    function showNoResults(show) {
        let noResultsMsg = document.querySelector('.no-results');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = `
                <h3>لا توجد أمراض في هذه الفئة</h3>
                <p>اختر فئة أخرى من القائمة أعلاه</p>
            `;
            document.querySelector('.diseases-grid').insertAdjacentElement('afterend', noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

/**
 * Accordion Functionality
 */
function initAccordions() {
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Close other accordions in the same card (optional - for exclusive behavior)
            const card = this.closest('.disease-card');
            const otherBtns = card.querySelectorAll('.accordion-btn:not(.active)');
            
            // Toggle current accordion
            this.classList.toggle('active');
            
            // Optional: Close other accordions when opening one
            // Uncomment the next 3 lines to enable exclusive accordion behavior
            // otherBtns.forEach(otherBtn => {
            //     otherBtn.classList.remove('active');
            // });
        });
    });
    
    // Keyboard accessibility for accordions
    accordionBtns.forEach(btn => {
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('role', 'button');
        
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Animation on Scroll
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe disease cards
    const diseaseCards = document.querySelectorAll('.disease-card');
    diseaseCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Print functionality
 */
function printPage() {
    window.print();
}

/**
 * Export data as PDF (placeholder - would require a library like jsPDF)
 */
function exportAsPDF() {
    alert('لتصدير الملف كـ PDF، يرجى استخدام خيار الطباعة في المتصفح (Ctrl + P) ثم اختيار "حفظ كـ PDF"');
}
