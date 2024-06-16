import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './about-page.module.scss';
import Router from '@router/router.ts';
import { TeamMemberCard } from '@components/card/teammember-card/member-card';
import { svgHtmlRSSLogo } from '@components/svg/rss-logo';

export default class AboutPage extends View {
  title: HTMLElement;

  teamMembersBlock: HTMLElement;

  logoLink: HTMLElement;

  router: Router;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
    };
    super(params);
    this.router = router;

    this.title = new ElementCreator({
      tag: 'h2',
      classNames: [styles.title],
      textContent: '🥭 Mango Team',
    }).getElement();

    this.teamMembersBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.teamMembersBlock],
    }).getElement();

    this.logoLink = new ElementCreator({
      tag: 'a',
      classNames: [styles.logo],
      attribute: [
        { type: 'href', value: 'https://rs.school/' },
        { type: 'target', value: '_blank' },
      ],
    }).getElement();

    this.configureView();
  }

  private configureView(): void {
    const aboutPage = this.getElement();
    this.logoLink.innerHTML = svgHtmlRSSLogo;

    const cardYuri: HTMLElement = new TeamMemberCard({
      linkPhoto: 'https://github.com/webjsmaster.png',
      name: 'Yuri Medvedev',
      linkGitHub: 'https://github.com/webjsmaster',
      role: 'Frontend Developer | Team Lead',
      bio: 'Creating web applications is my passion',
      contributions:
        'Managing the global state of the app. Implemented many features of the project and organized a team work.',
    }).getElement();

    const cardIgor: HTMLElement = new TeamMemberCard({
      linkPhoto: 'https://github.com/Frost-704.png',
      name: 'Igor Samgin',
      linkGitHub: 'https://github.com/Frost-704',
      role: 'Frontend Developer',
      bio: 'Freelancer',
      contributions:
        'Working with API, Implemented Login, Registration and User Page, added a feature to add/remove product to cart.',
    }).getElement();

    const cardNastya: HTMLElement = new TeamMemberCard({
      linkPhoto: 'https://github.com/anastshak.png',
      name: 'Anastasia Shakura',
      linkGitHub: 'https://github.com/anastshak',
      role: 'Frontend Developer',
      bio: 'I like to write code, drink coffee and go for a walk',
      contributions: 'Implemented most of layout, Detailed product page and some features.',
    }).getElement();

    this.teamMembersBlock.append(cardYuri, cardIgor, cardNastya);

    aboutPage.append(this.title, this.teamMembersBlock, this.logoLink);
  }
}
