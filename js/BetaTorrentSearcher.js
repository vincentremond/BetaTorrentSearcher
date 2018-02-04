var BetaTorrentSearcher = {

	CheckCount: 0,
	CheckStack: [],

	Sites: {
		tpb: {
			Enabled: true,
			Name: 'The Pirate Bay',
			Search: function (title, episode) {
				jQuery.postblank({
					method: 'GET',
					action: 'https://thepiratebay.org/s/',
					data: {
						q: (title + ' ' + episode),
						category: 0,
						page: 0,
						orderby: 7,
					}
				});
			}
		},
		eztv: {
			Enabled: true,
			Name: 'EZTV.it',
			Search: function (title, episode) {
				jQuery.postblank({
					method: 'GET',
					action: 'https://eztv.ag/search/',
					data: { q1: (title) }
				});
			}
		},
		torrentz: {
			Enabled: false,
			Name: 'Torrentz.eu',
			Search: function (title, episode) {
				jQuery.postblank({
					method: 'GET',
					action: 'https://torrentz.eu/search',
					data: {
						f: (title + ' ' + episode),
					}
				});
			}
		},
		kickass: {
			Enabled: false,
			Name: 'Kickass Torrent',
			Search: function (title, episode) {
				jQuery.postblank({
					method: 'GET',
					action: 'http://kat.ph/usearch/' + encodeURIComponent(title) + ' ' + encodeURIComponent(episode) + '/',
					data: {
						field: 'seeders',
						sorder: 'desc',
					}
				});
			}
		},
		extratorrent: {
			Enabled: false,
			Name: 'Extra Torrent',
			Search: function (title, episode) {
				jQuery.postblank({
					method: 'GET',
					action: 'http://extratorrent.cc/search/',
					data: {
						search: title + ' ' + episode,
						s_cat: '',
						pp: '',
						srt: 'seeds',
						order: 'desc'
					}
				});
			}
		},
		rarbg: {
			Enabled: true,
			Name: 'RARBG',
			Search: function (title, episode) {
				jQuery.postblank({
					method: 'GET',
					action: 'https://rarbgproxy.org/torrents.php',
					data: {
						search: title + ' ' + episode,
						category: '1;18;41;49',
					}
				});
			}
		}
	},

	GoBabyGoGo: function () {

		jQuery(function () {
			BetaTorrentSearcher.Check();
			jQuery(document).bind('DOMNodeInserted', BetaTorrentSearcher.Check);
		});
	},

	Check: function () {
		BetaTorrentSearcher.CheckCount++;
		BetaTorrentSearcher.CheckStack.unshift(BetaTorrentSearcher.CheckCount);
		setTimeout(BetaTorrentSearcher.DoCheck, 30);
	},

	DoCheck: function () {
		if (BetaTorrentSearcher.CheckStack.length > 0) {
			BetaTorrentSearcher.CheckStack.pop();
		}
		if (BetaTorrentSearcher.CheckStack.length == 0) {
			console.log(new Date() + ' BetaTorrentSearcher.DoCheck');
			var html = '<span class="torrent-search-sites">';
			for (var site in BetaTorrentSearcher.Sites) {
				var siteData = BetaTorrentSearcher.Sites[site];
				if (siteData.Enabled) {
					html += '<span class="torrent-search-site torrent-search-site--' + site + '" data-site="' + site + '" title="' + siteData.Name + '"></span>'
				}
			}
			html += '</span> &mdash; ';

			jQuery('.episodes .episode:not(.torrent-checked)').each(function (index, Element) {

				if (!jQuery(this).hasClass('torrent-checked')) {
					// add token class for already processed
					jQuery(this).addClass('torrent-checked');
					// add torrents sites links
					jQuery('.srtlinks', this).prepend(html);
					// add click event
					jQuery('.torrent-search-sites .torrent-search-site')
						.click(BetaTorrentSearcher.StartSearch);
				}
			});
		}
	},

	StartSearch: function () {
		var $title = jQuery(this).parents('.episode-titre:first').find('a.ep');
		var title = BetaTorrentSearcher.CleanTitle($title.text());
		var episode = $title.siblings('a:first').text();
		var site = BetaTorrentSearcher.Sites[jQuery(this).data('site')];
		site.Search(title, episode);
	},

	CleanTitle: function (title) {
		return title.replace(/'s\b/gi, ' ')
			.replace(/:/gi, '')
			.replace(/\s+/gi, ' ')
			.replace(/CSI Crime Scene Investigation/gi, 'CSI')
			.replace(/^The /gi, '')
			.replace(/ \(20[0-9][0-9]\)/gi, '')
			.replace(/20[0-9][0-9]/gi, '')
			.replace(/20[0-9][0-9]/gi, '')
			.replace(/CSI NY/gi, 'CSI New York')
			.replace(/House of Cards \(US\)/gi, 'House of Cards')
			.replace(/You're the Worst/gi, 'Youre the Worst')
			;
	}
};
