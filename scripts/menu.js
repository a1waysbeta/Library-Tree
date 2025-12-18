'use strict';
/* global ui:readable, panel:readable, ppt:readable, pop:readable, but:readable, $:readable, sbar:readable, img:readable, search:readable, men:readable, vk:readable, lib:readable, popUpBox:readable */

/* exported MenuItems, Btn, Tooltip, TooltipTimer, Transition */

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

	addSeparator({ menuName = this.baseMenu, separator = true }) { this.menuItems.push({ menuName: menuName || this.baseMenu, separator: separator }); }

	appendMenu(v) {
		const a = this.clearArr ? v : this;
		if (!this.clearArr) this.executeFunctions(v, ['hide', 'menuName']);
		if (a.menuName == this.baseMenu || a.hide) return;
		if (!this.clearArr) this.executeFunctions(v, ['appendTo', 'flags', 'separator', 'str']);
		const menu = this.menu[a.appendTo || this.baseMenu];
		this.menu[a.menuName].AppendTo(menu, a.flags, a.str || a.menuName);
		if (a.separator) menu.AppendMenuSeparator();
	}

	clear() {
		this.menu = {};
		this.func = {};
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
			this[w] = this.get(v[w]);
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
			this.createMenu(this.menuNames[i]);
			i++;
		}

		i = 0;
		ln = this.menuItems.length;
		while (i < ln) {
			const v = this.menuItems[i];
			!v.appendMenu ? this.addItem(v) : this.appendMenu(v);
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

	newItem({ str = null, func = null, menuName = this.baseMenu, flags = MF_STRING, checkItem = false, checkRadio = false, separator = false, hide = false }) { this.menuItems.push({ str: str, func: func, menuName: menuName, flags: flags, checkItem: checkItem, checkRadio: checkRadio, separator: separator, hide: hide }); }

	newMenu({ menuName = this.baseMenu, str = '', appendTo = this.baseMenu, flags = MF_STRING, separator = false, hide = false }) {
		this.menuNames.push(menuName);
		if (menuName != this.baseMenu) this.menuItems.push({ menuName: menuName, appendMenu: true, str: str, appendTo: appendTo, flags: flags, separator: separator, hide: hide });
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
		menu.newMenu({ hide: !this.settingsBtnDn && ppt.settingsShow && this.validItem });

		if (this.validItem) {
			// Regorxxx <- Code cleanup
			['发送到当前播放列表' + '\tEnter', '添加到当前播放列表' + '\tShift+Enter', '发送到新播放列表' + '\tCtrl+Enter'].forEach((v, i) => menu.newItem({
				str: v,
				func: () => this.setPlaylist(i),
				flags: this.getPaylistFlag(i),
				separator: i == 2
			}));
			// Regorxxx ->
			// Regorxxx <- Top tracks
			{
				const target = '（' + (ppt.sendToCur ? '当前' : '默认') + '播放列表）';
				menu.newItem({
					str: '发送高评级音轨' + target,
					func: () => this.setPlaylist(6),
				});
				menu.newItem({
					str: '添加高评级音轨' + target,
					func: () => this.setPlaylist(7),
					separator: true
				});
			}
			// Regorxxx ->
			// Regorxxx <- Code cleanup
			menu.newItem({
				str: '显示正在播放项',
				func: () => this.setPlaylist(3),
				flags: this.getPaylistFlag(3),
			});
			// Regorxxx ->
			// Regorxxx <- Show previously playing. Check if item is tracked
			{
				const prevPlaying = fb.GetPrevPlaying();
				const handle = prevPlaying ? prevPlaying.handle : null;
				const item = handle ? panel.list.Find(handle) : -1;
				menu.newItem({
					str: '显示上一播放项' + (handle && item === -1 ? '\t未找到' : ''),
					func: () => pop.selShow(item),
					flags: item !== -1 ? MF_STRING : MF_GRAYED
				});
			}
			// Regorxxx ->
			// Regorxxx <- Show selection. Check if item is tracked
			{
				const handle = fb.GetFocusItem(true);
				const item = handle ? panel.list.Find(handle) : -1;
				menu.newItem({
					str: '显示选中项' + (handle && item === -1 ? '\t未找到' : ''),
					func: () => pop.selShow(item),
					flags: item !== -1 ? MF_STRING : MF_GRAYED
				});
			}
			// Regorxxx ->
			menu.newItem({ separator: true }); // Regorxxx <- Menu cleanup ->
		}

		if (this.validItem && ppt.albumArtOptionsShow) {
			menu.newItem({
				str: !panel.imgView ? '显示专辑封面' : (!ppt.facetView ? '显示树状视图' : '显示文本视图'),
				func: () => this.setPlaylist(4),
				flags: !panel.pn_h_auto || ppt.pn_h != ppt.pn_h_min ? MF_STRING : MF_GRAYED,
				separator: !panel.imgView //|| this.show_context && !ui.style.topBarShow
			});
		}

		if (this.validItem && panel.imgView) {
			menu.newItem({
				str: ppt.artId != 4 ? '显示艺术家视图' : '显示专辑视图',
				func: () => { ppt.artId = ppt.artId != 4 ? 4 : 0; this.setPlaylist(5); },
				separator: this.show_context && !ui.style.topBarShow
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

		menu.newMenu({ menuName: '设置', hide: !this.show_context || ui.style.topBarShow && !this.shift });

		const mainMenu = () => this.show_context ? '设置' : 'baseMenu';

		menu.newMenu({ menuName: '查看', appendTo: mainMenu(), separator: true });
		// Regorxxx <- Allow separators on views
		panel.menu.forEach((v, i) => {
			// // alwaysbeta <- 修改判断逻辑：检查是否包含 'separator' 而不是完全等于，同时检查英文 "separator" 和中文 "分隔符" ->
			// const bSeparator = (v || '').toLowerCase() === 'separator';
			const bSeparator = (v || '').includes('separator') || (v || '').includes('分隔符');
			if (bSeparator) {
				menu.newItem({
					menuName: '查看',
					separator: true
				});
			} else {
				menu.newItem({
					menuName: '查看',
					str: v,
					func: () => this.setView(i),
					checkRadio: i == ppt.viewBy,
					separator: i > panel.menu.length - 3
				});
			}
		});
		// Regorxxx ->

		const d = {};
		this.getSortData(d);
		menu.newMenu({ menuName: d.menuName, appendTo: '查看', flags: d.sortType ? MF_STRING : MF_GRAYED, separator: true });
		if (d.sortType) {
			menu.newItem({
				menuName: d.menuName,
				str: ['', '按日期', '专辑按日期'][d.sortType],
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

		menu.newMenu({ menuName: '播放统计信息', appendTo: mainMenu(), separator: true });
		// Regorxxx <- New statistics
		[...this.statisticsTypes(), '配置播放统计信息...'].forEach((v, i) => menu.newItem({
			menuName: '播放统计信息',
			str: v,
			func: () => this.setStatistics(i),
			checkRadio: i == ppt.itemShowStatistics,
			separator: !i || i == 7 || i == 11 || i == 14 || i === 17 || i === 20
		}));
		// Regorxxx ->

		menu.newMenu({ menuName: '专辑封面', appendTo: mainMenu(), hide: !panel.imgView });
		[...this.artTypes(), '分组：自动', '分组：一级', '分组：二级', '更改分组名称...', '配置专辑封面...'].forEach((v, i) => menu.newItem({ // Regorxxx <- External integration ->
			menuName: '专辑封面',
			str: v,
			func: () => this.setAlbumart(i),
			flags: i == 8 && (panel.folderView || ppt.rootNode != 3) ? MF_GRAYED : MF_STRING,
			checkRadio: i == ppt.artId || i - 5 == ppt.albumArtGrpLevel,
			separator: i == 4 || i == 7 || i == 8
		}));

		menu.newMenu({ menuName: '快速设置', appendTo: mainMenu() });
		['传统', '现代 [默认]', '超现代', '简洁', '分面'].forEach((v, i) => menu.newItem({
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
				flags: i == 4 && (ppt.thumbNailSize == 7 || !panel.imgView || ppt.albumArtFlowMode) || i == 5 && (ppt.thumbNailSize == 0 || !panel.imgView || ppt.albumArtFlowMode) ? MF_GRAYED : MF_STRING,
				checkItem: i == 7 && ppt.presetLoadCurView,
				separator: i == 2 || i == 3 || i == 5 || i == 6
			}));
		}
		// Regorxxx <- Background image position
		menu.newItem({
			menuName: '快速设置',
			separator: true
		});
		menu.newItem({
			menuName: '快速设置',
			str: '背景网格模式...',
			func: () => {
				let panels = 1;
				try {
					panels = utils.InputBox(0, '设置 Library Tree 面板总数：\n\n背景图像将自动扩展至所有面板，每个面板仅显示图像的对应局部。\n\n注：此功能仅支持水平排列布局。', '背景网格模式：面板数量', 1, true);
				} catch (e) { return; } // eslint-disable-line no-unused-vars
				if (!panels || panels < 1) { return; }
				let pos = 1;
				try {
					pos = utils.InputBox(0, '设置面板在水平排列中的位置：' + '\n排列序号：1 至 ' + panels, '背景网格模式：面板位置', 1, true);
				} catch (e) { return; } // eslint-disable-line no-unused-vars
				if (!pos || pos < 1) { return; }
				ppt.xOffsetBg = 100 / panels * (pos - 1);
				ppt.wOffsetBg = 100 / panels * (panels - pos);
				panel.load();
			},
			flags: panel.imgView ? MF_GRAYED : MF_STRING,
			checkItem: ppt.xOffsetBg !== 0 || ppt.wOffsetBg !== 0
		});
		// Regorxxx ->

		menu.newMenu({ menuName: '来源', appendTo: mainMenu(), separator: true });
		this.sourceTypes().forEach((v, i) => menu.newItem({ // Regorxxx <- External integration ->
			menuName: '来源',
			str: v,
			func: () => this.setSource(i),
			checkRadio: i == (ppt.libSource - 1 < 0 || ppt.fixedPlaylist ? 2 : ppt.libSource - 1),
			separator: i == 2
		}));

		menu.newItem({
			menuName: '来源',
			str: '选择来源面板',
			func: () => this.setSourcePanel(),
			flags: ppt.libSource != 2 ? MF_GRAYED : MF_STRING,
			separator: true
		});

		menu.newMenu({ menuName: '选择播放列表', appendTo: '来源' });
		menu.newItem({
			menuName: '选择播放列表',
			str: '活动播放列表',
			func: () => this.setActivePlaylist(),
			checkRadio: ppt.libSource == 0,
			separator: true
		});

		const pl_no = Math.ceil(this.pl.length / 30);
		const pl_ix = ppt.fixedPlaylist ? plman.FindPlaylist(ppt.fixedPlaylistName) : -1;
		for (let j = 0; j < pl_no; j++) {
			const n = '# ' + (j * 30 + 1 + ' - ' + Math.min(this.pl.length, 30 + j * 30) + (30 + j * 30 > pl_ix && ((j * 30) - 1) < pl_ix ? '  >>>' : ''));
			menu.newMenu({ menuName: n, appendTo: '选择播放列表' });
			for (let i = j * 30; i < Math.min(this.pl.length, 30 + j * 30); i++) {
				menu.newItem({
					menuName: n,
					str: this.pl[i].menuName,
					func: () => this.setFixedPlaylist(i),
					checkRadio: i == pl_ix
				});
			}
		}

		menu.newMenu({ menuName: '刷新', appendTo: mainMenu(), separator: true });
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
		// Regorxxx <- Allow separators on filters
		for (let i = 0; i < panel.filter.menu.length + 1; i++) {
			// const bSeparator = (panel.filter.menu[i] || '').toLowerCase() === 'separator';
			// // alwaysbeta <- 修改判断逻辑：检查是否包含 'separator' 而不是完全等于，同时检查英文 "separator" 和中文 "分隔符" ->
			const menuText = panel.filter.menu[i] || '';
			const bSeparator = menuText.toLowerCase().includes('separator') || menuText.includes('分隔符');
			if (bSeparator) {
				fMenu.newItem({
					separator: true
				});
			} else {
				fMenu.newItem({
					str: i != panel.filter.menu.length ? (!i ? '不过滤' : menuText) : '记忆滚动条位置',
					func: () => panel.set('Filter', i),
					checkItem: i == panel.filter.menu.length && !ppt.reset,
					checkRadio: i == ppt.filterBy && i < panel.filter.menu.length,
					separator: !i || i == panel.filter.menu.length - 1 || i == panel.filter.menu.length
				});
			}
		}
		// Regorxxx ->
		fMenu.newItem({
			str: '配置过滤方式',
			func: () => panel.open('filters'),
		});
	}

	searchHistoryMenu() {
		sMenu.newMenu({});
		// Regorxxx <- RegExp library search and menu cleanup
		if (!search.menu.length) {
			sMenu.newItem({
				str: '- 无搜索历史记录 -',
				flags: MF_GRAYED,
				separator: true
			});
		}
		if (search.menu.length) {
			for (let i = 1; i < search.menu.length + 2; i++) {
				sMenu.newItem({
					str: i < search.menu.length + 1 ? search.menu[i - 1].search : '清除搜索历史记录',
					func: () => this.setSearchHistory(i),
					flags: i != 1 || search.menu.length ? MF_STRING : MF_GRAYED,
					separator: search.menu.length && i == search.menu.length
				});
			}
			sMenu.newItem({ separator: true });
		}
		sMenu.newMenu({ menuName: '帮助' });
		sMenu.newItem({
			menuName: '帮助',
			str: '查询表达式',
			func: () => this.setSearchHistory(0),
		});
		sMenu.newItem({
			menuName: '帮助',
			str: '正则表达式参考',
			func: () => this.setSearchHistory(-1)
		});
		// Regorxxx ->
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
		return !i && !plLockRemoveOrAdd || i == 1 && !plLockAdd || i == 2 || i == 3 && pop.nowp != -1 ? MF_STRING : MF_GRAYED;
	}

	getSortData(d) {
		d.name = panel.propNames[ppt.viewBy];
		d.sortAlbumsByYearAfter = ['', '[$nodisplay{$sub(%date%,0#)}]%album%', '[$nodisplay{$sub(%date%,0)}]%album%[ \'[\'$sub(%date%,0)\']\']', '[$nodisplay{$sub(4001,%date%)}]%album%', '[$nodisplay{$sub(4002,%date%)}]%album%[ \'[\'$sub(%date%,0)\']\']'];
		d.sortAlbumsByYearBefore = ['', '[$nodisplay{$sub(%date%,0)}]%album%', '[\'[\'$sub(%date%,0)\']\' - ]%album%', '[$nodisplay{$sub(4003,%date%)}]%album%', '[$nodisplay{$sub(4004,%date%)}][\'[\'$sub(%date%,0)\']\' - ]%album%'];
		d.sortAlbumByYear = ppt.yearBeforeAlbum ? d.sortAlbumsByYearBefore : d.sortAlbumsByYearAfter;
		d.sortIX = -1;
		d.sortType = 0;
		d.sortYear = ['', '$if2($nodisplay{$sub(%date%,0)},$nodisplay{-4000})', '$nodisplay{$sub(4000,%date%)}'];
		d.value = ppt.get(d.name) || '';
		d.valueLength = d.value.length;
		let l = d.sortYear.length;
		while (l-- && l) {
			d.value = d.value.replace(RegExp($.regexEscape(d.sortYear[l]), 'gi'), ''); // Regorxxx <- Sorting identification should not be case sensitive ->
			if (d.valueLength != d.value.length) {
				d.sortIX = l;
				d.valueLength = d.value.length;
			}
		}
		if (d.sortIX == -1) {
			l = d.sortAlbumsByYearAfter.length;
			while (l-- && l) {
				d.value = d.value.replace(RegExp($.regexEscape(d.sortAlbumsByYearAfter[l]), 'gi'), '%ALBUM%'); // Regorxxx <- Sorting identification should not be case sensitive ->
				if (d.valueLength != d.value.length) {
					d.sortIX = l;
					d.valueLength = d.value.length;
				}
			}
		}
		if (d.sortIX == -1) {
			l = d.sortAlbumsByYearBefore.length;
			while (l-- && l) {
				d.value = d.value.replace(RegExp($.regexEscape(d.sortAlbumsByYearBefore[l]), 'gi'), '%ALBUM%'); // Regorxxx <- Sorting identification should not be case sensitive ->
				if (d.valueLength != d.value.length) {
					d.sortIX = l;
					d.valueLength = d.value.length;
				}
			}
		}
		// Regorxxx <- Sorting identification should not be case sensitive
		if (d.value.includes('//') && /%YEAR%|%DATE%/i.test(d.value)) { d.sortType = 1; }
		else if (/%ALBUM%/i.test(d.value)) { d.sortType = 2; }
		// Regorxxx ->

		d.menuName = d.sortType ? '对当前查看方式排序' : '所选查看方式不支持排序';
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

	playlists_changed() {
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
		const level = pop.tree.length > this.ix && this.ix != -1 ? !pop.inlineRoot ? item.level : Math.max(item.level - 1, 0) : -1;

		this.validItem = this.settingsBtnDn ? false : !panel.imgView ? y < panel.tree.y + pop.rows * sbar.row.h && pop.tree.length > this.ix && this.ix != -1 && (x < Math.round(ppt.treeIndent * level) + ui.icon.w + ppt.margin && (!item.track || item.root) || pop.check_ix(item, x, y, true)) : pop.tree.length > this.ix && this.ix != -1;

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
							this.nm = (v.level ? arr[v.par].srt[0] : '') + v.srt[0];
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
				};
				const caption = '重命名分组';
				const def = img.groupField;
				const prompt = '请输入单数形式的名称（英文环境下请勿使用复数）\n\n此名称将关联至当前的视图模板和分组级别';
				const fallback = popUpBox.isHtmlDialogSupported() ? popUpBox.input(caption, prompt, ok_callback, '', def) : true;
				if (fallback) {
					let ns = '';
					let status = 'ok';
					try {
						ns = utils.InputBox(0, prompt, caption, def, true);
					} catch (e) { // eslint-disable-line no-unused-vars
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
				pop.load({ bAddToPls: false, bAutoPlay: pop.autoPlay.send, bUseDefaultPls: false, bInsertToPls: false }); // Regorxxx <- Code cleanup ->
				panel.treePaint();
				lib.treeState(false, ppt.rememberTree);
				break;
			case 1:
				pop.load({ bAddToPls: true, bAutoPlay: false, bUseDefaultPls: false, bInsertToPls: false }); // Regorxxx <- Code cleanup ->
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
			case 5:
				lib.logTree();
				pop.clearTree();
				this.loadView(false, !panel.imgView ? (ppt.artTreeSameView ? ppt.viewBy : ppt.treeViewBy) : (ppt.artTreeSameView ? ppt.viewBy : ppt.albumArtViewBy), pop.sel_items[0]);
				break;
			// Regorxxx <- Top tracks
			case 6:
			case 7:
				pop.loadTopTracks(i === 7, !ppt.sendToCur);
				panel.treePaint();
				lib.treeState(false, ppt.rememberTree);
				break;
			// Regorxxx ->
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
			// Regorxxx <- RegExp library search
			case i === -1: {
				let fn = 'https://regexr.com/';
				$.browser(fn);
				break;
			}
			// Regorxxx ->
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

	setSourcePanel() {
		const ok_callback = (status, input) => {
			if (status != 'cancel') {
				ppt.panelSelectionPlaylist = input;
			}
		};
		const caption = '来源面板名称';
		const def = ppt.panelSelectionPlaylist;
		// Regorxxx <- Better info. Don't create cache playlists if possible. Chained facets updates.
		const prompt = '输入来源面板名称：\n\n• 前往要设为来源的 Library Tree 面板\n• 按 Shift + Windows + 右键打开 “配置面板...”\n• 复制顶部显示的面板名称至此处\n• 可按需编辑调整来源面板名称\n• 该名称同时用于记录面板状态的缓存播放列表\n• 缓存列表默认隐藏（部分 JS 宿主组件可能不支持）\n• 多个来源面板请使用竖线分隔，例如：流派|艺术家\n• 链式面板仅需指定直接父级面板名称即可'
		// Regorxxx ->
		const fallback = popUpBox.isHtmlDialogSupported() ? popUpBox.input(caption, prompt, ok_callback, '', def) : true;
		if (fallback) {
			let ns = '';
			let status = 'ok';
			try {
				ns = utils.InputBox(0, prompt, caption, def, true);
			} catch (e) { // eslint-disable-line no-unused-vars
				status = 'cancel';
			}
			ok_callback(status, ns);
		}
	}

	setStatistics(i) {
		if (i < pop.statistics.length) { // Regorxxx <- New statistics
			const curStatisticsShown = ppt.itemShowStatistics > 0;
			ppt.itemShowStatistics = i;
			ppt.itemShowStatisticsLast = ppt.itemShowStatistics;
			pop.tree.forEach(v => {
				v.id = '';
				v.count = ''; // has to reset parentheses if stats change off/on
				delete v.statistics;
				delete v._statistics;
			});
			pop.cache = {
				'standard': {},
				'search': {},
				'filter': {}
			};
			pop.statisticsShow = ppt.itemShowStatistics;
			pop.label = !ppt.labelStatistics || !pop.statisticsShow ? '' : pop.statistics[pop.statisticsShow];
			const statisticsShown = ppt.itemShowStatistics > 0;
			if (panel.imgView && curStatisticsShown != statisticsShown) {
				img.labels = { statistics: ppt.itemShowStatistics ? 1 : 0 };
				img.clearCache();
				panel.set('view', ppt.viewBy);
			}
			panel.treePaint();
		} else panel.open('statistics'); // Regorxxx <- New statistics ->
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
				if (ppt.treeViewBy != ppt.albumArtViewBy) {
					ppt.set(panel.imgView ? 'Tree' : 'Tree Image', null);
					ppt.set(panel.imgView ? 'Tree Search' : 'Tree Image Search', null);
				}
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
					// Regorxxx <- Sorting identification should not be case sensitive ->
					str[1] = str[1].trim().replace(/(\|\s*)(.*?(%YEAR%|%DATE%))/gi, '$1' + d.sortYear[i] + '$2');
					if (!/\|.*?(%YEAR%|%DATE%)/i.test(str[1])) { str[1] = d.sortYear[i] + str[1]; }
					// Regorxxx ->
					d.value = str[0].trim() + ' // ' + str[1];
				} else d.value = str[0];
			}
		} else if (d.sortType == 2 && i && sortByIX != -1) {
			d.value = d.value.replace(/%ALBUM%/gi, d.sortAlbumByYear[sortByIX]); // Regorxxx <- Sorting identification should not be case sensitive ->
		}
		if (d.sortType == 1 || sortByIX != -1) {
			const expanded = [];
			const ix = pop.get_ix(!panel.imgView ? 0 : img.panel.x + 1, (!panel.imgView || img.style.vertical ? panel.tree.y : panel.tree.x) + sbar.row.h / 2, true, false);
			const curName = ix != -1 ? pop.tree[ix].name : '';
			const scrollPos = sbar.scroll;
			const selected = [];
			pop.tree.forEach((v, i) => {
				const level = !ppt.rootNode ? v.level : v.level - 1; // 1 level memory: more is less reliable
				if (!level) {
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

	// Regorxxx <- External integration
	artTypes() {
		return ['封面', '封底', '碟片', '图标', '艺术家'];
	}

	statisticsTypes() {
		const userCustomTypes = ppt.tfCustomLabels.split('|');
		['自定义-1(总和)', '自定义-2(总和)', '自定义-3(总和)', '自定义-1(平均值)', '自定义-2(平均值)', '自定义-3(平均值)']
			.forEach((t, i) => {
				if (!userCustomTypes[i] || !userCustomTypes[i].length) { userCustomTypes[i] = t; }
				else { userCustomTypes[i] += ' [' + t + ']'; }
			});
		const types = [pop.countsRight && !panel.imgView ? ['无', '# 音轨', '# 项目'][pop.nodeCounts] : '无', '比特率', '时长', '合计大小', '等级', '人气', '日期', '播放队列', '播放次数', '首次播放', '最近播放', '添加时间', '喜爱', '不喜欢', '反馈（喜爱 - 不喜欢）', ...userCustomTypes];
		if (pop.statistics.length !== types.length) { console.log('Library Tree：默认统计信息出错。菜单项与可用统计信息不匹配。'); }
		return types;
	}

	sourceTypes() {
		return ['媒体库', '面板', '播放列表'];
	}
	// Regorxxx ->
}