document.addEventListener('DOMContentLoaded', () => {
    // 施工事例のモーダルウィンドウ機能
    const workItems = document.querySelectorAll('.work-item');
    const modal = document.getElementById('workModal');
    const modalClose = document.querySelector('.modal-close');
    const modalBeforeImg = document.getElementById('modalBeforeImg');
    const modalAfterImg = document.getElementById('modalAfterImg');
    const body = document.body;
    
    // 施工事例カードのホバーエフェクトを即時適用（CSSトランジションを使わない）
    workItems.forEach(item => {
        // マウスオーバー時に即座に拡大
        item.addEventListener('mouseenter', () => {
            // CSSトランジションを無効化
            item.style.transition = 'none';
            // 即座に拡大
            item.style.transform = 'translateY(-0.5rem) scale(1.05)';
        });
        
        // マウスアウト時に即座に元のサイズに戻す
        item.addEventListener('mouseleave', () => {
            // CSSトランジションを無効化
            item.style.transition = 'none';
            // 即座に元のサイズに戻す
            item.style.transform = '';
        });
        
        // クリックイベント
        item.addEventListener('click', () => {
            // カード内の画像のURLを取得
            const beforeImg = item.querySelector('.work-before img').src;
            const afterImg = item.querySelector('.work-after img').src;
            
            // モーダル内の画像にURLをセット
            modalBeforeImg.src = beforeImg;
            modalAfterImg.src = afterImg;
            
            // モーダルを表示
            modal.classList.add('show');
            body.classList.add('no-scroll'); // スクロールを無効化
        });
    });
    
    // 閉じるボタンのクリックイベント
    modalClose.addEventListener('click', () => {
        modal.classList.remove('show');
        body.classList.remove('no-scroll'); // スクロールを有効化
    });
    
    // モーダルの外側をクリックしたときにも閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            body.classList.remove('no-scroll'); // スクロールを有効化
        }
    });
    
    // 施工事例スライダーの実装（常に動き続けるバージョン）
    const worksSlider = document.querySelector('.works-slider');
    const worksContainer = document.querySelector('.works-container');
    
    if (worksSlider && worksContainer) {
        const workItems = worksSlider.querySelectorAll('.work-item');
        
        // スライダーの初期化
        const initWorksSlider = () => {
            // 既存のクローンを削除（再初期化時のため）
            const existingClones = worksSlider.querySelectorAll('.work-item-clone');
            existingClones.forEach(clone => clone.remove());
            
            // スライダーを無限ループさせるために、アイテムを複数回複製して追加
            // 最初のセットは既にあるので、さらに2セット追加（合計3セット表示）
            for (let i = 0; i < 2; i++) {
                const clonedItems = Array.from(workItems).map(item => {
                    const clone = item.cloneNode(true);
                    clone.classList.add('work-item-clone'); // クローンにクラスを追加（再初期化時の識別用）
                    
                    // クローンにもホバーエフェクトとクリックイベントを追加
                    clone.addEventListener('mouseenter', () => {
                        // CSSトランジションを無効化
                        clone.style.transition = 'none';
                        // 即座に拡大
                        clone.style.transform = 'translateY(-0.5rem) scale(1.05)';
                    });
                    
                    clone.addEventListener('mouseleave', () => {
                        // CSSトランジションを無効化
                        clone.style.transition = 'none';
                        // 即座に元のサイズに戻す
                        clone.style.transform = '';
                    });
                    
                    clone.addEventListener('click', () => {
                        const beforeImg = clone.querySelector('.work-before img').src;
                        const afterImg = clone.querySelector('.work-after img').src;
                        
                        modalBeforeImg.src = beforeImg;
                        modalAfterImg.src = afterImg;
                        
                        modal.classList.add('show');
                        body.classList.add('no-scroll');
                    });
                    
                    return clone;
                });
                clonedItems.forEach(item => worksSlider.appendChild(item));
            }
            
            // スライダーのアニメーションを開始
            startWorksAnimation();
        };
        
        // スライダーのアニメーションを開始
        const startWorksAnimation = () => {
            // アニメーションをリセット
            worksSlider.style.animation = 'none';
            worksSlider.offsetHeight; // リフロー（再描画）を強制
            
            // スライダーの幅を計算
            const itemWidth = workItems[0].offsetWidth + parseInt(window.getComputedStyle(workItems[0]).marginRight);
            const originalItemsWidth = workItems.length * itemWidth;
            
            // 施工事例セクションのカードの移動速度
            const animationDuration = originalItemsWidth / 80; // 速度調整（1セット分の幅で計算）- 200から80に変更してスピードを遅く
            
            // スタイルタグを作成または更新
            let styleTag = document.getElementById('works-animation-style');
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'works-animation-style';
                document.head.appendChild(styleTag);
            }
            
            // キーフレームを定義
            styleTag.textContent = `
                @keyframes scrollWorks {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-${originalItemsWidth}px); }
                }
            `;
            
            // アニメーションを設定
            worksSlider.style.animation = `scrollWorks ${animationDuration}s linear infinite`;
        };
        
        // スライダーの初期化
        initWorksSlider();
        
        // ウィンドウリサイズ時にアニメーションを再調整
        window.addEventListener('resize', () => {
            // 少し遅延させて実行（リサイズ中に何度も実行されるのを防ぐ）
            clearTimeout(window.resizeWorksTimer);
            window.resizeWorksTimer = setTimeout(() => {
                startWorksAnimation();
            }, 200);
        });
        
        // マウスオーバー時にアニメーションを一時停止
        worksContainer.addEventListener('mouseenter', () => {
            worksSlider.style.animationPlayState = 'paused';
        });
        
        // マウスアウト時にアニメーションを再開
        worksContainer.addEventListener('mouseleave', () => {
            worksSlider.style.animationPlayState = 'running';
        });
    }
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
    
    // 口コミスライダーの実装
    const reviewsSlider = document.querySelector('.reviews-slider');
    const sliderDots = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (reviewsSlider) {
        const reviewCards = reviewsSlider.querySelectorAll('.review-card');
        let cardWidth = reviewCards[0].offsetWidth + parseInt(window.getComputedStyle(reviewCards[0]).marginRight);
        let currentIndex = 0;
        let autoSlideInterval;
        
        // スライダーの初期化
        const initSlider = () => {
            // カードの幅を再計算
            cardWidth = reviewCards[0].offsetWidth + parseInt(window.getComputedStyle(reviewCards[0]).marginRight);
            
            // スライダーの幅を設定
            reviewsSlider.style.width = `${cardWidth * reviewCards.length}px`;
            
            // 各カードの幅を設定
            reviewCards.forEach(card => {
                card.style.width = `${cardWidth}px`;
            });
            
            // 初期位置に移動
            goToSlide(0);
        };
        
        // スライダードットの生成（3つのグループに対応する3つのドット）
        const totalGroups = Math.ceil(reviewCards.length / 3); // 3枚ずつのグループ数を計算
        
        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i * 3); // 各グループの最初のカードのインデックス
                resetAutoSlide();
            });
            sliderDots.appendChild(dot);
        }
        
        // スライドを指定位置に移動
        const goToSlide = (index) => {
            // モバイル表示では1枚ずつ、PC表示では3枚ずつ表示
            const isMobile = window.innerWidth <= 768;
            const visibleCards = isMobile ? 1 : 3;
            
            // 最大インデックスを計算（表示枚数を考慮）
            const maxIndex = reviewCards.length - visibleCards;
            
            // インデックスの範囲を制限
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            
            // スライダーの位置を更新
            reviewsSlider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            // アクティブなドットを更新（3枚ずつのグループに対応）
            const activeGroupIndex = Math.floor(currentIndex / 3); // 現在のグループのインデックス
            document.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === activeGroupIndex);
            });
            
            // すべてのカードを完全に表示
            reviewCards.forEach((card) => {
                card.style.opacity = '1';
                card.style.visibility = 'visible';
            });
        };
        
        // 前のスライドへ
        const goToPrevSlide = () => {
            // モバイル表示では1枚ずつ、PC表示では3枚ずつ表示
            const isMobile = window.innerWidth <= 768;
            const step = isMobile ? 1 : 3; // モバイルでは1枚ずつ、PCでは3枚ずつ移動
            const visibleCards = isMobile ? 1 : 3;
            const maxIndex = reviewCards.length - visibleCards;
            
            // 前のインデックスを計算
            let prevIndex = currentIndex - step;
            
            // 最初のスライドより前に戻ったら最後に移動
            if (prevIndex < 0) {
                // 最後のスライドグループの開始位置に移動
                // 例：9枚のカードがあり、3枚ずつ表示する場合、最後のグループは6から始まる
                prevIndex = Math.floor(maxIndex / step) * step;
                if (prevIndex > maxIndex) prevIndex = maxIndex;
            }
            
            goToSlide(prevIndex);
            resetAutoSlide();
        };
        
        // 次のスライドへ
        const goToNextSlide = () => {
            // モバイル表示では1枚ずつ、PC表示では3枚ずつ表示
            const isMobile = window.innerWidth <= 768;
            const visibleCards = isMobile ? 1 : 3;
            const step = isMobile ? 1 : 3; // モバイルでは1枚ずつ、PCでは3枚ずつ移動
            const maxIndex = reviewCards.length - visibleCards;
            
            // 次のインデックスを計算
            let nextIndex = currentIndex + step;
            
            // 最後のスライドを超えたら最初に戻る
            if (nextIndex > maxIndex) {
                nextIndex = 0;
            }
            
            goToSlide(nextIndex);
            resetAutoSlide();
        };
        
        // 自動スライド機能
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(goToNextSlide, 8000); // 8秒ごとに次のスライドへ
        };
        
        // 自動スライドのリセット
        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };
        
        // ボタンイベントの設定
        if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);
        if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);
        
        // スライダーの初期化
        initSlider();
        
        // ウィンドウリサイズ時にスライダーを再初期化
        window.addEventListener('resize', () => {
            // 少し遅延させて実行（リサイズ中に何度も実行されるのを防ぐ）
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(() => {
                initSlider();
            }, 200);
        });
        
        // 自動スライドの開始
        startAutoSlide();
    }

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

    // モバイル表示時のサービス項目クリック制御
    const isMobile = window.innerWidth <= 768;
    
    // サービス項目の取得
    const serviceItems = document.querySelectorAll('.service-item');
    const detailLinks = document.querySelectorAll('.detail-link');
    
    if (isMobile) {
        // モバイル表示の場合
        serviceItems.forEach(item => {
            // 項目全体のクリックイベントを無効化
            item.onclick = null;
            item.style.cursor = 'default';
        });
        
        // DETAILリンクにクリックイベントを設定
        detailLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation(); // 親要素へのイベント伝播を停止
                const parentItem = this.closest('.service-item');
                const url = parentItem.getAttribute('onclick').replace("window.location.href='", "").replace("'", "");
                window.location.href = url;
            });
        });
    }
    
    // ウィンドウサイズ変更時にも対応
    window.addEventListener('resize', function() {
        const isMobileNow = window.innerWidth <= 768;
        if (isMobileNow !== isMobile) {
            location.reload(); // 表示モードが変わったらページを再読み込み
        }
    });
});
