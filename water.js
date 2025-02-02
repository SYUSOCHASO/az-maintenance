document.addEventListener('DOMContentLoaded', () => {
    // ホームリンクの処理
    document.querySelectorAll('#home-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'az.html';
        });
    });

    // スクロールアニメーション
    const chatMessages = document.querySelectorAll('.chat-message');
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // 各チャットメッセージを監視
    chatMessages.forEach((message, index) => {
        setTimeout(() => {
            observer.observe(message);
        }, index * 500);
    });
});
