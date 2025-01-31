// Mobile menu toggle
function toggleMenu() {
    document.querySelector('.links').classList.toggle('active');
}

// Smooth scrolling for navbar links
document.querySelectorAll('.links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
