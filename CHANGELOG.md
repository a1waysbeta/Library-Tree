# v2.4.0.mod.8
### Added
	- Added new default view patterns: Album (year) and Album (facets).
### Changed
	- Expanded previous feature of hidden cached playlists to use panel notifications as fallback if saving handle lists is not supported on JS host component. It should now work with any SMP version, one way or another. Users with newest SMP/JSplitter should experience no changes compared to previous package version. Remember there is a property to restore original behavior if desired ('Playlist: Prefer internal cache (if supported)').
	- For facets mode (panel source), now every panel sends updates to other panels when being refreshed. i.e. there is no need to set multiple sources, only the most immediate parent's name, since the entire chain will be updated if needed; for ex. for a Genre|Artist|Album 3-panel layout (Album would use Artist as source, and Artist uses Genre). Multiple sources should only be needed if they are fully independent sources; for ex. 2 Artists trees with different filter views in an Artist1|Artist2|Album layout (Album would use Artist1|Artist2 as sources). A new property has been added to disable this behavior, if desired ('Library Source: Chained source notifications'), thus requiring an active selection on a panel to send it to immediate child panels (instead of automatic refreshing the entire chain).
	- Show selection action is now disabled if the focused item is not tracked by the panel. Menu entry will be grayed out and a 'not found' tip added.
	- The default associated playlist to panel selection is now named 'Library Viewer Selection' to match DUI and CUI album list panels default setting. Note it can be changed at the options panel if desired.

<br />

# v2.4.0.mod.7
### Changed
	- Removed unnecessary usage of cache playlists while using Facets mode (panel source) on newest JSplitter and SMP versions. Selection is now sent to other panels on real time and saved to a playlist file at package data folder for loading on startup, without the need of cluttering the UI with a visible playlist. On non supported JS host components, the previous behavior will be used as fallback. A new property has been added to disable it, if desired ('Playlist: Prefer internal cache (if supported)').
	- Performance improvements retrieving items from library, playlist or panel source. Previously it always retrieved all and then the selected one was chosen, now only the selected one is computed. In most cases the library is the biggest one, so it may only be noticeable when using the other sources on huge libraries. It should also reduce peak memory usage.

<br />

# v2.4.0.mod.6
### Added
	- Added double click action to scrollbar buttons to jump to top/bottom of the list.
	- Added double click action to scrollbar current bar position to show now playing item (while playing) or focused item (while stopped).
	- Added new menu entry at contextual menu to show the currently focused item.
### Changed
	- Changed default view pattern 'Artist initial' to be compatible with Japanese/Chinese chars along some minor improvements.

<br />

# v2.4.0.mod.5
### Added
	- Added new default view patterns: Decade, Genre, Style, Genre tree, Artist initial (asciified values).
### Changed
	- Changed default view patterns to create branches for multi-value artist tags and also swap prefixes. i.e. The Rolling Stones -> Rolling Stones, The
	- Changed default view patterns to split/sort albums with different %COMMENT% or %MUSICBRAINZ_ALBUMID% (if the first doesn't exist). Previously multiple versions of the same album were just joined together, which was undesirable. Now proper tagging may fix it.
	- Changed default view Date pattern to only use the year part of the tag (intended usage). This should only affect people who put full dates on %DATE% tag.
	- Cleanup of default view/filter pattern, so they are now auto-numbered, which makes it much easier to reorder them or add new ones.

<br />

# v2.4.0.mod.4
### Added
	- Added separators support at views menu. To insert one, a view named 'separator' must be created (the pattern must be anything but empty, like a '.').
	- Added tips about separators at options panel.
	- Added 'Nowplaying Similar' filter which can be used like Spotify similar artists recommendations (*). Tries to match at least a genre, an style, within a range of 10 years and not the same artist. (*) For ex. with 'Album art/Artist' in flow mode.
	- Added 'Nowplaying Decade' filter which displays results within a range of 10 years.
### Changed
	- Revamped 'Played often' filter to take into consideration play rate since a track was added and being played on last year. Previously it was just a simple check of playcount over 9 times (which was not adjusted to user listen habits).
	- Revamped 'Nowplaying Genre' and 'Nowplaying Style' filter to ommit other matches with live, instrumental, ... tags. It also ommits currently playing artist, so it shows only other similar artists.

<br />

# v2.4.0.mod.3
### Added
	- Added separators support at filter menu. To insert one, a filter named 'separator' must be created (the query must be anything but empty, like a '.').
	- Added new default filter query expressions like: 'Nowplaying Similar Artists' (*), 'Nowplaying Genre', 'Nowplaying Style', 'Selected Artist'. (*) Needs previous tagging with other scripts like [Listenbrainz-SMP](https://hydrogenaudio.org/index.php/topic,124384.0.html) or [Search-By-Distance-SMP](https://hydrogenaudio.org/index.php/topic,120982.0.html).
### Changed
	- Changed default filter query expressions to be compatible with foo_playcount, foo_enhanced_playcount and foo_playcount_2003.
	- Changed default filter query expressions to be compatible with foo_truepeak.
	- Changed default filter query expressions to be compatible with multi-valued tags (like Nowplaying Artist).

<br />

# v2.4.0.mod.2
### Added
	- Added profiling logging for library loading (properties panel). Enabled by default.
	- Added number of decimals setting for popularity/rating statistics (can be changed at the properties panel). 1 by default.
	- Added Loved, Hated and Feedback (loved - hated) statistics. Nodes show the sum of loved/hated tracks within its subnodes.
	- RegExp support at search input box. They must be written in /[expression]/[flags] form. Tags used for lookup are those present on the current View TF expression, ignoring those related to track and disc number; on folder view, paths are used instead. RegExps and queries can not be mixed.
### Changed
	- Changed default TF expressions to be compatible with foo_playcount, foo_enhanced_playcount and foo_playcount_2003.
	- Cleanup of search history menu. Added RegExp reference.
	- Helpers code cleanup.
### Fixed
	- Fixed quick-search not working when looking for a word whose first letter is the same than currently focused one. i.e. can't look for "bad ..." when you are at "b". Now advancing works only when you press the key on rapid succession, otherwise does quick-search.
	- Fix sorting under View By Folder Structure for all levels, by TT.

<br />

# v2.4.0.mod.1
### Changed
	- Changed how built-in icons paths are handled, using relative paths.
### Fixed
	- Fix sorting under View By Folder Structure by jimmywan https://github.com/Wil-B/Library-Tree/pull/3

<br />

# v2.4.0

### Added
- **New facets / multi-panel mode** (for guidance on set-up, see help in options > views tab)
	- each panel can contain a facet, tree view or album art
	- panels needn't be contiguous
	- no longer restricted to two panels
	- **BREAKING change**: if two panel mode previously used, source panel name now has to be entered (menu > source > select source panel)

- **Mode presets** (options > behaviour tab)
	- Browser
		- keeps playing playlist
		- easy to browse track lists without interfering with playing playlist, e.g. in album art or facet modes
		- works best with playback follows cursor OFF & playlist visible
		- double-click status bar to view playing playlist (custom themes may have a different method)
	- Player
		- play and manage without a playlist
		- easy management options
	- Default
		 - free choice as before

- **Statistics** (menu)
	- bitrate
	- duration
	- total size
	- rating
	- popularity
	- date
	- playback queue
	- playcount
	- first played
	- last played
	- date added

- **Album art drop shadow** (options > album art > thumbnail drop shadow)

- **$selected**
	- for use in filters
	- works like $nowplaying except applies to selected (focused) track
	- example, artist IS $selected{$meta(artist,0)} displays tracks by selected artist.

- **Before search memory option**: original state shows on clearing search (options > behaviour tab)

- **Shortcut keys**: more added to search box: ctrl+backspace etc

### Changed
- Library initialisation:
	- optimisations for foobar2000 v2
	- no longer initialises for invisible panels, waits until panel shown
- Jump search improved: repeat presses of same letter advance position
- Albumart: reinstated ability to set number of index characters that show on scrollbar drag (album art tab)
- Follow selection (playlist) option now applies to tree and facet views as well as album art (setting now in behaviour tab). Uses foobar2000 preferences  > display > selection viewers setting
- Made calculating durations more efficient

### Fixed
- various minor draw and alignment issues

<br />

# v2.3.4

### Added
- Some compatibility fixes for foobar2000 v2.0

### Changed
- Arrow & triangle node styles reworked for improved look on foobar2000 v2.0. The previous styles, now called arrows light and triangles light, can be set on the display tab\node style

<br />

# v2.3.3

### Added
- Display of item durations for tree and album art views (enable on display tab)
- Intelligent group level sort by year
	- this automatically adjusts the view pattern to enable sorting in different ways, e.g. to enable reverse sorting $nodisplay snipetts are inserted into the view pattern. This is reversible by selecting the default sort provided the view isn't manually edited to alter the snippetts
- Wine: font check

### Fixed
- Search text was difficult to read with certain theme and colour combinations

<br />

# v2.3.2

### Added
- Album art view: hover frame can now be displayed as an image border (display tab)
- Menu configure that opens Spider Monkey Configuration (right click + shift)

### Changed
- Settings are now always added to the context menu if shift is pressed

### Fixed
- Occasional issues with the options dialog not opening due to the feature checker wrongly reporting Spider Monkey Panel Show HTML Dialog as unsupported. In such cases there is now a confirm to guard against false negatives. Additionally, there is a manual setting in the first panel property
- Minor colour selection and draw issues

<br />

# v2.3.1

### Fixed
Issue with getting album art index character

### Added
Checks to test if ShowHtmlDialog is supported, with fallback to an alternative where possible (thx to regor)

<br />

# v2.3.0

### Changed
- Album art index character(s) that show on scrollbar drag are now configurable:
    - No limit to number, e.g. can be single letter up to full name (album art tab)
    - Year can be autodetected and 4 digits shown, if number above is less than 4 (album art tab)
- Improved horizontal flow mode metrics
- Removed the ability to auto-update from old versions (v2.1.3 or earlier)

### Added
- New clean preset with alternative selection model and new node style (menu\quicksetup)
	- info: alternative selection model is automatically used if selection\full line is enabled (behaviour tab) & hover effect (background) is set to none (display tab). It works best with highlight text on hover enabled (display tab)
- New random colour dark theme (display tab)
- Ability to show source at root, e.g. library, playlist name, panel etc (display tab). Default off. Useful if you don't use a constant source
- Option to customise the name of 'Library Tree Panel Selection' playlist (panel properties: 'Playlist: Panel Selection'): it's used to save the contents of the 2nd panel between foobar2000 restarts.
- Hover effect: tree / album art: option to always use mouse pointer (no hand) (display tab)

### Fixed
- Album art: draw issue with dark overlay labels (compact/grid mode)
- Keystroke navigation irregularities
- No display sorting of albums starting with numbers
- plman.GetPlaylistLockedActions(playlistIndex) error when playlistIndex is invalid
- Lines sometimes overdrawing expanded [-] square icon
- Rare library update crash
- Wine stabilisation: library tree should no longer give errors in Wine, but some limitations remain:
    - copy & paste into search box may not work. It can be fixed by installing [this version of Spider Monkey Panel (v1.6.2-dev+7c0928bf)](https://github.com/Wil-B/Find-and-Play/files/8575143/foo_spider_monkey_panel.zip) which includes marc2k3's utils.GetClipboardText/utils.SetClipboardText (thx to marc2k3)
    - recycler is unlikely to work: it's used when refreshing images: windows explorer can be used to remove images from the cache instead
    - options dialog may not load: menu now indicates there was a problem & console explains what can be done instead
- Miscellaneous fixes

<br />

# v2.2.0
### Added
- Album art
- Playlist source
- Two panel mode (optional)
- Album art flow mode
- '¦' soft splitter that combines different fields into same branch level, e.g.
	`%album artist%¦%artist% or %<album artist>%¦%<artist>%`
- New options dialog

### Changed
- Send to new playlist now checks playlist lock status
- Smooth scroll: enhanced smoothness when using scrollbar
- Refactored code
