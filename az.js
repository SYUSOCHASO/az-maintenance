document.addEventListener('DOMContentLoaded', () => {
    // ヘッダーの表示/非表示を制御
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // 下スクロール時
            header.style.transform = 'translateY(-100%)';
        } else {
            // 上スクロール時
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 顧客会員数10000人のカウンターアニメーション関数
    const animateCounter = (counter) => {
        // 遅延を追加（2秒待ってからカウントアップを開始）
        setTimeout(() => {
            const target = +counter.getAttribute('data-target');
            const duration = 1500; // カウンターアニメーションの合計時間（ミリ秒）
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                counter.textContent = Math.floor(current);
                
                if (current < target) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        }, 1500); // 1500ミリ秒（1.5秒）の遅延を追加
    };

    // バナーのカウンターを監視
    const bannerCounter = document.querySelector('.achievement-banner .counter');
    if (bannerCounter) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(bannerCounter);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(bannerCounter);
    }

    // 統計セクションのカウンターを監視
    const statsItems = document.querySelectorAll('.stats-item');
    if (statsItems.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target.querySelector('.counter');
                    if (counter) {
                        animateCounter(counter);
                        statsObserver.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.5 });

        statsItems.forEach(item => statsObserver.observe(item));
    }

    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight + 200; // +200 を追加してスクロール位置を下げる
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 動画の自動再生設定
    const video = document.getElementById('myVideo');
    if (video) {
        video.play().catch(function(error) {
            console.log("動画の自動再生に失敗しました:", error);
        });
    }
});
