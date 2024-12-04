document.addEventListener('DOMContentLoaded', () => {
    // スクロール禁止の関数
    const preventScroll = (e) => {
        e.preventDefault();
    };

    // 初回訪問時のみスクロールを禁止
    if (!sessionStorage.getItem('hasSeenAnimation')) {
        // スクロール禁止を設定
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('touchmove', preventScroll, { passive: false });

        // 6秒後にスクロール禁止を解除
        setTimeout(() => {
            document.removeEventListener('wheel', preventScroll);
            document.removeEventListener('touchmove', preventScroll);
        }, 6000);
    }

    // アニメーション表示済みかチェック
    const hasSeenAnimation = sessionStorage.getItem('hasSeenAnimation');
    
    if (!hasSeenAnimation) {
        // 初回訪問時のアニメーション
        const loadingOverlay = document.querySelector('.loading-overlay');
        const initialLogos = document.querySelectorAll('.logo-animation-initial img');
        const finalLogoContainer = document.querySelector('.logo-animation');
        
        // 順番にロゴを表示
        initialLogos.forEach((logo, index) => {
            setTimeout(() => {
                logo.style.opacity = '1';
            }, index * 50);
        });

        // すべてのロゴが表示された後に左上へ移動
        setTimeout(() => {
            initialLogos.forEach((logo) => {
                logo.style.left = '5%';
                logo.style.top = '10%';
                logo.style.filter = 'brightness(0) invert(1)';
            });

            setTimeout(() => {
                setTimeout(() => {
                    loadingOverlay.style.opacity = '0';
                    initialLogos.forEach((logo) => {
                        logo.style.opacity = '0';
                    });
                    finalLogoContainer.style.opacity = '1';
                    
                    setTimeout(() => {
                        loadingOverlay.remove();
                        document.querySelector('.logo-animation-initial').remove();
                    }, 1500);
                }, 700);
            }, 50);
        }, initialLogos.length * 150 + 600);

        // アニメーション表示済みをセット
        sessionStorage.setItem('hasSeenAnimation', 'true');
    } else {
        // 2回目以降の訪問時は即座に要素を削除
        const loadingOverlay = document.querySelector('.loading-overlay');
        const initialLogosContainer = document.querySelector('.logo-animation-initial');
        const finalLogoContainer = document.querySelector('.logo-animation');
        
        if (loadingOverlay) loadingOverlay.remove();
        if (initialLogosContainer) initialLogosContainer.remove();
        if (finalLogoContainer) finalLogoContainer.style.opacity = '1';
    }

    // カウンターアニメーション関数
    function animateCounter() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // アニメーション時間（ミリ秒）
            const increment = target / (duration / 16); // 60FPSで計算
            
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
        });
    }

    // スクロール検知による要素のアニメーション
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 地図のアニメーション用Observer
    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'map3DFlip 1.2s ease-out forwards';
            }
        });
    }, {
        threshold: 0.7
    });

    // カウンター用Observer
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // アニメーション対象要素の監視を開始
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // 地図要素の監視を開始
    const map = document.querySelector('.company-map');
    if (map) {
        map.style.opacity = '0';
        mapObserver.observe(map);
    }

    // カウンター要素の監視を開始
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // 動画の自動再生設定
    const video = document.getElementById('myVideo');
    if (video) {
        video.play().catch(function(error) {
            console.log("動画の自動再生に失敗しました:", error);
        });
    }

    // ヘッダーとナビゲーションの表示/非表示制御
    const header = document.querySelector('.header');
    const videoContainer = document.querySelector('.video-container');
    const sectionNav = document.querySelector('.section-nav');

    const updateVisibility = () => {
        const videoBottom = videoContainer.offsetTop + videoContainer.offsetHeight;
        const scrollPosition = window.scrollY;

        // ヘッダーの表示/非表示
        if (scrollPosition < videoBottom) {
            header.style.opacity = '0';
            header.style.pointerEvents = 'none';
        } else {
            header.style.opacity = '1';
            header.style.pointerEvents = 'auto';
        }

        // セクションナビの表示/非表示
        if (scrollPosition >= videoBottom) {
            sectionNav.style.display = 'none';
        } else {
            sectionNav.style.display = 'flex';
        }
    };

    // 初期表示時とスクロール時に表示/非表示を制御
    updateVisibility();
    window.addEventListener('scroll', updateVisibility);

    // Aboutセクションのホバーエフェクト
    const hoverAreaLeft = document.querySelector('.hover-area-left');
    const hoverAreaRight = document.querySelector('.hover-area-right');
    const aboutTextH3 = document.querySelector('.about-text h3');
    const aboutTextP = document.querySelector('.about-text p');
    
    if (hoverAreaLeft && aboutTextH3) {
        hoverAreaLeft.addEventListener('mouseenter', () => {
            aboutTextH3.style.opacity = '0';
        });

        hoverAreaLeft.addEventListener('mouseleave', () => {
            aboutTextH3.style.opacity = '1';
        });
    }

    if (hoverAreaRight && aboutTextP) {
        hoverAreaRight.addEventListener('mouseenter', () => {
            aboutTextP.style.opacity = '0';
        });

        hoverAreaRight.addEventListener('mouseleave', () => {
            aboutTextP.style.opacity = '1';
        });
    }

    // ナビゲーションリンクのスクロール位置調整
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offset = -30;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
