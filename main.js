// 全局变量
let currentQuestion = 1;
let testAnswers = {};
let cart = [];
let isCartOpen = false;

// 成分数据
const ingredients = {
    tea: {
        icon: '🍃',
        name: '普洱茶提取物',
        desc: '来自云南大叶种普洱茶的天然提取物，富含茶多酚和抗氧化成分，能够有效滋养头皮，改善头皮环境。',
        benefit: '抗氧化、滋养头皮',
        origin: '云南普洱'
    },
    rose: {
        icon: '🌹',
        name: '滇红玫瑰精油',
        desc: '精选云南高原滇红玫瑰，通过传统工艺提取的精油，具有卓越的修复和滋养功效。',
        benefit: '舒缓修复、改善发质',
        origin: '云南大理'
    },
    lavender: {
        icon: '💜',
        name: '高原薰衣草',
        desc: '生长在云南高原的薰衣草，含有丰富的芳香油成分，能够平衡油脂分泌，舒缓头皮。',
        benefit: '平衡油脂、放松身心',
        origin: '云南丽江'
    },
    heshouwu: {
        icon: '🌿',
        name: '野生何首乌',
        desc: '采自云南原始森林的野生何首乌，传统中草药成分，能够强韧发根，促进头发生长。',
        benefit: '强韧发根、促进生长',
        origin: '云南西双版纳'
    }
};

// 产品数据
const products = {
    product1: {
        name: '特效去屑洗发水',
        price: 168,
        image: 'product-lifestyle.png'
    },
    product2: {
        name: '滋养修复洗发水',
        price: 198,
        image: 'product-line.png'
    },
    product3: {
        name: '去屑控油平衡洗发水',
        price: 188,
        image: 'herbs-closeup.png'
    }
};

// P5.js 背景动画
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-background');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '-1');
    canvas.style('opacity', '0.3');
}

function draw() {
    clear();
    
    // 绘制有机粒子
    for (let i = 0; i < 20; i++) {
        let x = (noise(i * 0.01, frameCount * 0.005) * width);
        let y = (noise(i * 0.01 + 100, frameCount * 0.005) * height);
        let size = noise(i * 0.01 + 200, frameCount * 0.005) * 30 + 10;
        
        fill(45, 80, 22, 30);
        noStroke();
        ellipse(x, y, size);
        
        // 添加一些琥珀色的粒子
        if (i % 3 === 0) {
            fill(212, 165, 116, 20);
            ellipse(x + 50, y + 50, size * 0.7);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeProductSlider();
    initializeScrollAnimations();
    loadCartFromStorage();
});

// 初始化动画
function initializeAnimations() {
    // Hero区域动画
    anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    })
    .add({
        targets: '#hero-title',
        opacity: [0, 1],
        translateY: [50, 0],
        delay: 500
    })
    .add({
        targets: '#hero-subtitle',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: 200
    }, '-=800')
    .add({
        targets: '#hero-desc',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: 100
    }, '-=600')
    .add({
        targets: '#hero-btn',
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.8, 1],
        delay: 0
    }, '-=400')
    .add({
        targets: '#hero-image',
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.9, 1],
        delay: 0
    }, '-=200');
}

// 初始化产品轮播
function initializeProductSlider() {
    if (document.querySelector('#product-slider')) {
        new Splide('#product-slider', {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            gap: '1rem',
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            arrows: true,
            pagination: true,
            breakpoints: {
                768: {
                    perPage: 1,
                }
            }
        }).mount();
    }
}

// 初始化滚动动画
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// 发质测试功能
function startHairTest() {
    document.getElementById('hair-test-section').style.display = 'block';
    document.getElementById('hair-test-section').scrollIntoView({ behavior: 'smooth' });
    
    // 重置测试状态
    currentQuestion = 1;
    testAnswers = {};
    updateProgress();
    
    // 隐藏所有问题，只显示第一个
    document.querySelectorAll('.test-question').forEach(q => {
        q.classList.remove('active');
    });
    document.getElementById('question-1').classList.add('active');
    document.getElementById('question-number').textContent = '1';
}

function selectAnswer(questionNum, answer) {
    testAnswers[questionNum] = answer;
    
    // 添加选中效果
    const questionDiv = document.getElementById(`question-${questionNum}`);
    questionDiv.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('border-amber-400', 'bg-amber-50');
    });
    event.target.closest('button').classList.add('border-amber-400', 'bg-amber-50');
    
    // 延迟跳转到下一题
    setTimeout(() => {
        if (questionNum < 5) {
            nextQuestion();
        } else {
            showTestResult();
        }
    }, 500);
}

function nextQuestion() {
    const currentQ = document.getElementById(`question-${currentQuestion}`);
    const nextQ = document.getElementById(`question-${currentQuestion + 1}`);
    
    currentQ.classList.remove('active');
    nextQ.classList.add('active');
    
    currentQuestion++;
    updateProgress();
    document.getElementById('question-number').textContent = currentQuestion;
}

function updateProgress() {
    const progress = (currentQuestion / 5) * 100;
    document.getElementById('test-progress').style.width = progress + '%';
}

function showTestResult() {
    document.getElementById(`question-${currentQuestion}`).classList.remove('active');
    document.getElementById('test-result').style.display = 'block';
    document.getElementById('test-result').classList.add('active');
    
    // 生成个性化推荐
    const resultContent = generateRecommendation();
    document.getElementById('result-content').innerHTML = resultContent;
    
    updateProgress();
}

function generateRecommendation() {
    const answers = testAnswers;
    let recommendation = '';
    let products = [];
    
    // 根据头皮类型推荐
    if (answers[1] === 'oily') {
        recommendation += '<p>✓ 您的头皮偏油性，建议使用控油平衡型洗发水</p>';
        products.push('控油平衡洗发水');
    } else if (answers[1] === 'dry') {
        recommendation += '<p>✓ 您的头皮偏干性，建议使用滋养修复型洗发水</p>';
        products.push('滋养修复洗发水');
    } else {
        recommendation += '<p>✓ 您的头皮类型适中，建议使用特效去屑洗发水</p>';
        products.push('特效去屑洗发水');
    }
    
    // 根据发质特点推荐
    if (answers[2] === 'damaged') {
        recommendation += '<p>✓ 您的发质受损，建议加强修复护理</p>';
        products.push('修复精华');
    } else if (answers[2] === 'fine') {
        recommendation += '<p>✓ 您的发质细软，建议使用丰盈蓬松型产品</p>';
    }
    
    // 根据主要困扰推荐
    if (answers[3] === 'dandruff') {
        recommendation += '<p>✓ 针对头屑问题，推荐使用特效去屑配方</p>';
        products.unshift('特效去屑洗发水');
    }
    
    recommendation += `<p class="font-medium text-amber-600 mt-3">推荐产品：${products.join('、')}</p>`;
    
    return recommendation;
}

function restartTest() {
    document.getElementById('test-result').style.display = 'none';
    startHairTest();
}

function viewRecommendedProducts() {
    window.location.href = 'products.html';
}

// 成分探索功能
function showIngredientDetail(ingredientKey) {
    const ingredient = ingredients[ingredientKey];
    const detailDiv = document.getElementById('ingredient-detail');
    
    document.getElementById('ingredient-icon').textContent = ingredient.icon;
    document.getElementById('ingredient-name').textContent = ingredient.name;
    document.getElementById('ingredient-desc').textContent = ingredient.desc;
    document.getElementById('ingredient-benefit').textContent = ingredient.benefit;
    document.getElementById('ingredient-origin').textContent = ingredient.origin;
    
    detailDiv.style.display = 'block';
    
    // 滚动到详情区域
    detailDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // 添加动画效果
    anime({
        targets: '#ingredient-detail',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutQuad'
    });
}

// 购物车功能
function addToCart(productId) {
    const product = products[productId];
    if (!product) return;
    
    // 检查是否已存在
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    
    // 显示添加成功提示
    showNotification('已添加到购物车');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            updateCartUI();
            saveCartToStorage();
        }
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // 更新购物车数量
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
    
    // 更新购物车内容
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">购物车是空的</p>';
        cartTotal.textContent = '¥0';
    } else {
        let html = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            html += `
                <div class="flex items-center space-x-3 py-3 border-b">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                    <div class="flex-1">
                        <h4 class="font-medium text-sm">${item.name}</h4>
                        <p class="text-amber-600 font-bold">¥${item.price}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" class="w-6 h-6 bg-gray-200 rounded text-sm">-</button>
                        <span class="text-sm">${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})" class="w-6 h-6 bg-gray-200 rounded text-sm">+</button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = html;
        cartTotal.textContent = `¥${total}`;
    }
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    isCartOpen = !isCartOpen;
    
    if (isCartOpen) {
        modal.style.display = 'block';
        anime({
            targets: modal.querySelector('.absolute'),
            translateY: [100, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    } else {
        anime({
            targets: modal.querySelector('.absolute'),
            translateY: [0, 100],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                modal.style.display = 'none';
            }
        });
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('购物车是空的');
        return;
    }
    
    showNotification('正在跳转到结算页面...');
    // 这里可以添加跳转到结算页面的逻辑
}

function saveCartToStorage() {
    localStorage.setItem('dianchaoyuan_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('dianchaoyuan_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// 通知功能
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 动画显示
    anime({
        targets: notification,
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
    
    // 3秒后自动消失
    setTimeout(() => {
        anime({
            targets: notification,
            translateY: [0, -50],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}

// 页面切换动画
function navigateToPage(url) {
    // 添加页面离开动画
    anime({
        targets: 'body',
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuad',
        complete: () => {
            window.location.href = url;
        }
    });
}

// 点击导航项时的处理
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        // 如果是当前页面，阻止默认行为
        if (this.classList.contains('active')) {
            e.preventDefault();
            return;
        }
        
        // 添加点击动画
        anime({
            targets: this,
            scale: [1, 0.95, 1],
            duration: 200,
            easing: 'easeOutQuad'
        });
    });
});

// 触摸反馈
document.addEventListener('touchstart', function(e) {
    if (e.target.closest('button, .nav-item, .ingredient-card')) {
        e.target.style.transform = 'scale(0.98)';
    }
});

document.addEventListener('touchend', function(e) {
    if (e.target.closest('button, .nav-item, .ingredient-card')) {
        e.target.style.transform = 'scale(1)';
    }
});

// 防止页面滚动时的性能问题
let ticking = false;
function updateScrollEffects() {
    // 这里可以添加滚动相关的视觉效果
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停动画
        anime.running.forEach(animation => animation.pause());
    } else {
        // 页面显示时恢复动画
        anime.running.forEach(animation => animation.play());
    }
});
