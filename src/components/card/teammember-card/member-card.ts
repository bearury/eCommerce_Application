import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './member-card.module.scss';
import Image from '@components/image/image';
import { svgHtmlGitHubLogo } from '@components/svg/github-logo';

type TeamMemberInfo = {
  linkPhoto: string;
  name: string;
  linkGitHub: string;
  role: string;
  bio: string;
  contributions: string;
};

export class TeamMemberCard extends View {
  photo: Image;

  name: HTMLElement;

  link: HTMLElement;

  role: HTMLElement;

  bioLabel: HTMLElement;

  bio: HTMLElement;

  contributionsLabel: HTMLElement;

  contributions: HTMLElement;

  constructor({ linkPhoto, name, linkGitHub, role, bio, contributions }: TeamMemberInfo) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.card],
    };
    super(params);

    this.photo = new Image({ classNames: [styles.image], img: linkPhoto });

    this.link = new ElementCreator({
      tag: 'a',
      classNames: [styles.link],
      attribute: [
        { type: 'href', value: linkGitHub },
        { type: 'target', value: '_blank' },
      ],
    }).getElement();

    this.name = new ElementCreator({
      tag: 'h5',
      classNames: [styles.name],
      textContent: name,
      children: [this.link],
    }).getElement();

    this.role = new ElementCreator({
      tag: 'div',
      classNames: [styles.role],
      textContent: role,
    }).getElement();

    this.bioLabel = new ElementCreator({
      tag: 'h5',
      classNames: [styles.label],
      textContent: 'Bio',
    }).getElement();

    this.bio = new ElementCreator({
      tag: 'div',
      classNames: [styles.bio],
      textContent: bio,
    }).getElement();

    this.contributionsLabel = new ElementCreator({
      tag: 'h5',
      classNames: [styles.label],
      textContent: 'Contributions',
    }).getElement();

    this.contributions = new ElementCreator({
      tag: 'div',
      classNames: [styles.contributions],
      textContent: contributions,
    }).getElement();

    this.configureView();
  }

  private configureView(): void {
    const card: HTMLElement = this.getElement();
    this.link.innerHTML = svgHtmlGitHubLogo;

    card.append(
      this.photo.getElement(),
      this.name,
      this.role,
      this.bioLabel,
      this.bio,
      this.contributionsLabel,
      this.contributions
    );
  }
}
