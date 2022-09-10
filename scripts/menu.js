'use strict';

const MF_GRAYED = 0x00000001;
const MF_STRING = 0x00000000;

class MenuManager {
	constructor(name, clearArr, baseMenu) {
		this.baseMenu = baseMenu || 'baseMenu';
		this.clearArr = clearArr;
		this.func = {};
		this.idx = 0;
		this.menu = {};
		this.menuItems = [];
		this.menuNames = [];
		this.name = name;
	}

	// Methods

	addItem(v) {
		if (v.separator && !v.str) {
			const separator = this.get(v.separator);
			if (separator) this.menu[v.menuName].AppendMenuSeparator();
		} else {
			const hide = this.get(v.hide);
			if (hide || !v.str) return;
			this.idx++;
			if (!this.clearArr) this.executeFunctions(v, ['checkItem', 'checkRadio', 'flags', 'menuName', 'separator', 'str']); // if clearArr, functions redundant & not supported
			const a = this.clearArr ? v : this;
			const menu = this.menu[a.menuName];
			menu.AppendMenuItem(a.flags, this.idx, a.str);
			if (a.checkItem) menu.CheckMenuItem(this.idx, a.checkItem);
			if (a.checkRadio) menu.CheckMenuRadioItem(this.idx, this.idx, this.idx);
			if (a.separator) menu.AppendMenuSeparator();
			this.func[this.idx] = v.func;
		}
	}

	addSeparator({menuName = this.baseMenu, separator = true}) {this.menuItems.push({ menuName: menuName || this.baseMenu, separator: separator});}

	appendMenu(v) {
		const a = this.clearArr ? v : this;
		if (!this.clearArr) this.executeFunctions(v, ['hide', 'menuName']);
		if (a.menuName == this.baseMenu || a.hide) return;
		if (!this.clearArr) this.executeFunctions(v, ['appendTo', 'flags', 'separator', 'str']);
		const menu = this.menu[a.appendTo || this.baseMenu];
		this.menu[a.menuName].AppendTo(menu, a.flags, a.str || a.menuName)
		if (a.separator) menu.AppendMenuSeparator();
	}

	clear() {
		this.menu = {}
		this.func = {}
		this.idx = 0;
		if (this.clearArr) {
			this.menuItems = [];
			this.menuNames = [];
		}
	}

	createMenu(menuName = this.baseMenu) {
		menuName = this.get(menuName);
		this.menu[menuName] = window.CreatePopupMenu();
	}

	executeFunctions(v, items) {
		let i = 0;
		let ln = items.length;
		while (i < ln) {
			const w = items[i];
			this[w] = this.get(v[w])
			i++;
		}
	}

	get(v) {
		if (v instanceof Function) return v(); 
		return v;
	}

	load(x, y) {
		if (!this.menuItems.length) men[this.name]();
		let i = 0;
		let ln = this.menuNames.length;
		while (i < ln) {
			this.createMenu(this.menuNames[i])
			i++;
		}

		i = 0;
		ln = this.menuItems.length;
		while (i < ln) {
			const v = this.menuItems[i];
			!v.appendMenu ? this.addItem(v) : this.appendMenu(v)
			i++;
		}

		let Context;
		if (men.show_context) {
			Context = fb.CreateContextMenuManager();
			Context.InitContext(men.items);
			this.menu[this.baseMenu].AppendMenuSeparator();
			Context.BuildMenu(this.menu[this.baseMenu], 5000);
		}

		const idx = this.menu[this.baseMenu].TrackPopupMenu(x, y);
		this.run(idx);

		if (men.show_context) {
			if (idx >= 5000 && idx <= 5800) Context.ExecuteByID(idx - 5000);
			men.show_context = false;
		}

		this.clear();
	}

	newItem({str = null, func = null, menuName = this.baseMenu, flags = MF_STRING, checkItem = false, checkRadio = false, separator = false, hide = false}) {this.menuItems.push({str: str, func: func, menuName: menuName, flags: flags, checkItem: checkItem, checkRadio: checkRadio, separator: separator, hide: hide});}

	newMenu({menuName = this.baseMenu, str = '', appendTo = this.baseMenu, flags = MF_STRING, separator = false, hide = false}) {
		this.menuNames.push(menuName);
		if (menuName != this.baseMenu) this.menuItems.push({menuName: menuName, appendMenu: true, str: str, appendTo: appendTo, flags: flags, separator: separator, hide: hide});
	}

	run(idx) {
		const v = this.func[idx];
		if (v instanceof Function) v(); 
	}
}

const clearArr = true;
const menu = new MenuManager('mainMenu', clearArr);
const fMenu = new MenuManager('filterMenu', clearArr);
const sMenu = new MenuManager('searchHistoryMenu', clearArr);
const searchMenu = new MenuManager('searchMenu');

class MenuItems {
	constructor() {
		this.expandable = false;
		this.ix = -1;
		this.items = new FbMetadbHandleList();
		this.nm = '';
		this.pl = [];
		this.r_up = false;
		this.show_context = false;
		this.treeExpandLimit = $.file('C:\\check_local\\1450343922.txt') ? 6000 : $.clamp(ppt.treeExpandLimit, 10, 6000);
		this.playlists_changed(true);
		this.settingsBtnDn = false;
		this.validItem = false;
	}

	// Methods

	mainMenu() {
		menu.newMenu({hide: !this.settingsBtnDn && ppt.settingsShow && this.validItem});

		if (this.validItem) {
			['发送到当前列表' + '\tEnter', '添加到当前列表' + '\tShift+Enter', '发送到新的列表' + '\tCtrl+Enter', '显示正在播放项'].forEach((v, i) => menu.newItem({
				str: v,
				func: () => this.setPlaylist(i),
				flags: this.getPaylistFlag(i),
				separator: i == 2
			}));
		}

		if (this.validItem && ppt.albumArtOptionsShow) {
			menu.newItem({
				str: !panel.imgView ? '显示专辑封面视图' : '显示树型视图',
				func: () => this.setPlaylist(4),
				flags: !panel.pn_h_auto || ppt.pn_h != ppt.pn_h_min ? MF_STRING : MF_GRAYED,
				separator: !panel.imgView || this.show_context && !ui.style.topBarShow
			});
		}

		if (this.validItem && !panel.imgView) {
			['折叠全部\tNum -', '展开\tNum *'].forEach((v, i) => menu.newItem({
				str: v,
				func: () => this.setTreeState(i),
				flags: !i || i == 1 && this.expandable ? MF_STRING : MF_GRAYED,
				separator: i == 1 && this.show_context && (!ppt.settingsShow && !ppt.searchShow && !ppt.filterShow || this.shift)
			}));
		}

		menu.newMenu({menuName: '设置', hide: !this.show_context || ui.style.topBarShow && !this.shift});

		const mainMenu = () => this.show_context ? '设置' : 'baseMenu';

		menu.newMenu({menuName: '查看', appendTo: mainMenu(), separator: true});
		panel.menu.forEach((v, i) => menu.newItem({
			menuName: '查看',
			str: v,
			func: () => this.setView(i),
			checkRadio: i == ppt.viewBy,
			separator: i > panel.menu.length - 3
		}));
		
		const d = {}
		this.getSortData(d);
		menu.newMenu({menuName: d.menuName, appendTo: '查看', flags: d.sortType ? MF_STRING : MF_GRAYED, separator: true});
		if (d.sortType) {
			menu.newItem({
				menuName: d.menuName,
				str: ['', '按年份', '专辑按年份（分组级别）'][d.sortType],
				flags: MF_GRAYED,
				separator: true
			});
			const menuSort = [[], ['默认', '升序', '降序'], ['默认', '升序（隐藏年份）', '升序（显示年份）', '降序（隐藏年份）', '降序（显示年份）', '年份显示在专辑之后', '年份显示在专辑之前']][d.sortType];
			menuSort.forEach((v, i) => menu.newItem({
				menuName: d.menuName,
				str: v,
				func: () => this.sortByDate(i, d),
				flags: i > 4 && (d.sortIX == 1 || d.sortIX == 3) ? MF_GRAYED : MF_STRING,
				checkRadio: d.sortIX == -1 && !i || i == d.sortIX || d.sortType == 2 && i == 5 && !ppt.yearBeforeAlbum || i == 6 && ppt.yearBeforeAlbum,
				separator: i == 0 || d.sortType == 2 && (i == 2 || i == 4)
			}));
		}

		menu.newItem({
			menuName: '查看',
			str: '配置查看方式...',
			func: () => panel.open('views')
		});

		menu.newMenu({menuName: '专辑封面', appendTo: mainMenu(), hide: !panel.imgView});
		['封面', '封底', '碟片', '图标', '艺术家', '分组：自动', '分组：一级', '分组：二级', '更改分组名称...', '配置专辑封面...'].forEach((v, i) => menu.newItem({
			menuName: '专辑封面',
			str: v,
			func: () => this.setAlbumart(i),
			flags: i == 8 && (panel.folderView || ppt.rootNode != 3) ? MF_GRAYED : MF_STRING,
			checkRadio: i == ppt.artId || i - 5 == ppt.albumArtGrpLevel,
			separator: i == 4 || i == 7 || i == 8
		}));

		menu.newMenu({menuName: '快速设置', appendTo: mainMenu()});
		['传统', '现代 [默认]', '超现代', '简洁', '列表视图'].forEach((v, i) => menu.newItem({
			menuName: '快速设置',
			str: v,
			func: () => panel.set('quickSetup', i),
			separator: i == 3 || i == 4
		}));

		if (ppt.albumArtOptionsShow) {
			['封面 [右侧标签]', '封面 [底部标签]', '封面 [叠加标签]', '艺术家图像 [右侧标签]', '专辑封面大小 +', '专辑封面大小 -', '流动封面模式', '始终以当前的 “查看方式” 加载预设'].forEach((v, i) => menu.newItem({
				menuName: '快速设置',
				str: v,
				func: () => panel.set('quickSetup', i + 5),
				flags: i == 4 && (ppt.thumbNailSize == 4 || !panel.imgView || ppt.albumArtFlowMode) || i == 5 && (ppt.thumbNailSize == 0 || !panel.imgView || ppt.albumArtFlowMode) ? MF_GRAYED : MF_STRING,
				checkItem: i == 7 && ppt.presetLoadCurView,
				separator: i == 2 || i == 3 || i == 5 || i == 6
			}));
		}

		menu.newMenu({menuName: '来源', appendTo: mainMenu(), separator: true});
		['媒体库', '面板', '播放列表'].forEach((v, i) => menu.newItem({
			menuName: '来源',
			str: v,
			func: () => this.setSource(i),
			checkRadio: i == (ppt.libSource - 1 < 0 || ppt.fixedPlaylist ? 2 : ppt.libSource - 1),
			separator: i == 2
		}));

		menu.newMenu({menuName: '选择播放列表', appendTo: '来源'});
		menu.newItem({
			menuName: '选择播放列表',
			str: '活动列表',
			func: () => this.setActivePlaylist(),
			checkRadio: ppt.libSource == 0,
			separator: true
		});

		const pl_no = Math.ceil(this.pl.length / 30);
		const pl_ix = ppt.fixedPlaylist ? plman.FindPlaylist(ppt.fixedPlaylistName) : -1;
		for (let j = 0; j < pl_no; j++) {
			const n = '# ' + (j * 30 + 1 + ' - ' + Math.min(this.pl.length, 30 + j * 30) + (30 + j * 30 > pl_ix && ((j * 30) - 1) < pl_ix ? '  >>>' : ''));
			menu.newMenu({menuName: n, appendTo: '选择播放列表'});
			for (let i = j * 30; i < Math.min(this.pl.length, 30 + j * 30); i++) {
				menu.newItem({
					menuName: n,
					str: this.pl[i].menuName,
					func: () => this.setFixedPlaylist(i),
					checkRadio: i == pl_ix
				});
			}
		}

		menu.newMenu({menuName: '刷新', appendTo: mainMenu(), separator: true});
		for (let i = 0; i < 5; i++) menu.newItem({
			menuName: '刷新',
			str: ['刷新选定的图像...', '刷新所有图像...', '重置缩放...', '刷新媒体库...', '重载...'][i],
			func: () => this.setMode(i),
			flags: panel.imgView && !i && this.items.Count || !panel.imgView || i ? MF_STRING : MF_GRAYED,
			separator: i == 1 && panel.imgView,
			hide: i < 2 && !panel.imgView || i == 3 && ppt.libAutoSync
		});

		for (let i = 0; i < 2; i++) menu.newItem({
			menuName: mainMenu(),
			str: [popUpBox.ok ? '选项...' : '选项：请查看控制台', '配置...'][i],
			func: () => !i ? panel.open() : window.EditScript(),
			separator: !i && this.shift,
			hide: !this.settingsBtnDn && ppt.settingsShow && this.validItem && !this.shift || i && !this.shift
		});
	}

	filterMenu() {
		fMenu.newMenu({});
		for (let i = 0; i < panel.filter.menu.length + 1; i++) fMenu.newItem({
			str: i != panel.filter.menu.length ? (!i ? '不过滤' : panel.filter.menu[i]) : '总是重置滚动',
			func: () => panel.set('Filter', i),
			checkItem: i == panel.filter.menu.length && ppt.reset,
			checkRadio: i == ppt.filterBy && i < panel.filter.menu.length,
			separator: !i || i == panel.filter.menu.length - 1 || i == panel.filter.menu.length
		});
		fMenu.newItem({
			str: '配置过滤方式',
			func: () => panel.open('filters'),
		});
	}

	searchHistoryMenu() {
		sMenu.newMenu({});
		for (let i = 0; i < search.menu.length + 2; i++) sMenu.newItem({
			str: !i ? '查询语法帮助' : i < search.menu.length + 1 ? search.menu[i - 1].search : '清除历史纪录',
			func: () => this.setSearchHistory(i),
			flags: i != 1 || search.menu.length ? MF_STRING : MF_GRAYED,
			separator: !i || search.menu.length && i == search.menu.length
		});
	}

	searchMenu() {
		searchMenu.newMenu({});
		['复制', '剪切', '粘贴'].forEach((v, i) => searchMenu.newItem({
			str: v,
			func: () => this.setEdit(i),
			flags: () => search.start == search.end && i < 2 || i == 2 && !search.paste ? MF_GRAYED : MF_STRING,
			separator: i == 1
		}));
	}

	getPaylistFlag(i) {
		const pln = plman.ActivePlaylist;
		const plnIsValid = pln != -1 && pln < plman.PlaylistCount;
		const plLockAdd = plnIsValid ? plman.GetPlaylistLockedActions(pln).includes('AddItems') : false;
		const plLockRemoveOrAdd = plnIsValid ? plman.GetPlaylistLockedActions(pln).includes('RemoveItems') || plman.GetPlaylistLockedActions(pln).includes('ReplaceItems') || plLockAdd : false;
		return !i && !plLockRemoveOrAdd || i == 1 && !plLockAdd || i == 2 || i == 3 && pop.nowp != -1 ? MF_STRING : MF_GRAYED
	}

	getSortData(d) {
		d.name = panel.propNames[ppt.viewBy];
		d.sortAlbumsByYearAfter = [``, `[$nodisplay{$sub(%date%,0#)}]%album%`, `[$nodisplay{$sub(%date%,0)}]%album%[ '['$sub(%date%,0)']']`, `[$nodisplay{$sub(4001,%date%)}]%album%`, `[$nodisplay{$sub(4002,%date%)}]%album%[ '['$sub(%date%,0)']']`];
		d.sortAlbumsByYearBefore = [``, `[$nodisplay{$sub(%date%,0)}]%album%`, `['['$sub(%date%,0)']' - ]%album%`, `[$nodisplay{$sub(4003,%date%)}]%album%`, `[$nodisplay{$sub(4004,%date%)}]['['$sub(%date%,0)']' - ]%album%`];
		d.sortAlbumByYear = ppt.yearBeforeAlbum ? d.sortAlbumsByYearBefore : d.sortAlbumsByYearAfter;
		d.sortIX = -1;
		d.sortType = 0;
		d.sortYear = [``, `$if2($nodisplay{$sub(%date%,0)},$nodisplay{-4000})`, `$nodisplay{$sub(4000,%date%)}`];
		d.value = ppt.get(d.name) || '';
		d.valueLength = d.value.length;
		let l = d.sortYear.length;
		while(l-- && l) {
			d.value = d.value.replace(RegExp($.regexEscape(d.sortYear[l]), 'g'), '')
			if (d.valueLength != d.value.length) {
				d.sortIX = l;
				d.valueLength = d.value.length;
			}
		}
		if (d.sortIX == -1) {
			l = d.sortAlbumsByYearAfter.length;
			while(l-- && l) {
				d.value = d.value.replace(RegExp($.regexEscape(d.sortAlbumsByYearAfter[l]), 'g'), '%album%');
				if (d.valueLength != d.value.length) {
					d.sortIX = l;
					d.valueLength = d.value.length;
				}
			}
		}
		if (d.sortIX == -1) {
			l = d.sortAlbumsByYearBefore.length;
			while(l-- && l) {
				d.value = d.value.replace(RegExp($.regexEscape(d.sortAlbumsByYearBefore[l]), 'g'), '%album%');
				if (d.valueLength != d.value.length) {
					d.sortIX = l;
					d.valueLength = d.value.length;
				}
			}
		}
		if (d.value.includes('//') && /%year%|%date%/.test(d.value)) d.sortType = 1;
		else if (d.value.includes('%album%')) d.sortType = 2;

		d.menuName = d.sortType ? '排序所选查看方式' : '所选查看方式的排序不可用';
	}

	loadView(clearCache, view, sel) {
		ui.getColours();
		sbar.setCol();
		but.createImages();
		if (clearCache) img.clearCache();
		if (sel !== undefined) {
			const handle = sel >= panel.list.Count ? null : panel.list[sel];
			panel.set('view', view, true);
			if (handle) {
				const item = panel.list.Find(handle);
				let idx = -1;
				pop.tree.forEach((v, i) => {
					if (pop.inRange(item, v.item)) idx = i;
				});
				if (idx != -1) {
					if (!panel.imgView) pop.focusShow(idx);
					else pop.showItem(idx, 'focus');
				}
			}
		} else panel.set('view', view, true);
		but.refresh(true);
	}

	playlists_changed(init) {
		this.pl = [];
		for (let i = 0; i < plman.PlaylistCount; i++) this.pl.push({
			menuName: plman.GetPlaylistName(i).replace(/&/g, '&&'),
			name: plman.GetPlaylistName(i),
			ix: i
		});
	}

	rbtn_up(x, y, settingsBtnDn) {
		this.r_up = true;
		this.expandable = false;
		this.items = new FbMetadbHandleList();
		this.ix = pop.get_ix(x, y, true, false);
		this.nm = '';
		this.settingsBtnDn = settingsBtnDn;
		this.shift = vk.k('shift');
		this.show_context = false;

		let item = pop.tree[this.ix];
		let row = -1;
		const tr = pop.tree.length > this.ix && this.ix != -1 ? !pop.inlineRoot ? item.tr : Math.max(item.tr - 1, 0) : -1;

		this.validItem = this.settingsBtnDn ? false : !panel.imgView ? y < panel.tree.y + pop.rows * sbar.row.h && pop.tree.length > this.ix && this.ix != -1 && (x < Math.round(ppt.treeIndent * tr) + ui.icon.w + ppt.margin && (!item.track || item.root) || pop.check_ix(item, x, y, true)) : pop.tree.length > this.ix && this.ix != -1;

		if (!this.validItem && !this.settingsBtnDn && ppt.settingsShow && y > panel.search.sp) {
			this.ix = pop.row.i != -1 ? pop.row.i : !panel.imgView ? pop.tree.length - 1 : -1;
			if (this.ix < pop.tree.length && this.ix != -1) {
				item = pop.tree[this.ix];
				this.validItem = true;
			}
		}

		if (this.validItem) {
			if (!item.sel) {
				pop.clearSelected();
				item.sel = true;
			}
			pop.getTreeSel();
			this.expandable = pop.trackCount(pop.tree[this.ix].item) > this.treeExpandLimit || pop.tree[this.ix].track || panel.imgView ? false : true;
			if (this.expandable && pop.tree.length) {
				let count = 0;
				pop.tree.forEach((v, m, arr) => {
					if (m == this.ix || v.sel) {
						if (row == -1 || m < row) {
							row = m;
							this.nm = (v.tr ? arr[v.par].srt[0] : '') + v.srt[0];
							this.nm = this.nm.toUpperCase();
						}
						count += pop.trackCount(v.item);
						this.expandable = count <= this.treeExpandLimit;
					}
				});
			}
			this.items = pop.getHandleList();
			this.show_context = true;
		} else this.items = pop.getHandleList('newItems');

		menu.load(x, y);
		this.r_up = false;
	}

	setActivePlaylist() {
		ppt.libSource = 0;
		ppt.fixedPlaylist = false;
		ppt.fixedPlaylistName = 'ActivePlaylist';
		if (panel.imgView) img.clearCache();
		lib.searchCache = {};
		if (ppt.showSource) panel.setRootName();
		lib.treeState(false, 2);
	}

	setAlbumart(i) {
		let clearCache = false;
		switch (i) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
				ppt.artId = i;
				break;
			case 5:
			case 6:
			case 7:
				ppt.albumArtGrpLevel = i - 5;
				break;
			case 8: {
				const key = `${panel.grp[ppt.viewBy].type.trim()}${panel.lines}`;
				const ok_callback = (status, input) => {
					if (status != 'cancel') {
						const albumArtGrpNames = $.jsonParse(ppt.albumArtGrpNames, {});
						albumArtGrpNames[key] = input;
						ppt.albumArtGrpNames = JSON.stringify(albumArtGrpNames);
					}
				}
				const caption = '更改分组名称';
				const def = img.groupField;
				const prompt = '英文时，输入单数名称，即非复数\n\n名称固定到查看模版和分组级别';
				const fallback = popUpBox.isHtmlDialogSupported() ? popUpBox.input(caption, prompt, ok_callback, '', def) : true;
				if (fallback) {
					let ns = '';
					let status = 'ok';
					try {
						ns = utils.InputBox(0, prompt, caption, def, true);
					} catch(e) {
						status = 'cancel';
					}
					ok_callback(status, ns);
				}
				break;
			}
			case 9:
				panel.open('albumArt');
				break;
		}
		this.loadView(clearCache, ppt.albumArtViewBy);
	}

	setEdit(i) {
		switch (i) {
			case 0:
				search.on_char(vk.copy);
				break;
			case 1:
				search.on_char(vk.cut);
				break;
			case 2:
				search.on_char(vk.paste, true);
				break;
		}
	}

	setFixedPlaylist(i) {
		ppt.fixedPlaylistName = this.pl[i].name;
		ppt.fixedPlaylist = true;
		ppt.libSource = 1;
		if (panel.imgView) img.clearCache();
		if (ppt.showSource) panel.setRootName();
		lib.searchCache = {};
		lib.treeState(false, 2);
	}

	setMode(i) {
		switch (i) {
			case 0:
				img.refresh(this.items);
				break;
			case 1:
				img.refresh('all');
				break;
			case 2:
				panel.zoomReset();
				break;
			case 3:
				lib.treeState(false, 2);
				break;
			case 4:
				window.Reload();
				break;
		}
	}

	setPlaylist(i) {
		switch (i) {
			case 0:
				pop.load(pop.sel_items, true, false, pop.autoPlay.send, false, false);
				panel.treePaint();
				lib.treeState(false, ppt.rememberTree);
				break;
			case 1:
				pop.load(pop.sel_items, true, true, false, false, false);
				lib.treeState(false, ppt.rememberTree);
				break;
			case 2:
				pop.sendToNewPlaylist();
				panel.treePaint();
				lib.treeState(false, ppt.rememberTree);
				break;
			case 3:
				pop.nowPlayingShow();
				break;
			case 4:
				lib.logTree();
				pop.clearTree();
				ppt.toggle('albumArtShow');
				panel.imgView = ppt.albumArtShow;
				this.loadView(false, !panel.imgView ? (ppt.artTreeSameView ? ppt.viewBy : ppt.treeViewBy) : (ppt.artTreeSameView ? ppt.viewBy : ppt.albumArtViewBy), pop.sel_items[0]);
				break;
		}
	}

	setSearchHistory(i) {
		switch (true) {
		case !i: {
			let fn = fb.FoobarPath + 'doc\\Query Syntax Help.html';
			if (!$.file(fn)) fn = fb.FoobarPath + 'Query Syntax Help.html';
			$.browser('"' + fn);
			break;
		}
		case i < search.menu.length + 1:
			panel.search.txt = search.menu[i - 1].search;
			search.menu[i - 1].accessed = Date.now();
			search.focus();
			but.setSearchBtnsHide();
			lib.search();
			break;
		case i == search.menu.length + 1:
			search.menu = [];
			ppt.searchHistory = JSON.stringify([]);
			break;
		}
	}

	setSource(i) {
		switch (i) {
			case 0:
				ppt.libSource = 1;
				ppt.fixedPlaylist = false;
				break;
			case 1:
				ppt.libSource = 2;
				ppt.fixedPlaylist = false;
				if (ppt.panelSourceMsg && popUpBox.isHtmlDialogSupported()) popUpBox.message();
				break;
			case 2: {
				const fixedPlaylistIndex = plman.FindPlaylist(ppt.fixedPlaylistName);
				if (fixedPlaylistIndex != -1) ppt.fixedPlaylist = true;
				ppt.libSource = ppt.fixedPlaylist ? 1 : 0;
				if (ppt.panelSourceMsg && popUpBox.isHtmlDialogSupported()) popUpBox.message();
				break;
			}
		}
		if (panel.imgView) img.clearCache();
		lib.searchCache = {};
		if (ppt.showSource) panel.setRootName();
		lib.treeState(false, 2);
	}

	setTreeState(i) {
		switch (i) {
			case 0:
				pop.collapseAll();
				break;
			case 1:
				pop.expand(this.ix, this.nm);
				panel.setHeight(true);
				break;
		}
		pop.checkAutoHeight();
	}

	setView(i) {
		if (i < panel.menu.length) {
			if (ppt.artTreeSameView) {
				ppt.treeViewBy = i;
				ppt.albumArtViewBy = i;
			} else {
				if (!panel.imgView) ppt.treeViewBy = i;
				else ppt.albumArtViewBy = i;
				if (ppt.treeViewBy != ppt.albumArtViewBy) ppt.set(panel.imgView ? 'Tree' : 'Tree Image', null);
			}
			panel.set('view', i);
		}
	}

	sortByDate(i, d) {
		let sortByIX = -1;
		if (i > 4) {
			ppt.toggle('yearBeforeAlbum');
			d.sortAlbumByYear = ppt.yearBeforeAlbum ? d.sortAlbumsByYearBefore : d.sortAlbumsByYearAfter;
			sortByIX = d.sortIX;
		} else sortByIX = i;
		if (d.sortType == 1) {
			if (i) {
				let str = d.value.split('//');
				if (str[1]) {
					str[1] = str[1].trim().replace(/(\|\s*)(.*?(%year%|%date%))/g,  '$1' + d.sortYear[i] + '$2')
					if (!/\|.*?(%year%|%date%)/.test(str[1])) str[1] = d.sortYear[i] + str[1];
					d.value = str[0].trim() + ' // ' + str[1];
				} else d.value = str[0];
			}
		} else if (d.sortType == 2 && i && sortByIX != -1) {
			d.value = d.value.replace(/%album%/g, d.sortAlbumByYear[sortByIX])
		}
		if (d.sortType == 1 || sortByIX != -1) {
			const expanded = [];
			const ix = pop.get_ix(!panel.imgView ? 0 : img.panel.x + 1, (!panel.imgView || img.style.vertical ? panel.tree.y : panel.tree.x) + sbar.row.h / 2, true, false);
			const curName = ix != -1 ? pop.tree[ix].name : '';
			const scrollPos = sbar.scroll;
			const selected = [];
			pop.tree.forEach((v, i) => {
				const tr = !ppt.rootNode ? v.tr : v.tr - 1; // 1 level memory: more is less reliable
				if (!tr) {
					if (v.child.length) expanded.push(i);
					if (v.sel) selected.push(i);
				}
			});
			ppt.set(d.name, d.value);
			pop.clearTree();
			panel.getViews();
			this.setView(ppt.viewBy);
			if (ix < pop.tree.length) {
				const name = ix != -1 ? pop.tree[ix].name : '';
				if (name && name == curName) {
					expanded.forEach(v => {
						if (v < pop.tree.length) {
							const item = pop.tree[v];
							pop.branch(item, !item.root ? false : true, true);
						}
					});
					selected.forEach(v => {
						if (v < pop.tree.length) {
							pop.tree[v].sel = true;
						}
					});
				}
			}
			sbar.checkScroll(scrollPos, 'full', true);
		}
	}
}