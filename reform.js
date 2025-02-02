document.querySelectorAll('.reform-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        if (!this.classList.contains('active')) {
            this.classList.add('active');
        }
    });
});

// ホームリンクの処理を追加
document.querySelectorAll('#home-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'az.html';
    });
});
