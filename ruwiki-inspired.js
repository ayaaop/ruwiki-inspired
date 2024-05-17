// ==UserScript==
// @name         Fandom Article Formatter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Format Fandom articles and check the ToC checkbox
// @author       copilot and gpt4o
// @match        *://*.fandom.com/*
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        var $body = $('body');
        var $mwOutput = $('.mw-body-content > .mw-parser-output');
        var $pageHeader = $('.page-header').detach();
        var $toc = $mwOutput.find('.toc').find('input.toctogglecheckbox').prop('checked', true).end();
        var $infobox = $mwOutput.find('.portable-infobox');
        var $tocPrev = $toc.prev();
        var $infoboxPrev = $infobox.prev();
        var $section;

        if ($body.hasClass('mainpage')) {
            $mwOutput.wrapInner('<section class="preamble-section"></section>').find('.preamble-section').prepend($pageHeader);
        } else {
            $section = $('<section class="preamble-section"></section>').prepend($pageHeader).prependTo($mwOutput);
            $mwOutput.contents().each(function() {
                var $this = $(this);
                if (this.nodeType === 3 && $.trim(this.nodeValue)) {
                    $section.append(this);
                } else if (this.nodeType === 1 && this.tagName === 'H2') {
                    $section = $('<section class="article-section"></section>').insertAfter($section).append(this);
                } else {
                    $section.append(this);
                }
            });
        }

        $(window).scroll(function() {
            $toc.toggleClass('scrolled', $(this).scrollTop() > 0);
        });

        function updateLayout() {
            var $rightRail = $('.page__right-rail');
            var $rightRailWrapper = $('.right-rail-wrapper');
            if ($rightRail.hasClass('is-rail-hidden')) {
                $toc.insertAfter($tocPrev).removeClass('rail-module');
                $infobox.insertAfter($infoboxPrev).removeClass('rail-module');
                $body.removeClass('right-rail-visible');
            } else {
                $toc.detach().addClass('rail-module').prependTo($rightRailWrapper);
                $infobox.detach().addClass('rail-module').prependTo($rightRailWrapper);
                $body.addClass('right-rail-visible');
            }
        }

        updateLayout();
        $('.right-rail-toggle').click(function() {
            setTimeout(updateLayout, 0);
        });
    });
})();