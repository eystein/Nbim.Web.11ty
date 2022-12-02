/* eslint-disable quotes */
import 'core-js';
// that got deprecated at 'Babel 7.4.0'
import Headroom from 'headroom.js';
// Relative imports
// import '../scss/main.scss';
import articleFeedback from './articleFeedback';
import { isIE11 } from './helpers';
import nbimToggler from './nbimToggler';
import nbimTableColumnToggler from './nbimTableColumnToggler';
import nbimFilterSelect from './nbimFilterSelect';
import nbimSearchToggler from './nbimSearchToggler';
import nbimMenuMobileToggler from './nbimMenuMobileToggler';
import nbimFoldedTableToggler from './nbimFoldedTableToggler';
import nbimTableScrollIndicator from './nbimTableScrollIndicator';
import nbimScrollTo from './nbimScrollTo';
import nbimTabSwitcher from './nbimTabSwitcher';
import nbimLazyImage from './nbimLazyImage';
import nbimAddWrapperClassIfUrlParam from './nbimAddWrapperClassIfUrlParam';
import nbimTableToExcel from './nbimTableToExcel';
import containsString from './../../utils/containsStringUtil';
import {
	termsChangeEventHandler,
	inputChangeEventHandler,
	initialRender,
} from './subscription';

const envUrl = location.host;
const inputEmail = document.getElementById('mail');
const acceptTerms = document.getElementById('Confirm');

// Fire-up 'Sentry' on production with feature flag.
if (
	containsString(envUrl, 'www.nbim.no') &&
	typeof window === 'object' &&
	window.netlife.useSentry === true
) {
	// Append Sentry script, wait until loaded and init.
	if (typeof document.body === 'object') {
		const sentryScript = document.createElement('script');
		sentryScript.src = '//browser.sentry-cdn.com/5.21.1/bundle.min.js';
		sentryScript.integrity =
			'sha384-uFON5MXfE3NkWO60hM8JaXAYAV0fqTCQbdy282z8YfelqBoXx+F7JFzX6+WfFIML';
		sentryScript.crossOrigin = 'anonymous';
		document.body.appendChild(sentryScript);
		sentryScript.onload = () => {
			// eslint-disable-next-line
			Sentry.init({
				dsn: 'https://7274037bb6fe488a81181f87af9203ee@o205316.ingest.sentry.io/1322851',
			});
			// eslint-disable-next-line
			Sentry.configureScope((scope) => {
				// Pass environment to sentry, so we can easily filter errors by environment
				scope.setTag('env', envUrl);
			});
		};
	}
}

document.addEventListener('DOMContentLoaded', () => {
	if (inputEmail !== null) {
		initialRender();
		inputEmail.oninput = inputChangeEventHandler;
		acceptTerms.onchange = termsChangeEventHandler;
	}

	articleFeedback('article-feedback');
	// Quick fix to enable dynamic toggler. Ref: https://bvnetwork.sifterapp.com/issues/3304
	// TODO: Refactor nbimToggler so that we toggle on className, not ID. Ref: https://bvnetwork.sifterapp.com/issues/3310
	if (typeof window === 'object') {
		const { netlife: { togglers = [] } = {} } = window;
		togglers.forEach((toggler) => {
			nbimToggler(toggler);
		});
	}
	nbimToggler('section-accordions-jobs');
	nbimToggler('section-offices-vaare-kontorer');
	nbimToggler('section-contacts-nbim');
	nbimToggler('section-contacts-nbrem');
	nbimToggler('article-footnotes');
	nbimToggler('section-vacancies');
	nbimToggler('section-accordion');
	nbimSearchToggler('header-proto');
	nbimMenuMobileToggler('header-proto');
	nbimFoldedTableToggler();
	nbimTableColumnToggler();
	nbimTableScrollIndicator();
	if (isIE11) {
		// Hide buttons
		const nbimScrollDownButtonEl = document.getElementById(
			'nbimScrollDownButton'
		);
		if (nbimScrollDownButtonEl) {
			nbimScrollDownButtonEl.style.display = 'none';
		}
		const nbimScrollUpButtonEl = document.getElementById('nbimScrollUpButton');
		if (nbimScrollUpButtonEl) nbimScrollDownButtonEl.style.display = 'none';
	} else {
		nbimScrollTo('nbimScrollDownButton', 'nbimScrollDownButton');
		nbimScrollTo('nbimScrollUpButton', null, true);
	}
	// 'transparency-reports'
	nbimFilterSelect({
		mainElId: 'filter-select-year',
		subElId: 'filter-select-type-report',
		sharedListsClass: 'section__lists-with-filter--list',
	});
	// 'video-archive'
	nbimFilterSelect({
		mainElId: 'filter-select-type-video-archive',
		subElId: 'filter-select-year-video-archive',
		sharedListsClass: 'section__lists-with-filter--list',
		targetList: true,
		whenFilteredDoNotShow: 'when-filtered--do-not-show',
		whenFilteredDoShow: 'when-filtered--do-show',
	});
	nbimLazyImage('nbim-lazy-image', 'nbim-lazy-image--animate');
	nbimAddWrapperClassIfUrlParam('show-helpers', 'helpers');
	nbimTabSwitcher('section__tabs__wrapper', 'section__tabs__content-wrapper');

	if (typeof XLSX !== 'undefined') {
		nbimTableToExcel();
	}

	const headerProto = document.getElementById('header-proto');
	if (headerProto) {
		const headroom = new Headroom(headerProto, {
			offset: 100, // We want the header to scroll past itself
		});
		headroom.init();
	}
	// Add class to body if user is using tabs to access links.
	// We are using this when no outline is wanted but added for UU when needed.
	const handleFirstTab = (e) => {
		if (e.keyCode === 9) {
			document.body.classList.add('user-is-tabbing');
			window.removeEventListener('keydown', handleFirstTab);
		}
	};
	window.addEventListener('keydown', handleFirstTab);
});
