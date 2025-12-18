'use strict';
/* global ppt:readable, $:readable, WshShell:readable, doc:readable */
/* exported PopUpBox */

class PopUpBox {
	constructor() {
		this.getHtmlCode();
		this.ok = true;
		this.soFeat = { clipboard: true, gecko: true };
	}

	// Methods

	config(cfg, ppt, cfgWindow, ok_callback) {
		utils.ShowHtmlDialog(0, this.configHtmlCode, {
			data: [cfg, ppt, cfgWindow, ok_callback],
			resizable: true
		});
	}

	confirm(msg_title, msg_content, btn_yes_label, btn_no_label, height_adjust, h_center, confirm_callback) {
		utils.ShowHtmlDialog(0, this.confirmHtmlCode, {
			data: [msg_title, msg_content, btn_yes_label, btn_no_label, height_adjust, h_center, confirm_callback]
		});
	}

	getHtmlCode() {
		let cssPath = `${my_utils.packagePath}/assets/html/`;
		if (this.getWindowsVersion() === '6.1') {
			cssPath += 'styles7.css';
		} else {
			cssPath += 'styles10.css';
		}
		this.configHtmlCode = my_utils.getAsset('\\html\\config.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.inputHtmlCode = my_utils.getAsset('\\html\\input.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.messageHtmlCode = my_utils.getAsset('\\html\\messageBox.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.confirmHtmlCode = my_utils.getAsset('\\html\\confirm.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
	}

	getWindowsVersion() {
		let version = '';
		try {
			version = (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMajorVersionNumber')).toString();
			version += '.';
			version += (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMinorVersionNumber')).toString();
			return version;
		} catch (e) { /* empty */ } // eslint-disable-line no-unused-vars
		try {
			version = WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion');
			return version;
		} catch (e) { /* empty */ } // eslint-disable-line no-unused-vars
		return '6.1';
	}

	input(title, msg, ok_callback, input, def) {
		utils.ShowHtmlDialog(0, this.inputHtmlCode, {
			data: [title, msg, '取消', ok_callback, input, def]
		});
	}

	isHtmlDialogSupported() {
		if (ppt.isHtmlDialogSupported != 2) return ppt.isHtmlDialogSupported;

		if (typeof doc === 'undefined' || !doc) {
			this.soFeat.gecko = false;
		}
		if (this.soFeat.gecko) {
			let cache = null;
			let clText = 'test';
			try {
				cache = doc.parentWindow.clipboardData.getData('Text');
			} catch (e) { /* empty */ } // eslint-disable-line no-unused-vars
			try {
				doc.parentWindow.clipboardData.setData('Text', clText);
				clText = doc.parentWindow.clipboardData.getData('Text');
			} catch (e) { // eslint-disable-line no-unused-vars
				this.soFeat.clipboard = false;
			}
			if (cache) { // Just in case previous clipboard data is needed
				try {
					doc.parentWindow.clipboardData.setData('Text', cache);
				} catch (e) { /* empty */ } // eslint-disable-line no-unused-vars
			}
			if (clText !== 'test') {
				this.soFeat.clipboard = false;
			}
		} else {
			this.soFeat.clipboard = false;
		}

		ppt.isHtmlDialogSupported = this.soFeat.gecko && this.soFeat.clipboard || this.isIEInstalled() ? 1 : 0;
		if (!ppt.isHtmlDialogSupported) {
			const caption = '显示 HTML 面板设置';
			const prompt = '功能检查表明，当前操作系统不支持 Spider Monkey Panel 显示 Html 对话框。\n\n此对话框用于显示选项设置。关闭后，控制台将显示替代方案。\n\n注：兼容性检测偶尔可能出现误判。若你使用 Windows 系统且支持 Internet Explorer，可尝试输入 1 并确认以启用功能。\n\n该设置将保存为面板属性的首选项，后续可随时修改。\n\n支持-1；不支持-0';
			let ns = '';
			let status = 'ok';
			try {
				ns = utils.InputBox(0, prompt, caption, ppt.isHtmlDialogSupported, true);
			} catch (e) { // eslint-disable-line no-unused-vars
				status = 'cancel';
			}
			if (status != 'cancel') {
				ppt.isHtmlDialogSupported = ns == 0 ? 0 : 1;
			}
		}
		return ppt.isHtmlDialogSupported;
	}

	isIEInstalled() {
		const diskLetters = Array.from(Array(26)).map((e, i) => i + 65).map((x) => `${String.fromCharCode(x)}:\\`);
		const paths = ['Program Files\\Internet Explorer\\ieinstal.exe', 'Program Files (x86)\\Internet Explorer\\ieinstal.exe'];
		return diskLetters.some(d => {
			try { // Needed when permission error occurs and current SMP implementation is broken for some devices....
				return utils.IsDirectory(d) ? paths.some(p => utils.IsFile(d + p)) : false;
			} catch (e) { return false; } // eslint-disable-line no-unused-vars
		});
	}

	message() {
		utils.ShowHtmlDialog(0, this.messageHtmlCode, {
			data: [this.window_ok_callback, $.scale],
			selection: true
		});
	}

	window_ok_callback(status, clicked) {
		if (clicked) ppt.panelSourceMsg = false;
	}
}