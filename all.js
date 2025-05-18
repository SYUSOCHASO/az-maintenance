// PCとモバイルで異なる動作をさせる
const isMobile = window.matchMedia('(max-width: 768px)').matches;

if (isMobile) {
    // モバイルの場合は、Intersection Observer APIを使って要素が画面内に入ったら開く

    // ページ読み込み時にも確実にスクロールに応じて開くようにする
    // 読み込み時に最初から見えている要素は一度非表示にしておく
    document.querySelectorAll('.all-item').forEach(item => {
        // 最初はすべて非表示にする
        item.classList.remove('active');
    });
    
    // スクロールイベントを使用して、スクロールしたときにのみ要素を表示する
    // 初期表示も手動スクロールをトリガーとして実行される
    let hasScrolled = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // スクロールした後のみ処理を実行
            if (hasScrolled && entry.isIntersecting) {
                // 要素が画面内に入ったら自動的に開く
                entry.target.classList.add('active');
                // 一度表示されたら監視を解除
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 }); // 要素が30%以上表示されたら発火
    
    // 監視対象の要素を登録
    document.querySelectorAll('.all-item').forEach(item => {
        observer.observe(item);
    });
    
    // スクロールイベントの登録
    window.addEventListener('scroll', function() {
        if (!hasScrolled) {
            hasScrolled = true;
            // 強制的に再評価を行う
            observer.disconnect();
            document.querySelectorAll('.all-item').forEach(item => {
                observer.observe(item);
            });
        }
    }, { passive: true });
    
    // ページ読み込み後に500ms後に手動スクロールイベントをトリガーする
    // これによりページ読み込み時に1pxスクロールして、表示中の要素を再評価する
    setTimeout(function() {
        window.scrollBy(0, 1);
        setTimeout(function() {
            window.scrollBy(0, -1);
        }, 100);
    }, 500);
} else {
    // PCの場合は、マウスホバーで開く
    document.querySelectorAll('.all-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.classList.add('active');
            }
        });
    });
}

// ホームリンクの処理を追加
document.querySelectorAll('#home-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'az.html';
    });
});
