const panelVersion = window.GetProperty('_theme_version (do not hand edit!)', '2.0.3');
window.DefineScript('AlbumArtScalingTest', {author: 'Mordred', version: panelVersion, features: {drag_n_drop: true} });

const basePath = '';
let is_4k = false;

function loadAsyncFile(filePath) {
    return new Promise(resolve => {
        setTimeout(() => {
            include(filePath);
            resolve();
        }, 0);
    })
}

const loadAsync = window.GetProperty('Load Theme Asynchronously', true);
async function includeFiles(fileList) {
    if (loadAsync) {
        let startTime = Date.now();
        const refreshTime = 16; // ~60Hz
        for (let i = 0; i < fileList.length; i++) {
            loadStrs.fileName = fileList[i] + ' ...';
            loadStrs.fileIndex = i;
            const currentTime = Date.now();
            if (currentTime - startTime > refreshTime) {
                startTime = currentTime;
                window.Repaint();
            }
            await loadAsyncFile(basePath + fileList[i]);
        }
    } else {
        fileList.forEach(filePath => include(filePath));
    }
}

const loadStrs = {
    loading: 'Loading:',
    fileName: '',
    fileIndex: 0,
};
const startTime = Date.now();
const fileList = [
    'helpers.js',
    'common.js',
    'themes.js',
    'settings-view.js',
    'albumart-scaling.js'
];
includeFiles(fileList).then(() => {
});

// this function will be overridden once the theme loads
function on_paint(gr) {
    const rgb = (r, g, b) => { return (0xff000000 | (r << 16) | (g << 8) | (b)); }
    const col = {};

    col.bg = rgb(50, 54, 57);
    col.menu_bg = rgb(23, 23, 23);
    col.now_playing = rgb(255, 255, 255);
    col.progressFill = rgb(255,255,255);
    const ww = window.Width;
    const wh = window.Height;

    gr.FillSolidRect(0, 0, ww, wh, col.bg);
    // gr.FillSolidRect(0, 0, ww, menuHeight, col.menu_bg);
}
