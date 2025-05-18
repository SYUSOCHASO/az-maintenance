document.addEventListener('DOMContentLoaded', function() {
    // すべてのreform-itemを取得
    const items = document.querySelectorAll('.reform-item');
    
    // 各項目を常に開いた状態にする
    items.forEach(item => {
        // すべての項目を自動的に開く
        item.classList.add('active');
        
        // h2要素のクリックイベントを無効化
        const title = item.querySelector('h2');
        if (title) {
            title.style.cursor = 'default'; // カーソルを通常に戻す
            
            // 既存のイベントリスナーを無効化するためにシンプルなダミー関数を設定
            title.addEventListener('click', function(e) {
                e.preventDefault(); // クリックイベントを無効化
                return false;
            });
        }
    });
});
