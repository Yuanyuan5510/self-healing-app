// 导入语言模块
import { languages, getCurrentLanguage, setCurrentLanguage } from './lang.js';

// DOM元素
const splashScreen = document.getElementById('splash-screen');
const splashProgressBar = document.getElementById('splash-progress-bar');
const appContainer = document.getElementById('app-container');
const langEnBtn = document.getElementById('lang-en');
const langZhBtn = document.getElementById('lang-zh');

// UI元素映射
const uiElements = {
    appTitle: document.getElementById('app-title'),
    inputFileLabel: document.getElementById('input-file-label'),
    outputPathLabel: document.getElementById('output-path-label'),
    compressBtn: document.getElementById('compressBtn'),
    decompressionTitle: document.getElementById('decompression-title'),
    zipFileLabel: document.getElementById('zip-file-label'),
    extractDirLabel: document.getElementById('extract-dir-label'),
    decompressBtn: document.getElementById('decompressBtn'),
    outputTitle: document.getElementById('output-title'),
    previewInputFolderBtn: document.getElementById('previewInputFolder'),
    previewModalTitle: document.getElementById('previewTitle'),
    closePreviewBtn: document.getElementById('closePreview')
};

// 模拟启动进度
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) {
            progress = 100;
            clearInterval(interval);
            
            // 进度完成后，隐藏启动画面，显示主内容
            setTimeout(() => {
                splashScreen.classList.add('fade-out');
                setTimeout(() => {
                    appContainer.classList.add('visible');
                    document.body.style.overflow = 'auto';
                }, 1000);
            }, 500);
        }
        splashProgressBar.style.width = `${progress}%`;
    }, 300);
}

// 更新UI语言
function updateUILanguage(lang) {
    const translations = languages[lang];
    if (!translations) return;

    // 更新标题
    document.title = translations.title;
    
    // 更新其他UI元素
    uiElements.appTitle.textContent = translations.title;
    uiElements.inputFileLabel.textContent = translations.inputFileLabel;
    uiElements.outputPathLabel.textContent = translations.outputPathLabel;
    uiElements.compressBtn.textContent = translations.compressBtn;
    uiElements.decompressionTitle.textContent = translations.decompressionSection;
    uiElements.zipFileLabel.textContent = translations.zipFileLabel;
    uiElements.extractDirLabel.textContent = translations.extractDirLabel;
    uiElements.decompressBtn.textContent = translations.decompressBtn;
    uiElements.outputTitle.textContent = translations.outputTitle;
    
    // 更新预览按钮文本
    if (uiElements.previewInputFolderBtn) {
        uiElements.previewInputFolderBtn.textContent = translations.previewFolderBtn;
    }
    
    // 更新预览弹窗关闭按钮文本
    if (uiElements.closePreviewBtn) {
        uiElements.closePreviewBtn.textContent = 'Close'; // 这个保持英文比较合适
    }

    // 更新启动画面文本（如果它仍然可见）
    const splashText = document.getElementById('splash-text');
    if (splashText && !splashScreen.classList.contains('fade-out')) {
        splashText.textContent = translations.title;
    }

    // 更新所有浏览按钮
    document.querySelectorAll('.browse-btn').forEach(btn => {
        // 为预览按钮设置特殊文本
        if (btn.id === 'previewInputFolder') {
            return;
        }
        // 为输入文件浏览按钮设置特殊文本
        if (btn.id === 'browseInput') {
            btn.textContent = translations.browseFilesBtn;
        } else {
            btn.textContent = translations.browseBtn;
        }
    });

    // 保存语言设置
    setCurrentLanguage(lang);

    // 更新语言按钮状态
    langEnBtn.classList.toggle('active', lang === 'en');
    langZhBtn.classList.toggle('active', lang === 'zh');

    // 通知其他组件语言已更改
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// 初始化应用
function initApp() {
    // 显示启动动画
    simulateLoading();

    // 应用当前语言设置
    const currentLang = getCurrentLanguage();
    updateUILanguage(currentLang);

    // 添加语言切换事件监听器
    langEnBtn.addEventListener('click', () => updateUILanguage('en'));
    langZhBtn.addEventListener('click', () => updateUILanguage('zh'));

    // 暴露语言功能到window对象，供renderer.js使用
    window.appLang = {
        getCurrentLanguage,
        setCurrentLanguage,
        updateUILanguage,
        languages
    };
}

// 当DOM加载完成后初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}