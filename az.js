document.addEventListener('DOMContentLoaded', () => {
    // 取り扱いメーカーセクションの無限スクロール初期化
    // 両方の行を逆方向にスクロールさせる設定
    const tracks = document.querySelectorAll('.makers-track');
    if (tracks.length) {
        // 上の行と下の行でスクロール方向を反転
        tracks[0].style.animationDirection = 'reverse'; // 上の行は逆方向（左から右へ）
        // 下の行はデフォルト（右から左へ）のままにする
    }
    // 新しいセクションのカウンターアニメーション
    const achievementCounters = document.querySelectorAll('#achievement .counter');
    if (achievementCounters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    achievementCounters.forEach(counter => {
                        // カウンターアニメーションを実行
                        const target = +counter.getAttribute('data-target');
                        const duration = 4500; // ミリ秒単位でアニメーション時間設定（2000から4500に変更）
                        const increment = target / (duration / 16);
                        let current = 0;
                        
                        const updateCounter = () => {
                            current += increment;
                            counter.textContent = Math.floor(current);
                            
                            if (current < target) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target;
                                
                                // カウンターアニメーションが完了したらマスコット画像を表示する
                                if (counter === achievementCounters[achievementCounters.length - 1]) {
                                    const mascotImage = document.querySelector('.achievement-image');
                                    if (mascotImage) {
                                        // 画像のアニメーションを適用
                                        mascotImage.style.animation = 'fadeInFromRight 1s ease forwards';
                                    }
                                }
                            }
                        };
                        
                        updateCounter();
                    });
                    
                    // 一度実行したら監視を解除
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 }); // 10%見えたら実行
        
        // セクションを監視
        const achievementSection = document.getElementById('achievement');
        if (achievementSection) {
            observer.observe(achievementSection);
        }
    }

    // WordPressからニュース記事を取得して表示する関数
    const fetchWordPressNews = async () => {
        const wordpressContainer = document.getElementById('wordpress-news');
        if (!wordpressContainer) return;
        
        try {
            // WordPressのREST APIエンドポイント（サブディレクトリ/wp/にインストールしたWordPressのURL）
            const response = await fetch('https://azmainte.com/wp/wp-json/wp/v2/posts?_embed&per_page=4');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const posts = await response.json();
            
            // 取得した記事をHTMLに変換して表示
            posts.forEach(post => {
                // 画像URLを取得（アイキャッチ画像がある場合）
                let imageUrl = 'image/header-logo.png'; // デフォルト画像
                if (post._embedded && 
                    post._embedded['wp:featuredmedia'] && 
                    post._embedded['wp:featuredmedia'][0] &&
                    post._embedded['wp:featuredmedia'][0].source_url) {
                    imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
                }
                
                // 記事の抜粋を取得（HTMLタグを除去）
                const excerpt = post.excerpt.rendered
                    .replace(/<[^>]*>/g, '')
                    .substring(0, 100) + '...';
                
                // 記事カードのHTMLを作成
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <img src="${imageUrl}" alt="${post.title.rendered}" class="news-image">
                    <div class="news-content">
                        <h3 class="news-title">${post.title.rendered}</h3>
                        <p class="news-excerpt">${excerpt}</p>
                        <a href="${post.link}" class="news-link" target="_blank">詳細を見る <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                
                wordpressContainer.appendChild(newsItem);
            });
            
        } catch (error) {
            console.error('WordPressからのデータ取得に失敗しました:', error);
            
            // エラー時にはダミーデータを表示
            for (let i = 0; i < 4; i++) {
                const dummyItem = document.createElement('div');
                dummyItem.className = 'news-item';
                dummyItem.innerHTML = `
                    <img src="image/header-logo.png" alt="AZメンテナンス" class="news-image">
                    <div class="news-content">
                        <h3 class="news-title">サンプルニュース ${i + 1}</h3>
                        <p class="news-excerpt">これはサンプルのニュース記事です。WordPressが設定されると、ここに実際のニュース記事が表示されます。</p>
                        <a href="#" class="news-link">詳細を見る <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                
                wordpressContainer.appendChild(dummyItem);
            }
        }
    };
    
    // WordPressニュースの取得を実行
    fetchWordPressNews();
    
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
    const worksPrevBtn = document.querySelector('.works-prev-btn');
    const worksNextBtn = document.querySelector('.works-next-btn');
    
    if (worksSlider && worksContainer) {
        const workItems = worksSlider.querySelectorAll('.work-item');
        let isAutoScrolling = true; // 自動スクロールの状態を管理
        let scrollInterval; // 長押し用のインターバルID
        let currentPosition = 0; // 現在のスクロール位置
        let itemWidth; // アイテムの幅
        let originalItemsWidth; // オリジナルアイテムの合計幅
        
        // スライダーの初期化
        const initWorksSlider = () => {
            // 既存のクローンを削除（再初期化時のため）
            const existingClones = worksSlider.querySelectorAll('.work-item-clone');
            existingClones.forEach(clone => clone.remove());
            
            // スライダーを無限ループさせるために、アイテムを複数回複製して追加
            // 最初のセットは既にあるので、さらに5セット追加（合計6セット表示）
            // 多めにクローンを用意しておくことで、高速クリック時にも対応
            for (let i = 0; i < 5; i++) {
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
            
            // アイテムの幅を計算
            itemWidth = workItems[0].offsetWidth + parseInt(window.getComputedStyle(workItems[0]).marginRight);
            originalItemsWidth = workItems.length * itemWidth;
            
            // スライダーのアニメーションを開始
            startWorksAnimation();
        };
        
        // スライダーのアニメーションを開始
        const startWorksAnimation = () => {
            // アニメーションをリセット
            worksSlider.style.animation = 'none';
            worksSlider.offsetHeight; // リフロー（再描画）を強制
            
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
            isAutoScrolling = true;
        };
        
        // 手動スクロール用の関数
        const pauseAutoScroll = () => {
            if (isAutoScrolling) {
                // 現在のトランスフォーム値を取得
                const computedStyle = window.getComputedStyle(worksSlider);
                const matrix = new WebKitCSSMatrix(computedStyle.transform);
                currentPosition = matrix.m41; // translateXの値
                
                // アニメーションを停止
                worksSlider.style.animation = 'none';
                worksSlider.style.transform = `translateX(${currentPosition}px)`;
                isAutoScrolling = false;
            }
        };
        
        // 自動スクロールを再開（現在の位置から）
        const resumeAutoScroll = () => {
            if (!isAutoScrolling) {
                // トランジションを削除
                worksSlider.style.transition = 'none';
                
                // 現在の位置から自動スクロールを再開
                const animationDuration = originalItemsWidth / 80; // 速度調整
                
                // スタイルタグを作成または更新
                let styleTag = document.getElementById('works-animation-style');
                if (!styleTag) {
                    styleTag = document.createElement('style');
                    styleTag.id = 'works-animation-style';
                    document.head.appendChild(styleTag);
                }
                
                // 現在の位置を基準にしたキーフレームを定義
                styleTag.textContent = `
                    @keyframes scrollWorks {
                        0% { transform: translateX(${currentPosition}px); }
                        100% { transform: translateX(${currentPosition - originalItemsWidth}px); }
                    }
                `;
                
                // アニメーションを設定
                worksSlider.style.animation = `scrollWorks ${animationDuration}s linear infinite`;
                isAutoScrolling = true;
            }
        };
        
        // カードのクローンを作成する関数（先行してクローンを追加）
        const createItemClones = (count = 1, prepend = false) => {
            for (let i = 0; i < count; i++) {
                const clonedItems = Array.from(workItems).map(item => {
                    const clone = item.cloneNode(true);
                    clone.classList.add('work-item-clone');
                    
                    // クローンにもホバーエフェクトとクリックイベントを追加
                    clone.addEventListener('mouseenter', () => {
                        clone.style.transition = 'none';
                        clone.style.transform = 'translateY(-0.5rem) scale(1.05)';
                    });
                    
                    clone.addEventListener('mouseleave', () => {
                        clone.style.transition = 'none';
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
                
                // prepend=trueの場合は先頭に追加、そうでなければ末尾に追加
                if (prepend) {
                    // 先頭に追加する場合は逆順で追加（元の順序を維持するため）
                    clonedItems.reverse().forEach(item => worksSlider.prepend(item));
                } else {
                    // 末尾に追加
                    clonedItems.forEach(item => worksSlider.appendChild(item));
                }
            }
        };
        
        // 左方向にスクロール
        const scrollLeft = () => {
            pauseAutoScroll();
            
            // 先行してクローンを追加（高速クリック対応）
            if (currentPosition > -originalItemsWidth) {
                // 先行して左側（先頭）にクローンを追加
                createItemClones(1, true);
                
                // 位置を調整（1セット分左に移動して、見た目を維持）
                currentPosition -= originalItemsWidth;
                worksSlider.style.transform = `translateX(${currentPosition}px)`;
            }
            
            // スムーズなスクロールのためのトランジション設定
            worksSlider.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
            
            // スクロール量を調整
            const scrollAmount = itemWidth * 0.7;
            currentPosition += scrollAmount; // 右に移動（左方向にスクロール）
            
            // 位置を更新
            worksSlider.style.transform = `translateX(${currentPosition}px)`;
            
            // トランジション終了後に古いクローンを削除（表示に影響を与えないタイミングで）
            setTimeout(() => {
                // トランジションを一時的に無効化
                worksSlider.style.transition = 'none';
                
                // 古いクローンを削除（DOM要素が増えすぎないように）
                const oldClones = worksSlider.querySelectorAll('.work-item-clone');
                if (oldClones.length > workItems.length * 6) { // 6セット以上ある場合
                    // 最も古い1セット分を削除
                    for (let i = 0; i < workItems.length; i++) {
                        if (oldClones[i]) oldClones[i].remove();
                    }
                }
                
                // トランジションを再設定
                setTimeout(() => {
                    worksSlider.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
                }, 50);
            }, 650); // トランジションの時間より少し長く
        };
        
        // 右方向にスクロール
        const scrollRight = () => {
            pauseAutoScroll();
            
            // 先行してクローンを追加（高速クリック対応）
            if (currentPosition < -originalItemsWidth * (worksSlider.querySelectorAll('.work-item-clone').length / workItems.length - 1)) {
                // 先行して右側（末尾）にクローンを追加
                createItemClones(1);
            }
            
            // スムーズなスクロールのためのトランジション設定
            worksSlider.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
            
            // スクロール量を調整
            const scrollAmount = itemWidth * 0.7;
            currentPosition -= scrollAmount; // 左に移動（右方向にスクロール）
            
            // 位置を更新
            worksSlider.style.transform = `translateX(${currentPosition}px)`;
            
            // トランジション終了後に古いクローンを削除（表示に影響を与えないタイミングで）
            setTimeout(() => {
                // トランジションを一時的に無効化
                worksSlider.style.transition = 'none';
                
                // 古いクローンを削除（DOM要素が増えすぎないように）
                const oldClones = worksSlider.querySelectorAll('.work-item-clone');
                if (oldClones.length > workItems.length * 6) { // 6セット以上ある場合
                    // 最も古い1セット分を削除
                    for (let i = 0; i < workItems.length; i++) {
                        if (oldClones[i]) oldClones[i].remove();
                    }
                }
                
                // トランジションを再設定
                setTimeout(() => {
                    worksSlider.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
                }, 50);
            }, 650); // トランジションの時間より少し長く
        };
        
        // ボタンのクリック制限（デバウンス）を管理する変数
        let isButtonDisabled = false;
        
        // ボタンを一時的に無効化する関数
        const disableButtons = () => {
            if (!isButtonDisabled) {
                isButtonDisabled = true;
                
                // ボタンの見た目を無効化状態に
                if (worksPrevBtn) worksPrevBtn.style.opacity = '0.5';
                if (worksNextBtn) worksNextBtn.style.opacity = '0.5';
                
                // 0.7秒後に再度有効化
                setTimeout(() => {
                    isButtonDisabled = false;
                    // ボタンの見た目を元に戻す
                    if (worksPrevBtn) worksPrevBtn.style.opacity = '1';
                    if (worksNextBtn) worksNextBtn.style.opacity = '1';
                }, 700); // 0.7秒間無効化
            }
        };
        
        // 左ボタンのイベント
        if (worksPrevBtn) {
            // クリック時
            worksPrevBtn.addEventListener('click', () => {
                if (!isButtonDisabled) {
                    scrollLeft();
                    disableButtons(); // ボタンを無効化
                }
            });
            
            // タッチデバイス対応
            worksPrevBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (!isButtonDisabled) {
                    scrollLeft();
                    disableButtons(); // ボタンを無効化
                }
            });
        }
        
        // 右ボタンのイベント
        if (worksNextBtn) {
            // クリック時
            worksNextBtn.addEventListener('click', () => {
                if (!isButtonDisabled) {
                    scrollRight();
                    disableButtons(); // ボタンを無効化
                }
            });
            
            // タッチデバイス対応
            worksNextBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (!isButtonDisabled) {
                    scrollRight();
                    disableButtons(); // ボタンを無効化
                }
            });
        }
        
        // スライダーの初期化
        initWorksSlider();
        
        // ウィンドウリサイズ時にアニメーションを再調整
        window.addEventListener('resize', () => {
            // 少し遅延させて実行（リサイズ中に何度も実行されるのを防ぐ）
            clearTimeout(window.resizeWorksTimer);
            window.resizeWorksTimer = setTimeout(() => {
                initWorksSlider(); // リサイズ時は完全に再初期化
            }, 200);
        });
        
        // マウスオーバー時にアニメーションを一時停止
        worksContainer.addEventListener('mouseenter', () => {
            if (isAutoScrolling) {
                worksSlider.style.animationPlayState = 'paused';
            }
        });
        
        // マウスアウト時にアニメーションを再開
        worksContainer.addEventListener('mouseleave', () => {
            if (isAutoScrolling) {
                worksSlider.style.animationPlayState = 'running';
            } else {
                // すぐに自動スクロールを再開（遅延なし）
                resumeAutoScroll();
            }
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
