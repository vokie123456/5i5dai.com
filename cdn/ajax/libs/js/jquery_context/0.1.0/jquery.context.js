/**
 * Statement: ...//TODO: Write statement.
 *
 * Describe: jQuery Plugin For Contextual Menus.    ...//TODO: Check description.
 *
 * Further Changes, Comments: ...//TODO: Give a further changes and comments link.
 *
 * Javascript Design Pattern (Code Management):    ...//TODO: Cehck design pattern.
 *
 *     Namespacing Patterns, Immediately-invoked Function Expressions (IIFE)s
 *
 *     Modules Patterns, Revealing Module Pattern
 *
 *     Modules Patterns, AMD modules
 *
 * Docs: ...//TODO: Give a link about project documents.
 *
 * Original Author: Shen Weizhong ( Tony Stark ).
 *
 * Thanks: ...//TODO: If there are some contributors, just mark them.
 *
 * Version: 0.1.0-alpha
 *
 * Creation Date: 2013.12.19 23:08 ( Tony ).
 *
 * Last Update: 2013.12.20 01:34 ( Tony ).    ...//TODO: Update the 'Last Update'.
 *
 * Music ( Custom ): Countdown (feat. Makj).mp3    ...//TODO: If you are listenning some music, just write the name of songs.
 *
 * License: ...//TODO: Give a license.
 *
 * Copyright: ...//TODO: Give a copyright.
 */

(function (require, console) {
	
	var fn, _AMD;
	
	fn = function (require) {
		
		var SJ, $;
		
		SJ = require('jquery');
		
		$ = SJ;
		
		var _context = (function () {
			
			var context;
			
			return {
				
				core: function () {
					
					context = context || (function () {
						
						var options = {
							
							fadeSpeed: 100,
							
							filter: function ($obj) {},
							
							above: 'auto',
							
							preventDoubleContext: true,
							
							compress: false
							
						};
						
						function initialize (opts) {
							
							options = $.extend({}, options, opts);
							
							$(document).on('click', 'html', function () {
								
								$('.dropdown-context').fadeOut(options.fadeSpeed, function () {
									
									$('.dropdown-context').css({
										
										display: ''
										
									}).find('.drop-left').removeClass('drop-left');
									
								});
								
							});
							
							if (options.preventDoubleContext) {
								
								$(document).on('contextmenu', '.dropdown-context', function (e) {
									
									e.preventDefault();
									
								});
								
							}
							
							$(document).on('mouseenter', '.dropdown-submenu', function () {
								
								var $sub = $(this).find('.dropdown-context-sub:first'),
									
									subWidth = $sub.width(),
									
									subLeft = $sub.offset().left,
									
									collision = (subWidth + subLeft) > window.innerWidth;
								
								if (collision) {
									
									$sub.addClass('drop-left');
									
								}
								
							});
							
						}
						
						function updateOptions(opts) {
							
							options = $.extend({}, options, opts);
							
						}
						
						function buildMenu(data, id, subMenu) {
							
							var subClass = (subMenu) ? ' dropdown-context-sub' : '',
								
								compressed = options.compress ? ' compressed-context' : '',
								
								$menu = $('<ul class="dropdown-menu dropdown-context' + subClass + compressed + '" id="dropdown-' + id + '"></ul>');
							
							var i = 0,
								
								linkTarget = '';
							
							for (i; i < data.length; i++) {
								
								if (typeof data[i].divider !== 'undefined') {
									
									$menu.append('<li class="divider"></li>');
									
								} else if (typeof data[i].header !== 'undefined') {
									
									$menu.append('<li class="nav-header">' + data[i].header + '</li>');
									
								} else {
									
									if (typeof data[i].href == 'undefined') {
										
										data[i].href = '#';
										
									}
									
									if (typeof data[i].target !== 'undefined') {
										
										linkTarget = ' target="' + data[i].target + '"';
										
									}
									
									if (typeof data[i].subMenu !== 'undefined') {
										
										$sub = ('<li class="dropdown-submenu"><a tabindex="-1" href="' + data[i].href + '">' + data[i].text + '</a></li>');
										
									} else {
										
										$sub = $('<li><a tabindex="-1" href="' + data[i].href + '"' + linkTarget + '>' + data[i].text + '</a></li>');
										
									}
									
									if (typeof data[i].action !== 'undefined') {
										
										var actiond = new Date(),
											
											actionID = 'event-' + actiond.getTime() * Math.floor(Math.random() * 100000),
											
											eventAction = data[i].action;
										
										$sub.find('a').attr('id', actionID);
										
										$('#' + actionID).addClass('context-event');
										
										$(document).on('click', '#' + actionID, eventAction);
										
									}
									
									$menu.append($sub);
									
									if (typeof data[i].subMenu != 'undefined') {
										
										var subMenuData = buildMenu(data[i].subMenu, id, true);
										
										$menu.find('li:last').append(subMenuData);
										
									}
									
								}
								
								if (typeof options.filter == 'function') {
									
									options.filter($menu.find('li:last'));
									
								}
								
							}
							
							return $menu;
							
						}
						
						function addContext (selector, data) {
							
							var d = new Date(),
								
								id = d.getTime(),
								
								$menu = buildMenu(data, id);
							
							$('body').append($menu);
							
							$(document).on('contextmenu', selector, function (e) {
								
								e.preventDefault();
								
								e.stopPropagation();
								
								$('.dropdown-context:not(.dropdown-context-sub)').hide();
								
								$dd = $('#dropdown-' + id);
								
								if (typeof options.above == 'boolean' && options.above) {
									
									$dd.addClass('dropdown-context-up').css({
										
										top: e.pageY - 20 - $('#dropdown-' + id).height(),
										
										left: e.pageX - 13
										
									}).fadeIn(options.fadeSpeed);
									
								} else if (typeof options.above == 'string' && options.above == 'auto') {
									
									$dd.removeClass('dropdown-context-up');
									
									var autoH = $dd.height() + 12;
									
									if ((e.pageY + autoH) > $('html').height()) {
										
										$dd.addClass('dropdown-context-up').css({
											
											top: e.pageY - 20 - autoH,
											
											left: e.pageX - 13
											
										}).fadeIn(options.fadeSpeed);
										
									} else {
										
										$dd.css({
											
											top: e.pageY + 10,
											
											left: e.pageX - 13
											
										}).fadeIn(options.fadeSpeed);
										
									}
									
								}
								
							});
							
						}
						
						function destroyContext(selector) {
							
							$(document).off('contextmenu', selector).off('click', '.context-event');
							
						}
						
						return {
							
							init: initialize,
							
							settings: updateOptions,
							
							attach: addContext,
							
							destroy: destroyContext
							
						};
						
					})();
					
				},
				
				init: function () {
					
					this.core();
					
					context.init({preventDoubleContext: false});
					
					context.attach('html', [{
						
						header: '我爱我贷网'
						
					},  {
						
						text: '首页',
						
						href: '#'
						
					}, {
						
						text: '投资项目',
						
						href: '#'
						
					}, {
						
						text: '投资流程',
						
						href: '#'
						
					}, {
						
						text: '关于我们',
						
						href: '#'
						
					}, {
						
						divider: true
						
					}, {
						
						text: '免费注册',
						
						href: '#'
						
					}, {
						
						text: '登录',
						
						href: '#'
						
					}, {
						
						text: '充值',
						
						href: '#'
						
					}, {
						
						text: '帮助中心',
						
						href: '#'
						
					}]);
					
				}
				
			};
			
		} ()).init();
		
	};
	
	_AMD = (function (_register, _module) {
		
		var hasDefine, registryProfile;
		
		hasDefine = typeof define === "function" && define.amd;
		
		registryProfile = function () {
			
			hasDefine ? define(_module) : console.error('Sorry! There is no "define" object.');
			
		};
		
		return {
			
			init: registryProfile
			
		};
		
	}(_AMD || {}, fn)).init();
	
}(require, (typeof console !== 'undefined' ? console : undefined)));