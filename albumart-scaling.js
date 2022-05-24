const scriptPath = 'D:\\Source\\spidermonkey-albumart-scaling\\';
const images = ['2560x2560.jpg', '2000x2000.jpg', '1500x1500.jpg', '1000x1000.jpg'];
const modes = Object.keys(InterpolationMode).filter(k => InterpolationMode[k] > 0);
let interpolationMode = InterpolationMode.LowQuality;
let activeImage = 0;
let rescaleArt = false;
const imageArray = [];
let scaledImg = null;
let ww = 0;
let wh = 0;

const interpolationModeChanged = (index) => {
    console.log(index, modes[index], InterpolationMode[modes[index]]);
    // SetInterpolationMode(InterpolationMode[modes[index]]);
    interpolationMode = InterpolationMode[modes[index]];
    scaledImg = null;
    window.Repaint();
}

const imageChanged = (index) => {
    activeImage = index;
    console.log(images[index]);
    window.Repaint();
}

const rescale = (value) => {
    rescaleArt = value;
    console.log('rescale', value);
    window.Repaint();
}

const reload = (value) => {
    window.Reload();
}

const loadImages = () => {
    images.forEach((path, index) => {
        const fullPath = `${scriptPath}images\\${path}`;
        imageArray[index] = gdi.Image(fullPath);
        console.log(path + ':', imageArray[index].Height);
    });
}

const on_init = () => {
    const labelFont = 'Segoe Ui Semibold';
    // const textFont = 'HelveticaNeueLT Pro 65 Md';

    ft.label = font(labelFont, 16, 0);
    // ft.label = font('Roboto', 16, 0);
    ft.value = font(labelFont, 16, 0);
    // ft.roboto = font('Roboto', 18, 0);
    // ft.fixed = font('Open Sans', 16, 0);
    ft.segoe = font('Segoe Ui Semibold', 16, 0);
    ft.Marlett = font('Marlett', 20, 0);    // don't resize this
    // initSettingsView();
    on_size();
    loadImages();
    setupUI();
    window.Repaint();
}

/**
 * @param {GdiGraphics} gr
 */
function on_paint(gr) {
    gr.SetInterpolationMode(interpolationMode);
    draw(gr);
    drawSettingsView(gr);
}

function on_size() {
	ww = window.Width;
	wh = window.Height;
    scaledImg = null;
    window.Repaint();
}

const getMinDimension = () => Math.min(window.Width, window.Height) - 45;

/**
 * @param {GdiGraphics} gr
 */
function draw(gr) {
    gr.FillSolidRect(0, 0, window.Width, window.Height, rgb(220,222,224));
    let img;
    const minDimension = getMinDimension();
    if (rescaleArt) {
        if (!scaledImg) {
            scaledImg = imageArray[activeImage].Resize(minDimension, minDimension, interpolationMode);
            console.log(`Scaling image to ${minDimension}x${minDimension}`);
        }
        img = scaledImg;
        // gr.SetInterpolationMode(1);
    } else {
        gr.SetInterpolationMode(interpolationMode);
        img = imageArray[activeImage];
    }
    gr.DrawImage(img, 230, 40, minDimension, minDimension, 0, 0, img.Width, img.Height);
}

function setupUI() {
    let top = 10;
    let controlPadding = 15;
    // const test = new StringInput('Text Input:', 'abcdefghijklmnopqrstuvwxyz', 20, top, 200, 400, ft.value);
    // controlList.push(test);
    // controlList.push(new StringInput('Text Input:', 'You can double click this text if you want to', 20, top += controlList[controlList.length - 1].h + controlPadding, 200, 400, ft.label));

    // const toggle = new ToggleControl('Toggle Control:', false, 20, top += controlList[controlList.length - 1].h + controlPadding, 200, ft.label);
    // controlList.push(toggle);
    // controlList.push(new ToggleControl('Toggle Control:', true, 20, top += controlList[controlList.length - 1].h + controlPadding, 200, ft.label));
    // controlList.push(new ToggleControl('Blue Toggle', true, 20, top += controlList[controlList.length - 1].h + controlPadding, 200, ft.label, colors.darkBlue));
    controlList.push(new RadioGroup(20, top, modes, ft.label, true, 0, undefined, interpolationModeChanged));

    const select = new Select(20, top += controlList[controlList.length - 1].h + controlPadding, 'Choose an option', 200, images, ft.label, 0, imageChanged);
    controlList.push(select);   // adding after other select so we don't have z-index issues when select is up
    // controlList.push(new Select(420, 250 + select.h + controlPadding, 'Select an option', 200, ['Option 1', 'Option 2', 'Long Option'], ft.label, 1));

    controlList.push(new Checkbox('Rescale Img', false, 20, top += controlList[controlList.length - 1].h + controlPadding, 300, ft.label, rgb(0, 0, 0), rescale));
    controlList.push(new Checkbox('Rescale Img', false, 20, top += controlList[controlList.length - 1].h + controlPadding, 300, ft.label, rgb(0, 0, 0), rescale));
    controlList.push(new ButtonCtrl(20, top += controlList[controlList.length - 1].h + controlPadding, 'Reload', ft.label, reload))

    // controlList.push(new Checkbox('Click my checkbox too!', true, 20, top += controlList[controlList.length - 1].h + controlPadding, 300, ft.label));
    // controlList.push(new Checkbox('Super pink', true, 20, top += controlList[controlList.length - 1].h + controlPadding, 300, ft.label, colors.pink));
    // controlList.push(new RadioGroup(20, top += controlList[controlList.length - 1].h + controlPadding, ['Option 1', 'Option 2', 'Option 3'], ft.label, false, 1, colors.darkBlue));
    // console.log(Object.keys(InterpolationMode));
    window.Repaint();
}

on_init();